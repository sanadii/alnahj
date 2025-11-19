"""
Pytest configuration for backend test suite.

Certain legacy template tests and multi-tenancy stubs reference apps that
do not exist in this project. We tell pytest to ignore them so that the
real suites can run without import-time failures.
"""

collect_ignore = [
    "test_multi_tenancy_deals.py",
    "templates/test_integration_template.py",
    "templates/test_viewset_template.py",
]

