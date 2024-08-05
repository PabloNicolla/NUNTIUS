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

resource "azurerm_virtual_network" "vnet" {
  name                = "myVNet"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "frontend" {
  name                 = "frontend"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "backend" {
  name                 = "backend"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]

  delegation {
    name = "acidelegation"

    service_delegation {
      name    = "Microsoft.ContainerInstance/containerGroups"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action", "Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action"]
    }
  }
}

resource "azurerm_public_ip" "pip" {
  name                = "myPublicIP"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_application_gateway" "appgw" {
  name                = "myAppGateway"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "my-gateway-ip-configuration"
    subnet_id = azurerm_subnet.frontend.id
  }

  frontend_port {
    name = "https-port"
    port = 443
  }

  frontend_ip_configuration {
    name                 = "public-frontend-ip"
    public_ip_address_id = azurerm_public_ip.pip.id
  }

  backend_address_pool {
    name = "backend-pool"
  }

  backend_http_settings {
    name                  = "http-setting"
    cookie_based_affinity = "Disabled"
    port                  = 8000
    protocol              = "Http"
    request_timeout       = 60
  }

  ssl_certificate {
    name     = "novablog-me-cert"
    data     = filebase64("./secure/novablog_me.pfx")
    password = var.ssl_cert_password
  }

  http_listener {
    name                           = "https-listener"
    frontend_ip_configuration_name = "public-frontend-ip"
    frontend_port_name             = "https-port"
    protocol                       = "Https"
    ssl_certificate_name           = "novablog-me-cert"
    host_name                      = "novablog.me"
  }

  http_listener {
    name                           = "https-listener-www"
    frontend_ip_configuration_name = "public-frontend-ip"
    frontend_port_name             = "https-port"
    protocol                       = "Https"
    ssl_certificate_name           = "novablog-me-cert"
    host_name                      = "www.novablog.me"
  }

  request_routing_rule {
    name                       = "rule1"
    rule_type                  = "Basic"
    http_listener_name         = "https-listener"
    backend_address_pool_name  = "backend-pool"
    backend_http_settings_name = "http-setting"
  }

  request_routing_rule {
    name                       = "rule2"
    rule_type                  = "Basic"
    http_listener_name         = "https-listener-www"
    backend_address_pool_name  = "backend-pool"
    backend_http_settings_name = "http-setting"
  }

  probe {
    name                                      = "http-probe"
    protocol                                  = "Http"
    path                                      = "/"
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    pick_host_name_from_backend_http_settings = true
    match {
      body        = ""
      status_code = ["200-399"]
    }
  }
}

resource "azurerm_network_profile" "example" {
  name                = "examplenetworkprofile"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  container_network_interface {
    name = "examplecnic"

    ip_configuration {
      name      = "exampleipconfig"
      subnet_id = azurerm_subnet.backend.id
    }
  }
}

resource "azurerm_container_group" "aci" {
  name                = "mydjangoapplication"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Private"
  os_type             = "Linux"

  network_profile_id = azurerm_network_profile.example.id

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

  provisioner "local-exec" {
    command = <<EOT
    az network application-gateway address-pool update --resource-group ${azurerm_resource_group.rg.name} --gateway-name ${azurerm_application_gateway.appgw.name} --name ${azurerm_application_gateway.appgw.backend_address_pool[0].name} --add backendAddresses ipAddress=${self.ip_address}
  EOT
  }

  depends_on = [azurerm_application_gateway.appgw]
}

output "container_ip_address" {
  value = azurerm_container_group.aci.ip_address
}
