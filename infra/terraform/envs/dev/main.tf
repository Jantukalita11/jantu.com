terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" { type = string, default = "us-east-1" }

# Placeholders for VPC, EKS, RDS, S3, and CloudFront
resource "aws_s3_bucket" "media" {
  bucket = "audio-ai-media-dev-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
}
