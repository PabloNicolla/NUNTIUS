# NUNTIUS documentation

## Frontend

Open [Frontend](frontend/README.md) instructions for building the Expo app

## Backend 

[docker-compose.yaml](docker-compose.yaml) file already contains all the default variables for development set up.

you can modify as needed, for example if you already have container or services running on the ports that are going to be used.

```
docker compose up --build
```

### (OPTIONAL)

> [!IMPORTANT]
> (OPTIONAL): If you want to use Google Authentication, you will need to access django admin and create a 

first shut down docker compose

```
docker compose down
```

Modify [docker-compose.yaml](docker-compose.yaml) adding a new port forwarding between web (django) container and your host machine

For example:

```yaml
    ports:
      - "8000:8000"
      - "8899:8899" # try one that is available both on the container and on host: <host>:<container>
```

run docker compose again

```
docker compose up --build
```

```sh
# access django container
docker-compose exec web bash # web is the django container name

# create superuser
python manage.py createsuperuser

# run django with runserver using the correct port
python manage.py runserver 0.0.0.0:8899
```

On host machine access `http://localhost:8899/admin` and add Social applications

after that you can close the runserver, compose down docker, and rebuild again without the additional port forwarding

> [!NOTE]
> For more experienced users, the above may be achieved using `manage.py shell` and creating the object

### Alternative Backend

- run only postgres and redis containers.
- open [Backend](backend/README.md) and follow steps

## IAAS

Deploy on Azure with Terraform script

Follow instructions at [Terraform](terraform/README.md)
