terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# Skeleton resources - to be expanded
resource "aws_s3_bucket" "public" {
  bucket = var.public_bucket
}

resource "aws_s3_bucket" "private" {
  bucket = var.private_bucket
}
