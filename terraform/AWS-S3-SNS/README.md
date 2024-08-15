# Terraform (OPTIONAL FILE UPLOAD SUPPORT)

## Login into AWS

```
aws configure
```

## Configure main.tf

Give a unique name to the S3 bucket

run

```
terraform init
terraform plan
terraform apply
```

## Access AWS console

Subscribe Django to the SNS topic

```
https://{YOUR_DOMAIN}/api/v1/s3/notification/
```

after that configure S3 bucket to send object creation notification to the SNS topic

## Common debug actions

make sure the AWS user has correct account permissions
