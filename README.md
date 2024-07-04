# Initial documentation

## Frontend

```
npx expo run:android
```

## Backend

```sh
python manage.py runserver
django-admin startapp <chat>


pip install psycopg[binary]


# Change your models (in models.py).
python manage.py makemigrations # to create migrations for those changes
python manage.py migrate        # to apply those changes to the database.


# models # "<chat>.apps.<Chat>Config"
python manage.py makemigrations <chat>
python manage.py sqlmigrate <chat> <0001>
python manage.py migrate


python manage.py shell


python manage.py createsuperuser # access domain/admin/


python manage.py test chat
```

## Shell

```python
from <>.models import <>, <>

q = Question(question_text="What's new?", pub_date=timezone.now())
q.save() # save to DB

q = Question.objects.all()
q = Question.objects.filter(<>=target_id)
rq = Question.objects.get(<>=current_year)

# pk=<> # alias for Primary Key UUI

# question is a FK in choice schema/model
q.choice_set.create(<>=..., <>=...)
q.choice_set.all()
q.choice_set.count()

# choice.questions.pub_data.year 
Choice.objects.filter(question__pub_date__year=current_year)

q.delete()
```

## Mock view

```python shell
from django.test.utils import setup_test_environment
setup_test_environment()

from django.test import Client
client = Client()

response = client.get("/")
response.status_code

from django.urls import reverse
response = client.get(reverse("chat:index"))
response.status_code
response.content
response.context["latest_question_list"]
```

## Coverage

```sh
coverage run --source='.' manage.py test chat
coverage report
```
