#!/usr/bin/env python
"""
Script to verify Factory Boy compatibility.

Run this script to check if Factory Boy can be imported successfully.
If it runs without errors, you can proceed with the migration.
"""
import sys

def check_factory_boy():
    """Check if Factory Boy can be imported."""
    try:
        print("Checking Factory Boy compatibility...")
        from factory.django import DjangoModelFactory
        from factory import Sequence, Faker, SubFactory, PostGenerationMethodCall
        print("[OK] Factory Boy imports successfully!")
        print("[OK] You can proceed with migration to Factory Boy.")
        print("\nNext steps:")
        print("1. Follow the guide in MIGRATE_TO_FACTORY_BOY.md")
        print("2. Update tests/conftest.py to use factories from tests/factories.py")
        print("3. Run the test suite to verify everything works")
        return True
    except AssertionError as e:
        print("[ERROR] Factory Boy import failed due to SQLAlchemy compatibility issue")
        print(f"   Error: {e}")
        print("\nThis is a known issue with Factory Boy 3.3.3 and Python 3.13.")
        print("Please wait for a Factory Boy update or use Python 3.12 or earlier.")
        return False
    except ImportError as e:
        print(f"[ERROR] Factory Boy import failed: {e}")
        print("Please install Factory Boy: pip install factory-boy")
        return False
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        return False

if __name__ == '__main__':
    success = check_factory_boy()
    sys.exit(0 if success else 1)

