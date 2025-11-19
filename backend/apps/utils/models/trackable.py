# helper/base_serializer.py
from rest_framework.serializers import BaseSerializer, ModelSerializer
from collections.abc import Iterable
from apps.account.models import User
import json


class DynamicFieldMixin:
    """
    Base mixin for dynamically handling fields in serializers.
    """

    FIELDS = []  # Override this in subclasses
    REPRESENTATION_KEY = None  # Each subclass must define a unique key

    def get_dynamic_fields(self, instance):
        """
        Extracts dynamic fields from the instance.
        """
        dynamic_data = {}
        for field in self.FIELDS:
            value = getattr(instance, field, None)
            if self.is_user_field(field) and value:
                dynamic_data[field] = self.get_user_name(value)
            else:
                dynamic_data[field] = value
        return dynamic_data

    def is_user_field(self, field):
        """
        Determines if a field is a user-related field (e.g., created_by, updated_by).
        """
        return "by" in field

    def get_user_name(self, user):
        """
        Retrieve the username from the user object. Returns None if the user is None.
        """
        return user.username if user and hasattr(user, "username") else None

    def to_representation(self, instance):
        """
        Add dynamic fields to the serialized representation.
        """
        # Call the parent serializer's `to_representation`
        data = super().to_representation(instance) if hasattr(
            super(), "to_representation") else {}

        # Collect dynamic fields from all mixins
        for cls in self.__class__.mro():
            if issubclass(cls, DynamicFieldMixin) and cls is not DynamicFieldMixin:
                if cls.REPRESENTATION_KEY:
                    data[cls.REPRESENTATION_KEY] = cls.get_dynamic_fields(
                        self, instance)

        return data

    def to_internal_value(self, data):
        """
        Add dynamic fields to the deserialization process.
        """
        # Call the parent serializer's `to_internal_value`
        validated_data = super().to_internal_value(
            data) if hasattr(super(), "to_internal_value") else {}

        # Collect and process dynamic fields from all mixins
        for cls in self.__class__.mro():
            if issubclass(cls, DynamicFieldMixin) and cls is not DynamicFieldMixin:
                validated_data.update(cls.process_dynamic_fields(self, data))

        return validated_data

    def update(self, instance, validated_data):
        """
        Handle dynamic fields during updates.
        """
        # Update dynamic fields for all mixins
        for cls in self.__class__.mro():
            if issubclass(cls, DynamicFieldMixin) and cls is not DynamicFieldMixin:
                dynamic_fields = cls.process_dynamic_fields(
                    self, validated_data)
                for field, value in dynamic_fields.items():
                    setattr(instance, field, value)

        # Call the parent serializer's `update` method
        return super().update(instance, validated_data)

    def create(self, validated_data):
        """
        Handle dynamic fields during creation.
        """
        # Extract and process dynamic fields for all mixins
        dynamic_fields_combined = {}
        for cls in self.__class__.mro():
            if issubclass(cls, DynamicFieldMixin) and cls is not DynamicFieldMixin:
                dynamic_fields_combined.update(
                    cls.process_dynamic_fields(self, validated_data))

        # Create the main instance
        instance = super().create(validated_data)

        # Assign dynamic fields to the instance
        for field, value in dynamic_fields_combined.items():
            setattr(instance, field, value)
        instance.save()

        return instance


class Trackable(DynamicFieldMixin):
    FIELDS = [
        "created_by",
        "updated_by",
        "deleted_by",
        "created_at",
        "updated_at",
        "deleted_at",
        "is_deleted",
    ]
    REPRESENTATION_KEY = "track"


class Taskable(DynamicFieldMixin):
    FIELDS = ["priority", "status"]
    REPRESENTATION_KEY = "task"


class ModeratorMixin:

    def to_representation(self, obj):
        # Implement the logic to return the serialized data for task
        moderators = self.get_moderators(obj)
        return {
            "moderators": moderators,
        }

    def get_moderators(self, obj):
        if obj.moderators is not None:
            # Check if moderators is already a list
            if isinstance(obj.moderators, list):
                moderator_ids = obj.moderators
            else:  # Attempt to load JSON string
                try:
                    moderator_ids = json.loads(obj.moderators)
                except (json.JSONDecodeError, TypeError):
                    moderator_ids = []

            moderators = User.objects.filter(id__in=moderator_ids)
            return [
                {
                    "id": getattr(mod, "id", None),
                    "img": getattr(mod.image, "url", None),
                    "name": f"{getattr(mod, 'first_name', '')} {getattr(mod, 'last_name', '')}",
                }
                for mod in moderators
            ]
        else:
            return []

    """
    Mixin to conditionally append admin-specific fields to serialized output
    based on the user’s administrative status.
    """
