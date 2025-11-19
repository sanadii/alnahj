"""
App configuration for candidates.
"""
from django.apps import AppConfig


class CandidatesConfig(AppConfig):
    """Configuration for the candidates app."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.candidates'
    verbose_name = 'Candidates & Parties'

