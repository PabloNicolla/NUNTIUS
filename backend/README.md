# Backend

## RUN

> [!IMPORTANT]
> Although not necessary, it is recommended to have a python virtual environment

### STEP 1 (Python dependencies)

> [!WARNING]
> If you are running on Windows, you need to modify the requirements.txt file!

#### LINUX

```
pip install -r requirements.txt
```

#### WINDOWS

Open [requirements.txt](requirements.txt) and uncomment the following line

```
# twisted-iocpsupport==1.0.4 for Windows only
```

after saving the file run:

```
pip install -r requirements.txt
```

### STEP 2 (Prepare Database)

> [!NOTE]
> This is step is only necessary if you want only the postgres and redis database running on containers.

This step assumes that you have followed the [root readme.md](../README.md) file, has all the correct environment variables correctly configured, and the database is online

```sh
# Change your models (in models.py).
python manage.py makemigrations # to create migrations for those changes
python manage.py migrate        # to apply those changes to the database.
```

### STEP 3 RUN

#### Production

```
daphne -p 8000 core.asgi:application
```
or
```
daphne -b 0.0.0.0 -p 8000 core.asgi:application
```

#### Development

```
python manage.py runserver
```

```sh
# custom port
python manage.py runserver 000.000.000.000:port # replace 000.000.000.000
```

## Other common commands

```sh
django-admin startproject <>    # start project

django-admin  startapp <>       # create default app
python manage.py startapp <>    # create app following project settings

pip install psycopg[binary]     # postgres db driver

python manage.py makemigrations <appname>
python manage.py sqlmigrate <appname> <0001>
python manage.py migrate

python manage.py shell          # access django app via shell

python manage.py createsuperuser # access domain/admin/

python manage.py test chat      # run tests
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

## Test Coverage

```sh
coverage run --source='.' manage.py test chat
coverage report
```
