from django.contrib import admin

# Register your models here.

from .models import Choice, Question


# class QuestionAdmin(admin.ModelAdmin):            # Define order
#     fields = ["pub_date", "question_text"]

# admin.site.register(Question, QuestionAdmin)


# class QuestionAdmin(admin.ModelAdmin):            # Style fieldsets
#     fieldsets = [
#         (None, {"fields": ["question_text"]}),
#         ("Date information", {"fields": ["pub_date"]}),
#     ]

# admin.site.register(Question, QuestionAdmin)


# class ChoiceInline(admin.StackedInline):            # Allow to create with FK items [list format]
#     model = Choice
#     extra = 3


# Allow to create with FK items [Table format]
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3


class QuestionAdmin(admin.ModelAdmin):
    # Add View
    fieldsets = [
        (None, {"fields": ["question_text"]}),
        ("Date information", {"fields": [
         "pub_date"], "classes": ["collapse"]}),
    ]
    inlines = [ChoiceInline]

    # List View
    list_display = ["question_text", "pub_date", "was_published_recently"]
    # # Extended Filter options
    list_filter = ["pub_date"]


admin.site.register(Question, QuestionAdmin)

admin.site.register(Choice)
