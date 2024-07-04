# Change Log

<a href="/polls/{{ question.id }}/">{{ question.question_text }}</a>

as defined in path("<int:question_id>/", views.detail, name="detail")

<a href="\{% url 'detail' question.id %\}">\{\{ question.question_text \}\}</a> WITHOUT NAMESPACE