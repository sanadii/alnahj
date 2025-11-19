from django.contrib import admin

from .models import DemoSeedJob


@admin.register(DemoSeedJob)
class DemoSeedJobAdmin(admin.ModelAdmin):
  list_display = ('id', 'election', 'status', 'current_phase', 'created_at', 'updated_at')
  list_filter = ('status', 'current_phase', 'created_at')
  search_fields = ('election__name', 'current_phase')
  readonly_fields = ('config', 'progress', 'errors', 'created_at', 'updated_at', 'started_at', 'finished_at')

