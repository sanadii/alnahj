# Factory Boy Setup

Factory Boy factories have been created in `tests/factories.py` but are currently not in use due to a compatibility issue between Factory Boy 3.3.3 and Python 3.13 (SQLAlchemy import error).

## Current Status

- ✅ Factory Boy factories defined in `tests/factories.py`
- ✅ Manual factories in `tests/conftest.py` (working)
- ⚠️ Factory Boy not active due to Python 3.13 compatibility issue

## Migration Guide

**See `MIGRATE_TO_FACTORY_BOY.md` for complete step-by-step migration instructions.**

## Quick Migration Checklist

When Factory Boy compatibility is fixed:

1. ✅ Verify Factory Boy imports successfully
2. ✅ Backup `tests/conftest.py`
3. ✅ Update `tests/conftest.py` to import from `factories.py`
4. ✅ Fix `tests/factories.py` imports (remove lazy import)
5. ✅ Run test suite to verify
6. ✅ Clean up documentation files

## Benefits of Factory Boy

- Cleaner, more maintainable test data
- Better defaults with Faker integration
- Easier to create complex object graphs
- Less boilerplate code

## Workaround

Until the compatibility issue is resolved, the manual factories in `conftest.py` provide the same functionality and maintain backward compatibility with all existing tests.

