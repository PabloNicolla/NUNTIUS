terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 2.65"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "myDjangoApp-rg"
  location = "East US"
}

resource "azurerm_container_registry" "acr" {
  name                = "mydjangoappacr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
  admin_enabled       = true
}

resource "azurerm_container_group" "aci" {
  name                = "mydjangoapplication"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  dns_name_label      = "mydjangoapplication"
  os_type             = "Linux"

  container {
    name   = "djangoapp"
    image  = "${azurerm_container_registry.acr.login_server}/djangoapp:latest"
    cpu    = "1"
    memory = "1.5"

    ports {
      port     = 8000
      protocol = "TCP"
    }

    environment_variables = {
      "DEBUG"                      = var.debug
      "POSTGRES_DB"                = var.postgres_db
      "POSTGRES_USER"              = var.postgres_user
      "POSTGRES_HOST"              = var.postgres_host
      "POSTGRES_PORT"              = var.postgres_port
      "REDIS_HOST"                 = var.redis_host
      "REDIS_PORT"                 = var.redis_port
      "ALLOWED_HOSTS"              = var.allowed_hosts
      "CSRF_TRUSTED_ORIGINS"       = var.csrf_trusted_origins
      "CORS_ALLOW_ALL_ORIGINS"     = var.cors_allow_all_origins
      "ACCOUNT_EMAIL_VERIFICATION" = var.account_email_verification
      "EMAIL_BACKEND"              = var.email_backend
    }

    secure_environment_variables = {
      "SECRET_KEY"        = var.django_secret_key
      "POSTGRES_PASSWORD" = var.postgres_password
      "REDIS_PASSWORD"    = var.redis_password
    }

  }

  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }
}

data "azurerm_client_config" "current" {}
