from django.db import models
from django.utils import timezone


def default_progress():
  return {
    'parties': {},
    'committees': {},
    'users': {},
    'guarantees': {},
    'attendance': {},
  }


class DemoSeedJob(models.Model):
  class Status(models.TextChoices):
    QUEUED = 'queued', 'Queued'
    RUNNING = 'running', 'Running'
    COMPLETED = 'completed', 'Completed'
    FAILED = 'failed', 'Failed'

  election = models.ForeignKey('elections.Election', on_delete=models.CASCADE, related_name='demo_seed_jobs')
  status = models.CharField(max_length=20, choices=Status.choices, default=Status.QUEUED)
  current_phase = models.CharField(max_length=32, blank=True)
  config = models.JSONField(default=dict)
  progress = models.JSONField(default=default_progress, blank=True)
  errors = models.JSONField(default=list, blank=True)
  started_at = models.DateTimeField(null=True, blank=True)
  finished_at = models.DateTimeField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    ordering = ('-created_at',)

  def mark_running(self, phase: str = ''):
    self.status = self.Status.RUNNING
    self.current_phase = phase
    if not self.started_at:
      self.started_at = timezone.now()
    self.save(update_fields=['status', 'current_phase', 'started_at', 'updated_at'])

  def mark_complete(self):
    self.status = self.Status.COMPLETED
    self.finished_at = timezone.now()
    self.save(update_fields=['status', 'finished_at', 'updated_at'])

  def mark_failed(self, error_payload: dict):
    errors = self.errors or []
    errors.append(error_payload)
    self.errors = errors
    self.status = self.Status.FAILED
    self.finished_at = timezone.now()
    self.save(update_fields=['errors', 'status', 'finished_at', 'updated_at'])

