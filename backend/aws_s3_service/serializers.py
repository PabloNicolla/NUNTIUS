from rest_framework import serializers


class UploadFileSerializer(serializers.Serializer):
    file_name = serializers.CharField(
        required=True,
        allow_blank=False,
    )
    file_type = serializers.CharField(
        required=True,
        allow_blank=False,
    )

    def validate(self, data):
        if not data.get('file_name'):
            raise serializers.ValidationError(
                "file_name is required.")
        if not data.get('file_type'):
            raise serializers.ValidationError(
                "file_type is required.")
        return data


class ContactRequestSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    pk = serializers.UUIDField(required=False)

    def validate(self, data):
        if not data.get('username') and not data.get('pk'):
            raise serializers.ValidationError(
                "Either username or pk is required.")
        return data
