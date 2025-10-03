# Deployment Guide

This guide covers deploying Audio AI Studio to various environments.

## 🐳 Docker Deployment (Recommended for Development)

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- PostgreSQL and Redis (handled by Docker Compose)

### Quick Start
```bash
# Clone and setup
git clone <repository-url>
cd audio-ai-studio

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database: localhost:5432
# Redis: localhost:6379
```

### Environment Configuration
Update `docker-compose.yml` environment variables or create `docker-compose.override.yml`:

```yaml
version: '3.8'
services:
  backend:
    environment:
      - AWS_ACCESS_KEY_ID=your-aws-key
      - AWS_SECRET_ACCESS_KEY=your-aws-secret
      - STRIPE_SECRET_KEY=your-stripe-key
      - GOOGLE_CLIENT_ID=your-google-client-id
      - GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## ☁️ AWS Deployment

### Architecture Overview
- **EKS**: Kubernetes cluster for container orchestration
- **RDS**: PostgreSQL database
- **ElastiCache**: Redis cluster
- **S3**: Media file storage
- **CloudFront**: CDN for static assets
- **ALB**: Application Load Balancer
- **Route53**: DNS management

### Prerequisites
- AWS CLI configured
- kubectl installed
- Terraform installed (optional, for IaC)
- Docker images built and pushed to ECR

### Step 1: Infrastructure Setup

#### Option A: Using Terraform (Recommended)
```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review and modify terraform.tfvars
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

#### Option B: Manual Setup
1. Create EKS cluster
2. Set up RDS PostgreSQL instance
3. Create ElastiCache Redis cluster
4. Set up S3 bucket for media storage
5. Configure CloudFront distribution
6. Set up ALB and security groups

### Step 2: Database Setup
```bash
# Connect to RDS instance
psql -h your-rds-endpoint -U postgres -d audio_ai_studio

# Run migrations (from backend container or local)
npx prisma migrate deploy
npx prisma db seed
```

### Step 3: Container Images
```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

# Build and tag images
docker build -t audio-ai-studio-frontend ./frontend
docker build -t audio-ai-studio-backend ./backend

docker tag audio-ai-studio-frontend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio-frontend:latest
docker tag audio-ai-studio-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio-backend:latest

# Push images
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio-frontend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio-backend:latest
```

### Step 4: Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/k8s/

# Check deployment status
kubectl get pods
kubectl get services
kubectl get ingress
```

### Step 5: Configure Domain and SSL
```bash
# Update Route53 DNS records
# Configure SSL certificate via ACM
# Update ALB ingress with SSL annotations
```

## 🚀 Production Checklist

### Security
- [ ] Enable WAF on ALB/CloudFront
- [ ] Configure VPC with private subnets
- [ ] Set up IAM roles with least privilege
- [ ] Enable encryption at rest for RDS and S3
- [ ] Configure security groups properly
- [ ] Set up AWS Secrets Manager for sensitive data
- [ ] Enable CloudTrail for audit logging

### Performance
- [ ] Configure auto-scaling for EKS nodes
- [ ] Set up horizontal pod autoscaling
- [ ] Configure CloudFront caching rules
- [ ] Optimize database connections
- [ ] Set up Redis clustering if needed
- [ ] Configure CDN for static assets

### Monitoring
- [ ] Set up CloudWatch dashboards
- [ ] Configure application metrics
- [ ] Set up log aggregation
- [ ] Configure alerts and notifications
- [ ] Set up health checks
- [ ] Configure Sentry for error tracking

### Backup & Recovery
- [ ] Enable RDS automated backups
- [ ] Set up S3 cross-region replication
- [ ] Configure database point-in-time recovery
- [ ] Test disaster recovery procedures
- [ ] Document recovery processes

## 🔧 Environment Variables

### Production Environment Variables
```bash
# Application
NODE_ENV=production
PORT=3001
API_URL=https://api.audioaistudio.com
FRONTEND_URL=https://audioaistudio.com

# Database
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/audio_ai_studio

# Redis
REDIS_URL=redis://elasticache-endpoint:6379

# AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=audio-ai-studio-prod-assets

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Monitoring
SENTRY_DSN=https://...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG....
```

## 📊 Scaling Considerations

### Database Scaling
- Use read replicas for read-heavy workloads
- Consider database sharding for very large datasets
- Implement connection pooling
- Monitor and optimize slow queries

### Application Scaling
- Horizontal scaling with multiple pods/containers
- Implement caching strategies
- Use CDN for static content
- Consider microservices architecture for large scale

### Queue Processing
- Scale queue workers based on queue depth
- Implement dead letter queues
- Monitor processing times
- Consider using SQS/SNS for very high throughput

## 🔍 Monitoring & Observability

### Key Metrics to Monitor
- Application response times
- Database connection pool usage
- Queue processing times
- Error rates and types
- Resource utilization (CPU, memory, disk)
- Active user sessions
- API rate limit usage

### Recommended Tools
- **Metrics**: CloudWatch, Prometheus + Grafana
- **Logging**: ELK Stack, CloudWatch Logs
- **APM**: New Relic, Datadog, or Sentry Performance
- **Uptime**: Pingdom, StatusCake
- **Security**: AWS GuardDuty, Security Hub

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
kubectl exec -it backend-pod -- npx prisma db pull

# Check connection pool
kubectl logs backend-pod | grep "database"
```

#### Redis Connection Issues
```bash
# Test Redis connectivity
kubectl exec -it backend-pod -- redis-cli -h redis-endpoint ping
```

#### File Upload Issues
```bash
# Check S3 permissions
aws s3 ls s3://your-bucket --region us-east-1

# Check IAM role permissions
aws sts get-caller-identity
```

#### Performance Issues
```bash
# Check resource usage
kubectl top pods
kubectl top nodes

# Check application logs
kubectl logs -f deployment/backend
```

### Support Contacts
- **Infrastructure Issues**: devops@audioaistudio.com
- **Application Issues**: support@audioaistudio.com
- **Security Issues**: security@audioaistudio.com

---

For more detailed deployment instructions, see the specific environment guides in the `infrastructure/` directory.