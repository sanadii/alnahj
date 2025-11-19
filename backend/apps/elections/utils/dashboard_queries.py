"""
Dashboard Query Functions

Contains all database query logic for dashboard APIs.
"""
from collections import defaultdict, OrderedDict
from datetime import datetime, timedelta

from django.db.models import Count, Q, Max, Sum
from django.db.models.functions import TruncDate, ExtractHour
from django.utils import timezone


DEFAULT_DISTRIBUTION_LIMIT = 12
MAX_DISTRIBUTION_SERIES = 8
ELECTOR_DISTRIBUTION_FIELDS = OrderedDict({
    'family': {
        'field': 'family_name',
        'title': 'Families'
    },
    'gender': {
        'field': 'gender',
        'title': 'Gender'
    },
    'department': {
        'field': 'department',
        'title': 'Departments'
    },
    'team': {
        'field': 'team',
        'title': 'Teams'
    }
})


def _format_distribution_value(dimension, value):
    """Format raw database value into a key/label pair for distribution charts."""
    fallback = 'Unspecified'

    if value in (None, '', 'UNKNOWN', 'UNASSIGNED'):
        return 'unspecified', fallback

    if dimension == 'gender':
        gender_map = {
            'MALE': ('male', 'Male'),
            'FEMALE': ('female', 'Female'),
            'OTHER': ('other', 'Other')
        }
        return gender_map.get(value, (str(value).lower(), str(value).title()))

    key = str(value).strip()
    if not key:
        return 'unspecified', fallback

    return key, key


def _normalize_dimension(value, default='family'):
    """Ensure dimension identifiers are valid."""
    if not value:
        return default

    dimension = str(value).lower()
    if dimension not in ELECTOR_DISTRIBUTION_FIELDS:
        raise ValueError(f"Unsupported dimension '{value}'")
    return dimension


def _clean_text(value, fallback):
    """Normalize string values with a fallback."""
    if value is None:
        return fallback
    if isinstance(value, str):
        cleaned = value.strip()
        return cleaned if cleaned else fallback
    return str(value)


def _build_full_name(first_name, last_name, fallback):
    """Construct full name with graceful fallback."""
    first = _clean_text(first_name, '')
    last = _clean_text(last_name, '')
    combined = ' '.join(part for part in [first, last] if part)
    return combined if combined else fallback


def get_guarantees_trend(user, period='30days'):
    """
    Get daily guarantee trend data.
    
    Args:
        user: Current user
        period: Time period ('7days', '30days', '90days', 'all')
    
    Returns:
        QuerySet with date, strong, medium, weak counts
    """
    from apps.guarantees.models import Guarantee
    
    # Calculate date range
    end_date = datetime.now().date()
    period_map = {'7days': 7, '30days': 30, '90days': 90}
    
    if period != 'all':
        start_date = end_date - timedelta(days=period_map.get(period, 30))
    else:
        start_date = None
    
    # Base query
    queryset = Guarantee.objects.filter(user=user)
    
    # Apply date filter
    if start_date:
        queryset = queryset.filter(created_at__date__gte=start_date)
    
    # Group by date and count by status
    data = (
        queryset.annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(
            pending=Count('id', filter=Q(guarantee_status='PENDING')),
            guaranteed=Count('id', filter=Q(guarantee_status='GUARANTEED')),
            not_available=Count('id', filter=Q(confirmation_status='NOT_AVAILABLE')),
            total=Count('id'),
        )
        .order_by('date')
    )
    
    return data


def get_group_performance(user, status_filter='all'):
    """
    Get performance metrics for guarantee groups.
    
    Args:
        user: Current user
        status_filter: 'active', 'inactive', 'pending', or 'all'
    
    Returns:
        List of group performance data
    """
    from apps.guarantees.models import GuaranteeGroup
    
    groups = GuaranteeGroup.objects.filter(user=user).annotate(
        guarantees_count=Count('guarantees'),
        pending_count=Count('guarantees', filter=Q(guarantees__guarantee_status='PENDING')),
        guaranteed_count=Count('guarantees', filter=Q(guarantees__guarantee_status='GUARANTEED')),
        not_available_count=Count('guarantees', filter=Q(guarantees__confirmation_status='NOT_AVAILABLE')),
        attended_count=Count('guarantees', filter=Q(guarantees__elector__attendance_records__status='ATTENDED')),
        last_activity=Max('guarantees__created_at')
    )
    
    # Calculate derived fields
    seven_days_ago = timezone.now() - timedelta(days=7)
    
    results = []
    for group in groups:
        # Determine status
        if group.guarantees_count == 0:
            group_status = 'pending'
        elif group.last_activity and group.last_activity >= seven_days_ago:
            group_status = 'active'
        else:
            group_status = 'inactive'
        
        # Apply filter
        if status_filter != 'all' and group_status != status_filter:
            continue
        
        conversion_rate = 0
        if group.guarantees_count > 0:
            conversion_rate = round(
                (group.guaranteed_count / group.guarantees_count) * 100,
                1
            )
        results.append({
            'id': group.id,
            'name': group.name,
            'leader': group.user.full_name or group.user.email,
            'leader_id': group.user_id,
            'members_count': group.guarantees_count,
            'guarantees_count': group.guarantees_count,
            'pending_count': group.pending_count,
            'guaranteed_count': group.guaranteed_count,
            'not_available_count': group.not_available_count,
            'attended_count': group.attended_count,
            'attendance_rate': round((group.attended_count / group.guarantees_count) * 100, 1) if group.guarantees_count > 0 else 0,
            'conversion_rate': conversion_rate,
            'last_activity': group.last_activity,
            'status': group_status
        })
    
    return results


def get_guarantee_distribution(election_id, dimension_x='family', dimension_y='area', limit=DEFAULT_DISTRIBUTION_LIMIT):
    """Aggregate guarantees into a two-dimensional distribution matrix."""
    from apps.guarantees.models import Guarantee

    status_labels = dict(Guarantee.GUARANTEE_STATUS_CHOICES)
    confirmation_labels = {
        'CONFIRMED': 'Confirmed',
        'PENDING': 'Pending',
        'NOT_AVAILABLE': 'Not Available',
        None: 'Unknown Confirmation'
    }
    gender_labels = {
        'MALE': 'Male',
        'FEMALE': 'Female'
    }

    def format_committee(row):
        name = _clean_text(row.get('elector__committee__name'), 'Unassigned Committee')
        code = _clean_text(row.get('elector__committee__code'), '')
        if code:
            return f"{name} ({code})"
        return name

    dimension_config = {
        'family': {
            'title': 'Families',
            'description': 'Elector family names collected through guarantees',
            'fields': ['elector__family_name'],
            'key_fn': lambda row: f"family::{_clean_text(row.get('elector__family_name'), 'Unspecified Family').lower()}",
            'label_fn': lambda row: _clean_text(row.get('elector__family_name'), 'Unspecified Family'),
        },
        'area': {
            'title': 'Areas',
            'description': 'Geographic areas of collected guarantees',
            'fields': ['elector__area'],
            'key_fn': lambda row: f"area::{_clean_text(row.get('elector__area'), 'Unspecified Area').lower()}",
            'label_fn': lambda row: _clean_text(row.get('elector__area'), 'Unspecified Area'),
        },
        'team': {
            'title': 'Teams',
            'description': 'Elector team affiliations',
            'fields': ['elector__team'],
            'key_fn': lambda row: f"team::{_clean_text(row.get('elector__team'), 'Unspecified Team').lower()}",
            'label_fn': lambda row: _clean_text(row.get('elector__team'), 'Unspecified Team'),
        },
        'department': {
            'title': 'Departments',
            'description': 'Elector departments',
            'fields': ['elector__department'],
            'key_fn': lambda row: f"department::{_clean_text(row.get('elector__department'), 'Unspecified Department').lower()}",
            'label_fn': lambda row: _clean_text(row.get('elector__department'), 'Unspecified Department'),
        },
        'gender': {
            'title': 'Gender',
            'description': 'Elector gender for guarantees',
            'fields': ['elector__gender'],
            'key_fn': lambda row: f"gender::{_clean_text(row.get('elector__gender'), 'UNKNOWN').upper()}",
            'label_fn': lambda row: gender_labels.get(row.get('elector__gender'), 'Unknown Gender'),
        },
        'collector': {
            'title': 'Collectors',
            'description': 'Users collecting guarantees',
            'fields': ['user_id', 'user__first_name', 'user__last_name'],
            'key_fn': lambda row: f"collector::{row.get('user_id') or 'unassigned'}",
            'label_fn': lambda row: _build_full_name(row.get('user__first_name'), row.get('user__last_name'), 'Unassigned Collector'),
        },
        'group': {
            'title': 'Groups',
            'description': 'Guarantee grouping categories',
            'fields': ['group_id', 'group__name'],
            'key_fn': lambda row: f"group::{row.get('group_id') or 'ungrouped'}",
            'label_fn': lambda row: _clean_text(row.get('group__name'), 'Ungrouped'),
        },
        'status': {
            'title': 'Guarantee Status',
            'description': 'Status classification (Pending/Guaranteed)',
            'fields': ['guarantee_status'],
            'key_fn': lambda row: f"status::{_clean_text(row.get('guarantee_status'), 'UNKNOWN').upper()}",
            'label_fn': lambda row: status_labels.get(row.get('guarantee_status'), 'Unknown Status'),
        },
        'confirmation': {
            'title': 'Confirmation Status',
            'description': 'Confirmation progress for guarantees',
            'fields': ['confirmation_status'],
            'key_fn': lambda row: f"confirmation::{_clean_text(row.get('confirmation_status'), 'UNKNOWN').upper()}",
            'label_fn': lambda row: confirmation_labels.get(row.get('confirmation_status'), 'Unknown Confirmation'),
        },
        'committee': {
            'title': 'Committees',
            'description': 'Committees associated with guarantees',
            'fields': ['elector__committee_id', 'elector__committee__name', 'elector__committee__code'],
            'key_fn': lambda row: f"committee::{row.get('elector__committee_id') or 'unassigned'}",
            'label_fn': format_committee,
        },
    }

    available_dimensions = [
        {
            'id': key,
            'label': config['title'],
            'description': config.get('description', ''),
        }
        for key, config in dimension_config.items()
    ]

    raw_limit = limit or DEFAULT_DISTRIBUTION_LIMIT
    limit_value = max(3, min(int(raw_limit), 25))

    dimension_x_key = (dimension_x or 'family').lower()
    dimension_y_key = (dimension_y or 'area').lower()

    if dimension_x_key not in dimension_config:
        raise ValueError(f"Unsupported dimension_x '{dimension_x}'")

    original_y_key = dimension_y_key
    if dimension_y_key not in dimension_config or dimension_y_key == dimension_x_key:
        for fallback in ['status', 'group', 'collector', 'area', 'team']:
            if fallback != dimension_x_key and fallback in dimension_config:
                dimension_y_key = fallback
                break

    if dimension_y_key not in dimension_config:
        raise ValueError(f"Unsupported dimension_y '{dimension_y}'")

    config_x = dimension_config[dimension_x_key]
    config_y = dimension_config[dimension_y_key]

    fields = list(config_x['fields'])
    for field in config_y['fields']:
        if field not in fields:
            fields.append(field)

    guarantees = Guarantee.objects.filter(
        elector__committee__election_id=election_id,
        elector__is_active=True
    )

    distribution_rows = guarantees.values(*fields).annotate(
        total=Count('id', distinct=True),
        attended=Count('id', filter=Q(elector__attendance_records__status='ATTENDED'), distinct=True)
    )

    matrix = defaultdict(lambda: defaultdict(lambda: {'count': 0, 'attended': 0}))
    x_labels = {}
    y_labels = {}
    x_totals = defaultdict(int)
    x_attended = defaultdict(int)
    y_totals = defaultdict(int)
    y_attended = defaultdict(int)

    for row in distribution_rows:
        x_key = config_x['key_fn'](row)
        y_key = config_y['key_fn'](row)
        x_label = config_x['label_fn'](row)
        y_label = config_y['label_fn'](row)

        count = row.get('total') or 0
        attended = row.get('attended') or 0

        x_labels[x_key] = x_label
        y_labels[y_key] = y_label

        matrix[x_key][y_key]['count'] += count
        matrix[x_key][y_key]['attended'] += attended

        x_totals[x_key] += count
        x_attended[x_key] += attended
        y_totals[y_key] += count
        y_attended[y_key] += attended

    sorted_categories = sorted(x_totals.items(), key=lambda item: item[1], reverse=True)
    if limit_value and len(sorted_categories) > limit_value:
        sorted_categories = sorted_categories[:limit_value]

    category_keys = [key for key, _ in sorted_categories]

    categories = []
    for key in category_keys:
        total = x_totals[key]
        attended_total = x_attended[key]
        percentage = round((attended_total / total * 100), 1) if total > 0 else 0.0
        categories.append({
            'key': key,
            'label': x_labels.get(key, key),
            'count': total,
            'attended': attended_total,
            'attendance_percentage': percentage,
        })

    included_y_totals = defaultdict(int)
    included_y_attended = defaultdict(int)
    for x_key in category_keys:
        for y_key, values in matrix.get(x_key, {}).items():
            included_y_totals[y_key] += values['count']
            included_y_attended[y_key] += values['attended']

    sorted_series_keys = sorted(included_y_totals.items(), key=lambda item: item[1], reverse=True)
    if len(sorted_series_keys) > MAX_DISTRIBUTION_SERIES:
        sorted_series_keys = sorted_series_keys[:MAX_DISTRIBUTION_SERIES]

    series = []
    for y_key, total in sorted_series_keys:
        if total == 0:
            continue

        data_points = []
        attended_points = []
        percentages = []

        for x_key in category_keys:
            cell = matrix.get(x_key, {}).get(y_key, {'count': 0, 'attended': 0})
            value = cell['count']
            attended_value = cell['attended']
            pct = round((attended_value / value * 100), 1) if value > 0 else 0.0
            data_points.append(value)
            attended_points.append(attended_value)
            percentages.append(pct)

        series.append({
            'key': y_key,
            'label': y_labels.get(y_key, y_key),
            'data': data_points,
            'attended': attended_points,
            'attendance_percentage': percentages,
            'total': sum(data_points),
        })

    x_totals_output = []
    for key in category_keys:
        total = x_totals[key]
        attended_total = x_attended[key]
        pct = round((attended_total / total * 100), 1) if total > 0 else 0.0
        x_totals_output.append({
            'key': key,
            'label': x_labels.get(key, key),
            'count': total,
            'attended': attended_total,
            'attendance_percentage': pct,
        })

    y_totals_output = []
    for y_key, total in sorted_series_keys:
        attended_total = included_y_attended[y_key]
        pct = round((attended_total / total * 100), 1) if total > 0 else 0.0
        y_totals_output.append({
            'key': y_key,
            'label': y_labels.get(y_key, y_key),
            'count': total,
            'attended': attended_total,
            'attendance_percentage': pct,
        })

    overall = sum(item['count'] for item in x_totals_output)

    return {
        'available_dimensions': available_dimensions,
        'x_dimension': {
            'id': dimension_x_key,
            'label': config_x['title'],
            'adjusted': False,
        },
        'y_dimension': {
            'id': dimension_y_key,
            'label': config_y['title'],
            'adjusted': dimension_y_key != original_y_key,
        },
        'categories': categories,
        'series': series,
        'totals': {
            'overall': overall,
            'x_totals': x_totals_output,
            'y_totals': y_totals_output,
        },
        'limit': limit_value,
        'series_limit': MAX_DISTRIBUTION_SERIES,
    }


def get_elector_distribution(election_id, primary, secondary=None, limit=None):
    """
    Build a flexible elector distribution dataset for dashboard visualisations.

    Args:
        election_id: Election identifier
        primary: Primary dimension (family|gender|department|team)
        secondary: Optional secondary dimension
        limit: Optional limit for number of primary categories
    Returns:
        Dict compatible with frontend charting requirements
    """
    from apps.electors.models import Elector

    primary_dimension = _normalize_dimension(primary, default='family')
    secondary_dimension = None
    if secondary not in (None, '', 'none'):
        secondary_dimension = _normalize_dimension(secondary, default=None)
        if secondary_dimension == primary_dimension:
            secondary_dimension = None

    limit_value = limit or DEFAULT_DISTRIBUTION_LIMIT
    try:
        limit_value = max(3, min(int(limit_value), 25))
    except (TypeError, ValueError):
        limit_value = DEFAULT_DISTRIBUTION_LIMIT

    field_map = ELECTOR_DISTRIBUTION_FIELDS
    primary_field = field_map[primary_dimension]['field']
    secondary_field = field_map[secondary_dimension]['field'] if secondary_dimension else None

    electors = Elector.objects.filter(
        committee__election_id=election_id,
        is_active=True
    )

    if not electors.exists():
        return {
            'primary': primary_dimension,
            'secondary': secondary_dimension,
            'categories': [],
            'secondary_categories': [],
            'series': [],
            'totals': {
                'total_electors': 0,
                'primary_count': 0,
                'secondary_count': 0
            },
            'meta': {
                'limit': limit_value,
                'election_id': election_id
            }
        }

    categories = []
    secondary_categories = []
    series = []

    if secondary_field:
        distribution_rows = electors.values(primary_field, secondary_field).annotate(
            total=Count('koc_id')
        )

        matrix = defaultdict(lambda: defaultdict(int))
        primary_totals = defaultdict(int)
        secondary_totals = defaultdict(int)
        primary_labels = {}
        secondary_labels = {}

        for row in distribution_rows:
            raw_primary = row.get(primary_field)
            raw_secondary = row.get(secondary_field)

            primary_key, primary_label = _format_distribution_value(primary_dimension, raw_primary)
            secondary_key, secondary_label = _format_distribution_value(secondary_dimension, raw_secondary)

            count = row.get('total') or 0

            matrix[primary_key][secondary_key] += count
            primary_totals[primary_key] += count
            secondary_totals[secondary_key] += count
            primary_labels[primary_key] = primary_label
            secondary_labels[secondary_key] = secondary_label

        sorted_primary = sorted(primary_totals.items(), key=lambda item: item[1], reverse=True)
        if len(sorted_primary) > limit_value:
            sorted_primary = sorted_primary[:limit_value]
        primary_keys = [key for key, _ in sorted_primary]

        sorted_secondary = sorted(secondary_totals.items(), key=lambda item: item[1], reverse=True)
        secondary_keys = [key for key, total in sorted_secondary if total > 0]
        if len(secondary_keys) > MAX_DISTRIBUTION_SERIES:
            secondary_keys = secondary_keys[:MAX_DISTRIBUTION_SERIES]

        categories = [
            {
                'key': key,
                'label': primary_labels.get(key, key),
                'total': primary_totals.get(key, 0)
            }
            for key in primary_keys
        ]

        secondary_categories = [
            {
                'key': key,
                'label': secondary_labels.get(key, key),
                'total': secondary_totals.get(key, 0)
            }
            for key in secondary_keys
        ]

        for secondary_key in secondary_keys:
            data_points = [matrix.get(primary_key, {}).get(secondary_key, 0) for primary_key in primary_keys]
            total_series = sum(data_points)
            if total_series == 0:
                continue
            series.append({
                'key': secondary_key,
                'label': secondary_labels.get(secondary_key, secondary_key),
                'data': data_points,
                'total': total_series
            })

    else:
        distribution_rows = electors.values(primary_field).annotate(
            total=Count('koc_id'),
            male=Count('koc_id', filter=Q(gender='MALE')),
            female=Count('koc_id', filter=Q(gender='FEMALE'))
        )

        category_map = {}

        for row in distribution_rows:
            raw_primary = row.get(primary_field)
            primary_key, primary_label = _format_distribution_value(primary_dimension, raw_primary)

            total = row.get('total') or 0
            male = row.get('male') or 0
            female = row.get('female') or 0

            category_map[primary_key] = {
                'key': primary_key,
                'label': primary_label,
                'total': total,
                'male': male,
                'female': female
            }

        sorted_categories = sorted(category_map.values(), key=lambda item: item['total'], reverse=True)
        if len(sorted_categories) > limit_value:
            sorted_categories = sorted_categories[:limit_value]

        categories = [
            {
                'key': item['key'],
                'label': item['label'],
                'total': item['total']
            }
            for item in sorted_categories
        ]

        series = [
            {
                'key': 'total',
                'label': 'Total Electors',
                'data': [item['total'] for item in sorted_categories],
                'total': sum(item['total'] for item in sorted_categories)
            },
            {
                'key': 'male',
                'label': 'Male',
                'data': [item['male'] for item in sorted_categories],
                'total': sum(item['male'] for item in sorted_categories)
            },
            {
                'key': 'female',
                'label': 'Female',
                'data': [item['female'] for item in sorted_categories],
                'total': sum(item['female'] for item in sorted_categories)
            }
        ]

    included_total = sum(category['total'] for category in categories)

    return {
        'primary': primary_dimension,
        'secondary': secondary_dimension,
        'categories': categories,
        'secondary_categories': secondary_categories,
        'series': series,
        'totals': {
            'total_electors': included_total,
            'primary_count': len(categories),
            'secondary_count': len(secondary_categories)
        },
        'meta': {
            'limit': limit_value,
            'election_id': election_id,
            'primary_label': ELECTOR_DISTRIBUTION_FIELDS[primary_dimension]['title'],
            'secondary_label': ELECTOR_DISTRIBUTION_FIELDS[secondary_dimension]['title'] if secondary_dimension else None
        }
    }


def get_hourly_attendance(election_id, date=None):
    """
    Get hourly attendance breakdown.
    
    Args:
        election_id: Election ID
        date: Date string (YYYY-MM-DD) or None for today
    
    Returns:
        List of hourly attendance data
    """
    from apps.attendees.models import Attendance
    from apps.elections.models import Committee
    
    # Parse date
    if date:
        try:
            target_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            target_date = datetime.now().date()
    else:
        target_date = datetime.now().date()
    
    # Get committees for this election
    committees = Committee.objects.filter(election_id=election_id)
    
    # Get attendance for the date
    attendance_qs = Attendance.objects.filter(
        committee__in=committees,
        attended_at__date=target_date
    ).annotate(
        hour=ExtractHour('attended_at')
    )
    
    # Group by hour and count
    hourly_data = attendance_qs.values('hour').annotate(
        attendance_count=Count('id')
    ).order_by('hour')
    
    # Get vote counts per hour (if voting model exists)
    try:
        from apps.voting.models import VoteCount
        votes_qs = VoteCount.objects.filter(
            committee__in=committees,
            created_at__date=target_date
        ).annotate(
            hour=ExtractHour('created_at')
        )
        
        hourly_votes = votes_qs.values('hour').annotate(
            vote_count=Count('id')
        ).order_by('hour')
    except (ImportError, AttributeError):
        hourly_votes = []
    
    # Create hour map (08:00 to 17:00)
    hour_map = {hour: {'attendance': 0, 'votes': 0} for hour in range(8, 18)}
    
    # Fill attendance data
    for item in hourly_data:
        if 8 <= item['hour'] <= 17:
            hour_map[item['hour']]['attendance'] = item['attendance_count']
    
    # Fill vote data
    for item in hourly_votes:
        if 8 <= item['hour'] <= 17:
            hour_map[item['hour']]['votes'] = item['vote_count']
    
    # Calculate target
    total_electors = sum(c.electors.filter(is_active=True).count() for c in committees)
    target_per_hour = round(total_electors / 10) if total_electors > 0 else 0  # 10 hours
    
    # Format result
    result = []
    for hour in range(8, 18):
        result.append({
            'hour': f"{hour:02d}:00",
            'attendance': hour_map[hour]['attendance'],
            'votes': min(hour_map[hour]['votes'], hour_map[hour]['attendance']),  # Votes can't exceed attendance
            'target': target_per_hour
        })
    
    return result


def get_elector_demographics(election_id):
    """
    Get demographic breakdown of electors.
    
    Args:
        election_id: Election ID
    
    Returns:
        Dict with comprehensive demographic data
    """
    from apps.electors.models import Elector
    from apps.elections.models import Committee
    from apps.attendees.models import Attendance
    
    # Get committees for this election
    committees = Committee.objects.filter(election_id=election_id)
    
    # Get all active electors
    electors = Elector.objects.filter(
        committee__in=committees,
        is_active=True
    )
    
    # Overall counts
    total = electors.count()
    male_count = electors.filter(gender='MALE').count()
    female_count = electors.filter(gender='FEMALE').count()
    
    male_percentage = round((male_count / total * 100), 1) if total > 0 else 0
    female_percentage = round((female_count / total * 100), 1) if total > 0 else 0
    
    # By Gender (simple breakdown)
    by_gender = [
        {
            'gender': 'Male',
            'count': male_count,
            'percentage': male_percentage
        },
        {
            'gender': 'Female',
            'count': female_count,
            'percentage': female_percentage
        }
    ]
    
    # By Area (using elector's area field)
    by_area = []
    area_data = electors.exclude(area__isnull=True).exclude(area='').values('area').annotate(
        total_electors=Count('koc_id'),
        male=Count('koc_id', filter=Q(gender='MALE')),
        female=Count('koc_id', filter=Q(gender='FEMALE'))
    ).order_by('area')
    
    for area_item in area_data:
        area_name = area_item['area']
        area_electors = electors.filter(area=area_name)
        
        # Get attendance for this area
        area_attendance = Attendance.objects.filter(
            elector__in=area_electors,
            elector__is_active=True
        ).values('elector').distinct().count()
        
        attendance_percentage = round((area_attendance / area_item['total_electors'] * 100), 1) if area_item['total_electors'] > 0 else 0
        
        by_area.append({
            'code': area_name[:10].upper(),  # Use first 10 chars as code
            'name': area_name,
            'total_electors': area_item['total_electors'],
            'attended': area_attendance,
            'attendance_percentage': attendance_percentage,
            'male': area_item['male'],
            'female': area_item['female']
        })
    
    # By Department
    by_department = []
    department_data = electors.exclude(department__isnull=True).exclude(department='').values('department').annotate(
        total_electors=Count('koc_id'),
        male=Count('koc_id', filter=Q(gender='MALE')),
        female=Count('koc_id', filter=Q(gender='FEMALE'))
    ).order_by('department')

    for department_item in department_data:
        department_name = department_item['department']
        department_electors = electors.filter(department=department_name)

        department_attendance = Attendance.objects.filter(
            elector__in=department_electors,
            elector__is_active=True
        ).values('elector').distinct().count()

        attendance_percentage = round((department_attendance / department_item['total_electors'] * 100), 1) if department_item['total_electors'] > 0 else 0

        by_department.append({
            'code': department_name[:10].upper(),
            'name': department_name,
            'total_electors': department_item['total_electors'],
            'attended': department_attendance,
            'attendance_percentage': attendance_percentage,
            'male': department_item['male'],
            'female': department_item['female']
        })

    # By Team (using elector's team field)
    by_team = []
    team_data = electors.exclude(team__isnull=True).exclude(team='').values('team').annotate(
        total_electors=Count('koc_id'),
        male=Count('koc_id', filter=Q(gender='MALE')),
        female=Count('koc_id', filter=Q(gender='FEMALE'))
    ).order_by('team')

    for team_item in team_data:
        team_name = team_item['team']
        team_electors = electors.filter(team=team_name)

        team_attendance = Attendance.objects.filter(
            elector__in=team_electors,
            elector__is_active=True
        ).values('elector').distinct().count()

        attendance_percentage = round((team_attendance / team_item['total_electors'] * 100), 1) if team_item['total_electors'] > 0 else 0

        by_team.append({
            'code': team_name[:10].upper(),
            'name': team_name,
            'total_electors': team_item['total_electors'],
            'attended': team_attendance,
            'attendance_percentage': attendance_percentage,
            'male': team_item['male'],
            'female': team_item['female']
        })
    
    # By family (all families ordered by count)
    by_family = electors.values('family_name').annotate(
        count=Count('koc_id'),
        male=Count('koc_id', filter=Q(gender='MALE')),
        female=Count('koc_id', filter=Q(gender='FEMALE'))
    ).order_by('-count')
    
    by_family_list = [
        {
            'family_name': item['family_name'],
            'count': item['count'],
            'male': item['male'],
            'female': item['female']
        }
        for item in by_family
    ]
    
    return {
        'by_gender': by_gender,
        'by_area': by_area,
        'by_department': by_department,
        'by_team': by_team,
        'by_family': by_family_list
    }


def get_attendance_dashboard(election_id):
    """
    Get comprehensive attendance dashboard data.
    
    Args:
        election_id: Election ID
    
    Returns:
        Dictionary with attendance metrics and committee breakdown
    """
    from apps.elections.models import Election, Committee
    from apps.attendees.models import Attendance
    from apps.voting.models import VoteCount
    from apps.electors.models import Elector
    from apps.guarantees.models import Guarantee
    
    try:
        election = Election.objects.get(id=election_id)
    except Election.DoesNotExist:
        return None
    
    # Get all committees for this election
    committees = Committee.objects.filter(election=election).prefetch_related(
        'electors', 'attendances'
    )
    
    # Overall metrics
    total_electors = Elector.objects.filter(
        committee__election=election,
        is_active=True
    ).count()
    
    total_attendance = Attendance.objects.filter(
        committee__election=election
    ).count()
    
    total_votes = VoteCount.objects.filter(
        committee__election=election
    ).aggregate(total=Sum('vote_count'))['total'] or 0
    
    # Calculate percentages
    attendance_percentage = round((total_attendance / total_electors * 100), 2) if total_electors > 0 else 0
    voting_percentage = round((total_votes / total_attendance * 100), 2) if total_attendance > 0 else 0
    participation_rate = round((total_votes / total_electors * 100), 2) if total_electors > 0 else 0
    
    # Committee breakdown
    committee_data = []
    for committee in committees:
        committee_electors = committee.elector_count
        committee_elector_attendance = committee.attendance_count
        committee_guarantees = committee.guarantee_count
        committee_guarantee_attendance = committee.guarantee_attendance_count
        
        elector_attendance_pct = round((committee_elector_attendance / committee_electors * 100), 2) if committee_electors > 0 else 0
        guarantee_attendance_pct = round((committee_guarantee_attendance / committee_guarantees * 100), 2) if committee_guarantees > 0 else 0
        
        committee_data.append({
            'id': committee.id,
            'code': committee.code,
            'name': committee.name,
            'gender': committee.gender,
            'elector_count': committee_electors,
            'elector_attendance_count': committee_elector_attendance,
            'elector_attendance_percentage': elector_attendance_pct,
            'guarantee_count': committee_guarantees,
            'guarantee_attendance_count': committee_guarantee_attendance,
            'guarantee_attendance_percentage': guarantee_attendance_pct,
        })
    
    # Guarantees breakdown by user and group
    guarantees_qs = Guarantee.objects.filter(
        elector__committee__election=election
    ).select_related('user', 'group', 'elector')
    
    guarantees_by_user = []
    guarantees_by_group = []
    guarantees_by_user_groups_map = {}
    
    if guarantees_qs.exists():
        guarantees_by_user = [
            {
                'user_id': row['user_id'],
                'user_name': f"{row['user__first_name']} {row['user__last_name']}".strip() or 'Unassigned User',
                'total_guarantees': row['total_guarantees'],
                'attended': row['attended_guarantees'],
                'attendance_percentage': round((row['attended_guarantees'] / row['total_guarantees'] * 100), 2) if row['total_guarantees'] > 0 else 0
            }
            for row in guarantees_qs.values(
                'user_id',
                'user__first_name',
                'user__last_name'
            ).annotate(
                total_guarantees=Count('id'),
                attended_guarantees=Count('id', filter=Q(elector__attendance_records__status='ATTENDED'))
            ).order_by('user__first_name', 'user__last_name')
        ]
        
        guarantees_by_group = [
            {
                'group_id': row['group_id'] if row['group_id'] is not None else -1,
                'group_name': row['group__name'] or 'Ungrouped',
                'total_guarantees': row['total_guarantees'],
                'attended': row['attended_guarantees'],
                'attendance_percentage': round((row['attended_guarantees'] / row['total_guarantees'] * 100), 2) if row['total_guarantees'] > 0 else 0
            }
            for row in guarantees_qs.values(
                'group_id',
                'group__name'
            ).annotate(
                total_guarantees=Count('id'),
                attended_guarantees=Count('id', filter=Q(elector__attendance_records__status='ATTENDED'))
            ).order_by('group__name')
        ]
        
        user_group_rows = guarantees_qs.values(
            'user_id',
            'user__first_name',
            'user__last_name',
            'group_id',
            'group__name'
        ).annotate(
            total_guarantees=Count('id'),
            attended_guarantees=Count('id', filter=Q(elector__attendance_records__status='ATTENDED'))
        ).order_by('user__first_name', 'user__last_name', 'group__name')
        
        for row in user_group_rows:
            user_id = row['user_id']
            group_id = row['group_id'] if row['group_id'] is not None else -1
            group_name = row['group__name'] or 'Ungrouped'
            user_display_name = f"{row['user__first_name']} {row['user__last_name']}".strip() or 'Unassigned User'
            if user_id not in guarantees_by_user_groups_map:
                guarantees_by_user_groups_map[user_id] = {
                    'user_id': user_id,
                    'user_name': user_display_name,
                    'groups': []
                }
            guarantees_by_user_groups_map[user_id]['groups'].append({
                'group_id': group_id,
                'group_name': group_name,
                'total_guarantees': row['total_guarantees'],
                'attended': row['attended_guarantees'],
                'attendance_percentage': round((row['attended_guarantees'] / row['total_guarantees'] * 100), 2) if row['total_guarantees'] > 0 else 0
            })
    
    guarantees_by_user_groups = list(guarantees_by_user_groups_map.values())
    
    # Sort by elector attendance percentage (guarantees are a subset of electors)
    committee_data.sort(key=lambda x: x['elector_attendance_percentage'], reverse=True)
    
    return {
        'summary': {
            'total_electors': total_electors,
            'total_attendance': total_attendance,
            'total_votes': total_votes,
            'attendance_percentage': attendance_percentage,
            'voting_percentage': voting_percentage,
            'participation_rate': participation_rate,
        },
        'committees': committee_data,
        'guarantees_by_user': guarantees_by_user,
        'guarantees_by_group': guarantees_by_group,
        'guarantees_by_user_groups': guarantees_by_user_groups,
        'top_performers': committee_data[:5] if len(committee_data) > 0 else [],
        'low_performers': [c for c in committee_data if c['elector_attendance_percentage'] < 50][:5],
    }


def get_dashboard_overview(election_id):
    """
    Return a consolidated dashboard snapshot (attendance + demographics).

    Args:
        election_id: Election identifier

    Returns:
        tuple[dict, dict] | None: (overview_payload, aggregate_totals) or None if election missing
    """
    attendance_data = get_attendance_dashboard(election_id)
    if attendance_data is None:
        return None

    demographics_data = get_elector_demographics(election_id)

    overview = {
        'summary': attendance_data['summary'],
        'committees': attendance_data['committees'],
        'guarantee_breakdown': {
            'by_user': attendance_data['guarantees_by_user'],
            'by_group': attendance_data['guarantees_by_group'],
            'by_user_groups': attendance_data['guarantees_by_user_groups'],
        },
        'top_performers': attendance_data['top_performers'],
        'low_performers': attendance_data['low_performers'],
        'demographics': demographics_data,
    }

    summary = attendance_data['summary']
    totals = {
        'areas': len(demographics_data['by_area']),
        'teams': len(demographics_data['by_team']),
        'departments': len(demographics_data.get('by_department', [])),
        'families': len(demographics_data['by_family']),
        'committees': len(attendance_data['committees']),
        'electors': summary.get('total_electors', 0),
        'attendance': summary.get('total_attendance', 0),
        'votes': summary.get('total_votes', 0),
    }

    return overview, totals