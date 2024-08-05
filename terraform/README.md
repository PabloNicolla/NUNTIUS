# Terraform

## Login at Azure

```
az login
az account show
```

## Configure terraform variables

rename file [terraform.tfvars.example](terraform.tfvars.example) to `terraform.tfvars`

add your variables and follow the next step

## Run terraform (First time)

> [!IMPORTANT]
> If you have more experience open main.tf file and manually set you image registry.

> [!IMPORTANT]
> The first time you run the `terraform apply` it will fail. Just follow the instructions.

> [!IMPORTANT]
> Make sure you are logged into Azure by running `az login`

```
terraform init
terraform plan
terraform apply
```

## Upload the docker image to your azure registry

> [!IMPORTANT]
> You need to run the following commands inside [backend](../backend) folder, which is where Dockerfile is located.

```sh
# azure login
az acr login --name mydjangoappacr
# build
docker build -t mydjangoappacr.azurecr.io/djangoapp:latest .
# upload
docker push mydjangoappacr.azurecr.io/djangoapp:latest
# check if image was uploaded
az acr repository show-tags --name mydjangoappacr --repository djangoapp
```

## Run terraform (Second time)

Re-run terraform

```
terraform apply
```

### Check container logs

```
az container logs --resource-group myDjangoApp-rg --name mydjangoapplication
```

### APPLICATION GATEWAY IP

```
az network public-ip show --resource-group myDjangoApp-rg --name myPublicIP --query ipAddress --output tsv
```

## SHUTDOWN deployment

```
terraform destroy
```