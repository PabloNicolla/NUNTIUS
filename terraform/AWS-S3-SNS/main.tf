provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "aurora_ts_s3" {
  bucket = "aurora-ts-s3"

  tags = {
    Name = "aurora-ts-s3"
  }
}

resource "aws_s3_bucket_public_access_block" "aurora_ts_s3_public_access_block" {
  bucket = aws_s3_bucket.aurora_ts_s3.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "aurora_ts_s3_versioning" {
  bucket = aws_s3_bucket.aurora_ts_s3.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "aurora_ts_s3_encryption" {
  bucket = aws_s3_bucket.aurora_ts_s3.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_sns_topic" "aurora_ts_sns" {
  name = "aurora-ts-sns"
}

data "aws_caller_identity" "current" {}

resource "aws_sns_topic_policy" "aurora_ts_sns_policy" {
  arn = aws_sns_topic.aurora_ts_sns.arn

  policy = jsonencode({
    Version = "2008-10-17"
    Id      = "__default_policy_ID"
    Statement = [
      {
        Sid    = "__default_statement_ID"
        Effect = "Allow"
        Principal = {
          AWS = "*"
        }
        Action = [
          "SNS:GetTopicAttributes",
          "SNS:SetTopicAttributes",
          "SNS:AddPermission",
          "SNS:RemovePermission",
          "SNS:DeleteTopic",
          "SNS:Subscribe",
          "SNS:ListSubscriptionsByTopic",
          "SNS:Publish"
        ]
        Resource = aws_sns_topic.aurora_ts_sns.arn
        Condition = {
          StringEquals = {
            "AWS:SourceOwner" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AllowS3Publish"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.aurora_ts_sns.arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = aws_s3_bucket.aurora_ts_s3.arn
          }
        }
      }
    ]
  })
}
