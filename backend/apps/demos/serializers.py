from copy import deepcopy

from rest_framework import serializers

from apps.elections.models import Election
from .models import DemoSeedJob

DEFAULT_PHASE_CONFIG = {
  'parties': {
    'enabled': True,
    'count': 4,
    'candidates_per_party': 3,
    'independent_candidates': 2,
  },
  'committees': {
    'enabled': True,
    'count': 8,
  },
  'users': {
    'enabled': True,
    'count': 15,
    'assign_to_committees': True,
  },
  'guarantees': {
    'enabled': True,
    'batch_size': 100,
    'interval_ms': 1000,
    'total_limit': None,
    'group_distribution': 'random',
    'guarantee_status': 'GUARANTEED',
  },
  'attendance': {
    'enabled': True,
    'rate': 0.75,
    'batch_size': 50,
    'interval_ms': 2000,
  },
}


class DemoSeedRequestSerializer(serializers.Serializer):
  election_id = serializers.IntegerField()
  phases = serializers.DictField(child=serializers.DictField(), required=False)

  def validate_election_id(self, value):
    try:
      election = Election.objects.get(pk=value)
    except Election.DoesNotExist as exc:
      raise serializers.ValidationError('Election not found') from exc
    self.context['election'] = election
    return value

  def validate(self, attrs):
    phases_payload = attrs.get('phases') or {}
    merged = deepcopy(DEFAULT_PHASE_CONFIG)

    for phase_name, defaults in merged.items():
      overrides = phases_payload.get(phase_name, {})
      if not isinstance(overrides, dict):
        continue
      if 'enabled' in overrides:
        defaults['enabled'] = bool(overrides['enabled'])
      for key, value in overrides.items():
        if key == 'enabled':
          continue
        defaults[key] = value

    attrs['config'] = merged
    attrs['election'] = self.context.get('election')
    return attrs


class DemoSeedJobSerializer(serializers.ModelSerializer):
  election_name = serializers.CharField(source='election.name', read_only=True)

  class Meta:
    model = DemoSeedJob
    fields = (
      'id',
      'election',
      'election_name',
      'status',
      'current_phase',
      'config',
      'progress',
      'errors',
      'started_at',
      'finished_at',
      'created_at',
      'updated_at',
    )

