# Reports & Analytics App

**Comprehensive reporting, analytics, and dashboard system for the election.**

## Overview

The Reports app provides:
- **3-Level Dashboards** - Personal, Supervisor, and Admin
- **Coverage Reports** - Track guarantee collection progress
- **Accuracy Analysis** - Compare guarantees vs. actual attendance
- **Committee Performance** - Analyze committee-level metrics
- **Export Functionality** - CSV, Excel, PDF exports
- **Chart Data** - Visualization-ready data endpoints
- **Trending Analytics** - Historical snapshots and trends

---

## Models

### 1. ReportTemplate

Store reusable report configurations.

**Fields:**
- `name` - Template name
- `report_type` - Type (GUARANTEE_COVERAGE, ACCURACY, etc.)
- `description` - Description
- `parameters` - JSON configuration
- `is_active` - Active status

### 2. GeneratedReport

Store generated reports for caching.

**Fields:**
- `template` - Associated template (optional)
- `title` - Report title
- `report_type` - Type of report
- `format` - JSON, CSV, EXCEL, PDF
- `status` - PENDING, GENERATING, COMPLETED, FAILED
- `data` - Report data (JSON)
- `file` - Generated file (for exports)
- `generated_by` - User who generated
- `generated_at` - Generation timestamp
- `expires_at` - Cache expiration

### 3. DashboardWidget

User-customizable dashboard widgets (future feature).

**Fields:**
- `user` - Widget owner
- `title` - Widget title
- `widget_type` - STAT_CARD, PIE_CHART, BAR_CHART, etc.
- `data_source` - API endpoint for data
- `configuration` - Widget config (JSON)
- `position_x`, `position_y` - Grid position
- `width`, `height` - Widget size
- `is_visible` - Visibility toggle
- `order` - Display order

### 4. AnalyticsSnapshot

Periodic snapshots of key metrics for trending.

**Fields:**
- `snapshot_type` - DAILY, WEEKLY, MONTHLY, ON_DEMAND
- `snapshot_date` - Date of snapshot
- `metrics` - All metrics as JSON
- `notes` - Optional notes

**Metrics Captured:**
- Total users
- Active users
- Total electors
- Total guarantees (by status)
- Total attendance
- Coverage percentage
- Attendance rate

---

## API Endpoints

### Dashboards

```http
# Personal Dashboard (All Users)
GET /api/reports/dashboard/personal/

Response: {
    my_guarantees: {
        total: 150,
        strong: 80,
        medium: 50,
        weak: 20,
        strong_percentage: 53.3
    },
    my_groups: [...],
    follow_ups: {
        pending: 10,
        overdue: 2,
        total: 12
    },
    recent_guarantees: [...],
    quick_stats: {
        coverage_rate: 15.3,
        confidence_score: 7.8
    }
}

# Supervisor Dashboard (Supervisors & Admins)
GET /api/reports/dashboard/supervisor/

Response: {
    team_overview: {
        total_members: 5,
        active_today: 3,
        total_guarantees: 500
    },
    team_guarantees: {
        total: 500,
        strong: 300,
        medium: 150,
        weak: 50
    },
    team_members: [
        {id: 1, name: "John Doe", total: 150, strong: 80, ...}
    ],
    team_progress: {
        average_per_member: 100,
        top_performer: {...}
    },
    recent_activity: [...]
}

# Admin Dashboard (Admins Only)
GET /api/reports/dashboard/admin/

Response: {
    overview: {
        total_users: 50,
        total_electors: 979,
        total_guarantees: 700,
        total_attendance: 800,
        coverage_percentage: 71.5,
        attendance_percentage: 81.7
    },
    guarantees: {
        total: 700,
        strong: 400,
        medium: 200,
        weak: 100,
        strong_percentage: 57.1,
        electors_covered: 700
    },
    attendance: {
        total: 800,
        percentage: 81.7,
        recent_24h: 50
    },
    users: {
        total: 50,
        admins: 5,
        supervisors: 10,
        regular: 35
    },
    committees: [
        {code: "EK-II", name: "...", total_electors: 200, ...}
    ],
    recent_activity: [...],
    trends: {
        guarantees_24h: 25,
        guarantee_trend: +5,
        attendance_24h: 50
    }
}
```

### Reports

```http
# Coverage Report (Admin Only)
GET /api/reports/coverage/

Response: {
    summary: {
        total_electors: 979,
        covered: 700,
        uncovered: 279,
        coverage_percentage: 71.5,
        generated_at: "2025-10-24T..."
    },
    by_committee: [
        {
            committee_code: "EK-II",
            committee_name: "Committee EK-II",
            total_electors: 500,
            covered: 400,
            uncovered: 100,
            coverage_percentage: 80.0
        }
    ],
    by_section: [...],
    by_user: [...],
    coverage_gaps: [
        {koc_id: "12345", name: "...", section: "...", committee: "..."}
    ],
    recommendations: [
        {priority: "HIGH", message: "Focus on Committee FC#28"}
    ]
}

# Accuracy Report (Admin Only)
# Compares guarantees vs. actual attendance
GET /api/reports/accuracy/

Response: {
    summary: {
        total_guarantees: 700,
        attended: 600,
        absent: 100,
        overall_accuracy: 85.7,
        generated_at: "2025-10-24T..."
    },
    by_status: {
        strong: {total: 400, attended: 380, accuracy: 95.0},
        medium: {total: 200, attended: 160, accuracy: 80.0},
        weak: {total: 100, attended: 60, accuracy: 60.0}
    },
    by_user: [
        {user_name: "John Doe", total_guarantees: 150, attended: 130, accuracy: 86.7}
    ],
    accuracy_metrics: {
        confidence_correlation: 88.0,
        reliability_score: 85.7
    },
    predictions_vs_actual: [...]
}

# Committee Performance Report (Admin Only)
GET /api/reports/committee-performance/

Response: {
    committee_stats: [
        {
            code: "EK-II",
            name: "Committee EK-II",
            gender: "MALE",
            total_electors: 500,
            total_attendance: 450,
            attendance_rate: 90.0,
            total_guarantees: 400,
            strong: 250,
            medium: 100,
            weak: 50,
            coverage: 80.0
        }
    ],
    attendance_rates: {
        overall: 85.0,
        highest: {...},
        lowest: {...}
    },
    guarantee_distribution: [...],
    performance_comparison: {
        top_performing: [...],
        needs_attention: [...]
    }
}
```

### Export

```http
# Export Report (Admin Only)
POST /api/reports/export/
Content-Type: application/json

Body: {
    report_type: "GUARANTEE_COVERAGE",  // or ACCURACY, COMMITTEE_PERFORMANCE
    format: "CSV",  // or EXCEL, PDF
    parameters: {},  // optional
    include_charts: true  // for PDF
}

Response: {
    report_id: 123,
    title: "Guarantee Coverage Report",
    format: "CSV",
    status: "COMPLETED",
    download_url: "/api/reports/download/123/",
    message: "Report generated successfully in CSV format"
}
```

### Analytics

```http
# Get Trends (All Users)
GET /api/reports/analytics/trends/?days=30

Response: {
    dates: ["2025-10-01", "2025-10-02", ...],
    guarantees: [100, 120, 150, ...],
    attendance: [0, 0, 500, ...],
    coverage: [10.2, 12.3, 15.3, ...]
}

# Create Snapshot (Admin Only)
POST /api/reports/analytics/create-snapshot/

Response: {
    id: 45,
    snapshot_type: "ON_DEMAND",
    snapshot_date: "2025-10-24",
    metrics: {...},
    created_at: "2025-10-24T..."
}
```

### Charts

```http
# Guarantee Distribution Pie Chart
GET /api/reports/charts/guarantee-distribution/

Response: {
    chart_type: "PIE",
    title: "Guarantee Status Distribution",
    labels: ["Strong", "Medium", "Weak"],
    datasets: [{
        data: [400, 200, 100],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"]
    }],
    options: {
        total: 700,
        percentages: [57.1, 28.6, 14.3]
    }
}

# Committee Comparison Bar Chart
GET /api/reports/charts/committee-comparison/

Response: {
    chart_type: "BAR",
    title: "Committee Comparison",
    labels: ["EK-II", "FC#28", ...],
    datasets: [
        {
            label: "Total Electors",
            data: [500, 479, ...],
            backgroundColor: "#2196F3"
        },
        {
            label: "Attendance",
            data: [450, 400, ...],
            backgroundColor: "#4CAF50"
        }
    ],
    options: {}
}
```

---

## Features

### 1. Three-Level Dashboards

#### Personal Dashboard (All Users)
**Purpose**: Show user their own stats

**Metrics:**
- My guarantees summary (total, by status)
- My custom groups
- Follow-up status (pending/overdue)
- Recent guarantees
- Quick stats (coverage rate, confidence score)

**Use Case**: Daily check-in, track personal progress

#### Supervisor Dashboard
**Purpose**: Monitor team performance

**Metrics:**
- Team overview (members, activity)
- Team guarantees (total, by status)
- Individual member stats
- Team progress comparison
- Recent team activity

**Use Case**: Team management, identify top/low performers

#### Admin Dashboard
**Purpose**: Complete system overview

**Metrics:**
- System-wide overview (users, electors, guarantees, attendance)
- Guarantee breakdown (by status, coverage)
- Attendance metrics
- User breakdown (by role)
- Committee stats
- Recent activity (all users)
- 24-hour trends

**Use Case**: Strategic decisions, system health monitoring

---

### 2. Coverage Analysis

**Purpose**: Track guarantee collection progress

**Key Metrics:**
- Overall coverage percentage
- Coverage by committee
- Coverage by section
- Coverage by user
- Coverage gaps (electors without guarantees)
- Recommendations based on gaps

**Use Cases:**
- Identify which committees need more focus
- Find sections with low coverage
- Recognize top performers
- Plan targeted outreach

**Example Insights:**
- "Committee FC#28 only has 45% coverage - needs immediate attention"
- "Section GC-01 has 90% coverage - excellent work!"
- "User John Doe has covered 150 electors - top performer"

---

### 3. Accuracy Analysis

**Purpose**: Validate guarantee quality by comparing with actual attendance

**Key Metrics:**
- Overall accuracy (% of guarantees who attended)
- Accuracy by status (Strong vs. Medium vs. Weak)
- Accuracy by user
- Confidence correlation
- Predictions vs. actual results

**Use Cases:**
- Evaluate guarantee reliability
- Validate status classification (is "Strong" really strong?)
- Identify most accurate users
- Improve future predictions

**Example Insights:**
- "Strong guarantees: 95% attendance - excellent reliability"
- "Medium guarantees: 80% attendance - good reliability"
- "Weak guarantees: 60% attendance - as expected"
- "User Jane Smith: 92% accuracy - highly reliable"

---

### 4. Committee Performance

**Purpose**: Analyze committee-level metrics

**Key Metrics:**
- Committee stats (electors, attendance, guarantees)
- Attendance rates by committee
- Guarantee distribution
- Top performing committees
- Committees needing attention

**Use Cases:**
- Compare committee performance
- Identify best practices from top committees
- Support struggling committees
- Resource allocation

**Example Insights:**
- "Committee EK-II: 90% attendance - best performer"
- "Committee FC#28: 65% attendance - needs support"
- "Male committees averaging 85% attendance"
- "Female committees averaging 80% attendance"

---

### 5. Export Functionality

**Formats:**
- **CSV** - Simple data export, Excel-compatible
- **EXCEL** - Formatted spreadsheets with multiple sheets
- **PDF** - Professional reports with charts (future)

**Features:**
- Generate on-demand
- Cache for 7 days
- Download link provided
- Includes all report data
- Optional chart inclusion (PDF)

**Use Cases:**
- Share with management
- Offline analysis
- Archive for records
- Presentation materials

---

### 6. Chart Data Endpoints

**Purpose**: Provide visualization-ready data

**Chart Types:**
- **PIE** - Guarantee distribution by status
- **BAR** - Committee comparison
- **LINE** - Trends over time (future)
- **AREA** - Cumulative progress (future)
- **DONUT** - Coverage breakdown (future)

**Features:**
- Pre-formatted for Chart.js/Recharts
- Color-coded
- Labels included
- Percentages calculated
- Options/metadata provided

**Use Cases:**
- Frontend data visualization
- Dashboard widgets
- Presentation charts
- Real-time monitoring

---

### 7. Analytics Snapshots

**Purpose**: Historical trending and comparisons

**Types:**
- **DAILY** - Automatic daily snapshots
- **WEEKLY** - Weekly summaries
- **MONTHLY** - Monthly reports
- **ON_DEMAND** - Manual snapshots

**Metrics Captured:**
- Total users (active/inactive)
- Active users today
- Total electors
- Total guarantees (by status)
- Total attendance
- Coverage percentage
- Attendance rate

**Use Cases:**
- Track progress over time
- Identify trends
- Compare periods
- Performance reports

**Example Analysis:**
- "Guarantee collection up 15% this week"
- "Coverage increased from 60% to 72% in 10 days"
- "Attendance rate steady at 85%"

---

## Permissions

### Personal Dashboard
- ✅ All authenticated users can access

### Supervisor Dashboard
- ✅ Supervisors see their team
- ✅ Admins see all users

### Admin Dashboard
- ✅ Admins only
- ❌ Regular users cannot access

### Reports (Coverage, Accuracy, Committee)
- ✅ Admins only
- ❌ Other users cannot access

### Export
- ✅ Admins only

### Analytics
- ✅ Trends: All users
- ✅ Create snapshot: Admins only

### Charts
- ✅ All authenticated users

---

## Usage Examples

### Example 1: Morning Check-in (Regular User)

```javascript
// Get personal dashboard
GET /api/reports/dashboard/personal/

// Review my stats
// - 150 total guarantees
// - 80 strong (53%)
// - 10 follow-ups pending
// - 2 overdue

// Check follow-ups
GET /api/guarantees/follow-ups/?overdue=true

// Take action on overdue items
```

### Example 2: Team Review (Supervisor)

```javascript
// Get team dashboard
GET /api/reports/dashboard/supervisor/

// Analyze team performance
// - 5 team members
// - 500 total guarantees
// - Top performer: John (150 guarantees)
// - Low performer: Sarah (50 guarantees)

// Check recent team activity
// - Last 10 guarantees added
// - Who's active today

// Plan team meeting topics
```

### Example 3: Strategic Planning (Admin)

```javascript
// Get admin dashboard
GET /api/reports/dashboard/admin/

// Review system health
// - 700 guarantees (71.5% coverage)
// - 800 attendance (81.7%)
// - 25 guarantees added in last 24h

// Run coverage report
GET /api/reports/coverage/

// Identify gaps
// - Committee FC#28: 45% coverage (needs attention)
// - Section GC-01: 90% coverage (excellent)

// Export for presentation
POST /api/reports/export/
{
    report_type: "GUARANTEE_COVERAGE",
    format: "PDF",
    include_charts: true
}
```

### Example 4: Post-Election Analysis (Admin)

```javascript
// Run accuracy report
GET /api/reports/accuracy/

// Analyze results
// - Overall accuracy: 85.7%
// - Strong: 95% accuracy (excellent)
// - Medium: 80% accuracy (good)
// - Weak: 60% accuracy (as expected)

// Identify best predictors
// - User John: 92% accuracy
// - User Jane: 88% accuracy

// Run committee performance
GET /api/reports/committee-performance/

// Compare committees
// - EK-II: 90% attendance (best)
// - FC#28: 65% attendance (lowest)

// Export all reports
POST /api/reports/export/
{report_type: "GUARANTEE_ACCURACY", format: "EXCEL"}
```

### Example 5: Trend Analysis (Admin)

```javascript
// Get 30-day trends
GET /api/reports/analytics/trends/?days=30

// Analyze progress
// - Day 1: 100 guarantees
// - Day 15: 400 guarantees
// - Day 30: 700 guarantees
// - Steady growth!

// Create snapshot for records
POST /api/reports/analytics/create-snapshot/

// Track key milestones
```

---

## Integration

### With Guarantees App
- Coverage analysis uses guarantee data
- Accuracy compares guarantees with attendance
- User performance from guarantee activity

### With Attendance App
- Accuracy reports need attendance data
- Committee performance uses attendance metrics
- Predictions vs. actual comparisons

### With Electors App
- Coverage calculates against total electors
- Section-level analysis
- Committee-level breakdowns

### With Users App
- Personal dashboards per user
- Team dashboards for supervisors
- User performance metrics

---

## Best Practices

### 1. Regular Dashboard Reviews
- Users: Check daily for follow-ups
- Supervisors: Review team weekly
- Admins: Monitor system daily

### 2. Coverage Monitoring
- Run coverage report weekly
- Target 75%+ overall coverage
- Focus on low-coverage committees

### 3. Accuracy Analysis
- Run after voting day
- Learn from patterns
- Improve future predictions

### 4. Export for Records
- Export key reports for archives
- Include in final documentation
- Share with stakeholders

### 5. Trend Tracking
- Create weekly snapshots
- Compare month-over-month
- Celebrate progress

---

## Future Enhancements

### Planned Features
- **Automated Snapshots** - Daily/weekly automatic snapshots
- **Email Reports** - Scheduled report emails
- **Custom Widgets** - User-configurable dashboards
- **PDF Generation** - Professional PDF reports with charts
- **Advanced Charts** - More visualization types
- **Predictive Analytics** - ML-based predictions
- **Mobile Dashboards** - Optimized mobile views
- **Real-time Updates** - WebSocket live dashboards

---

## Testing

### Manual Testing Checklist
- [ ] Personal dashboard loads
- [ ] Supervisor dashboard shows team
- [ ] Admin dashboard shows all data
- [ ] Coverage report generates
- [ ] Accuracy report compares correctly
- [ ] Committee performance accurate
- [ ] Export creates file
- [ ] Trends show historical data
- [ ] Snapshot creation works
- [ ] Charts return correct data
- [ ] Permissions enforced

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Status**: Complete ✅

