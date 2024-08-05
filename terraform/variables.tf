# variables.tf

variable "django_secret_key" {
  description = "Django SECRET_KEY"
  type        = string
}

variable "debug" {
  description = "Django DEBUG setting"
  type        = string
  default     = "False"
}

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
}

variable "postgres_db" {
  description = "PostgreSQL database name"
  type        = string
}

variable "postgres_user" {
  description = "PostgreSQL username"
  type        = string
}

variable "postgres_host" {
  description = "PostgreSQL host"
  type        = string
}

variable "postgres_port" {
  description = "PostgreSQL port"
  type        = string
  default     = "5432"
}

variable "redis_host" {
  description = "Redis host"
  type        = string
}

variable "redis_port" {
  description = "Redis port"
  type        = string
  default     = "6379"
}

variable "redis_password" {
  description = "Redis password"
  type        = string
}

variable "allowed_hosts" {
  description = "Allowed hosts for Django"
  type        = string
}

variable "csrf_trusted_origins" {
  description = "CSRF trusted origins"
  type        = string
}

variable "cors_allow_all_origins" {
  description = "Allow all origins for CORS"
  type        = string
  default     = "False"
}

variable "account_email_verification" {
  description = "Account email verification method"
  type        = string
  default     = "none"
}

variable "email_backend" {
  description = "Email backend"
  type        = string
  default     = "django.core.mail.backends.console.EmailBackend"
}

variable "ssl_cert_password" {
  description = "Password for the SSL certificate PFX file"
  type        = string
  sensitive   = true
}
