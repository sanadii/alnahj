"""
Legacy placeholder to keep pytest satisfied when the old multi-tenancy deal
tests are still referenced. The real implementation lived in legacy CRM apps
that are not part of this repository.
"""

import pytest

pytest.skip(
    "Multi-tenancy deal tests depend on legacy CRM apps that are not installed",
    allow_module_level=True,
)

