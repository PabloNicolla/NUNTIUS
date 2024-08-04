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

resource "azurerm_key_vault" "kv" {
  name                       = "mydjangoappsecrets"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
}

resource "azurerm_key_vault_access_policy" "kv_access_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = "" # Replace with the fetched object_id

  secret_permissions = [
    "Get", "List", "Set", "Delete"
  ]
}

resource "azurerm_key_vault_secret" "secret_key" {
  name         = "DJANGO-SECRET-KEY"
  value        = var.django_secret_key
  key_vault_id = azurerm_key_vault.kv.id
}

resource "azurerm_key_vault_secret" "postgres_password" {
  name         = "POSTGRES-PASSWORD"
  value        = var.postgres_password
  key_vault_id = azurerm_key_vault.kv.id
}

resource "azurerm_key_vault_secret" "redis_password" {
  name         = "REDIS-PASSWORD"
  value        = var.redis_password
  key_vault_id = azurerm_key_vault.kv.id
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
      "SECRET_KEY"        = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secret_key.versionless_id})"
      "POSTGRES_PASSWORD" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.postgres_password.versionless_id})"
      "REDIS_PASSWORD"    = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.redis_password.versionless_id})"
    }

  }

  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }
}

data "azurerm_client_config" "current" {}
