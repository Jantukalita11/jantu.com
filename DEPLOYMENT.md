# Deployment Guide

This guide covers deploying Audio AI Studio to AWS using Terraform and Kubernetes.

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.0
- kubectl configured
- Docker installed
- Node.js 18+

## AWS Infrastructure Setup

### 1. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region (us-east-1 recommended)
```

### 2. Create Terraform Backend (First Time Only)

```bash
# Create S3 bucket for Terraform state
aws s3 mb s3://audio-ai-studio-terraform-state --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket audio-ai-studio-terraform-state \
  --versioning-configuration Status=Enabled
```

### 3. Deploy Infrastructure

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review planned changes
terraform plan \
  -var="db_password=SECURE_PASSWORD_HERE" \
  -var="environment=production"

# Apply infrastructure
terraform apply \
  -var="db_password=SECURE_PASSWORD_HERE" \
  -var="environment=production"

# Save outputs
terraform output > outputs.txt
```

This creates:
- VPC with public/private subnets
- RDS PostgreSQL database
- ElastiCache Redis cluster
- S3 bucket for assets
- EKS cluster for inference workloads
- CloudFront CDN
- Security groups and IAM roles

## Database Setup

### 1. Connect to RDS

```bash
# Get RDS endpoint from Terraform outputs
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)

# Run migrations
cd ../../apps/backend
DATABASE_URL="postgresql://postgres:PASSWORD@${RDS_ENDPOINT}/audio_ai_studio" npm run migrate
```

### 2. Verify Database

```bash
# Connect to PostgreSQL
psql "postgresql://postgres:PASSWORD@${RDS_ENDPOINT}/audio_ai_studio"

# List tables
\dt

# Exit
\q
```

## Application Deployment

### 1. Build and Push Docker Images

```bash
# Login to AWS ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repositories (first time only)
aws ecr create-repository --repository-name audio-ai-studio/backend
aws ecr create-repository --repository-name audio-ai-studio/frontend
aws ecr create-repository --repository-name audio-ai-studio/worker

# Build and push backend
cd apps/backend
docker build -t audio-ai-backend:latest .
docker tag audio-ai-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio/backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio/backend:latest

# Build and push frontend
cd ../frontend
docker build -t audio-ai-frontend:latest .
docker tag audio-ai-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio/frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/audio-ai-studio/frontend:latest
```

### 2. Configure Kubernetes

```bash
# Update kubeconfig
aws eks update-kubeconfig \
  --region us-east-1 \
  --name audio-ai-studio-eks

# Verify connection
kubectl get nodes
```

### 3. Create Kubernetes Secrets

```bash
# Create namespace
kubectl create namespace audio-ai-studio

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=DATABASE_URL="postgresql://postgres:PASSWORD@${RDS_ENDPOINT}/audio_ai_studio" \
  --from-literal=REDIS_URL="redis://${REDIS_ENDPOINT}:6379" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=STRIPE_SECRET_KEY="sk_live_xxx" \
  --from-literal=AWS_ACCESS_KEY_ID="xxx" \
  --from-literal=AWS_SECRET_ACCESS_KEY="xxx" \
  -n audio-ai-studio
```

### 4. Deploy to Kubernetes

```bash
# Create Kubernetes manifests
cd ../../infrastructure/k8s

# Apply manifests
kubectl apply -f namespace.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f worker-deployment.yaml
kubectl apply -f ingress.yaml

# Wait for deployments
kubectl rollout status deployment/backend -n audio-ai-studio
kubectl rollout status deployment/frontend -n audio-ai-studio
kubectl rollout status deployment/worker -n audio-ai-studio
```

### 5. Configure Ingress/Load Balancer

```bash
# Get load balancer URL
kubectl get ingress -n audio-ai-studio

# Configure DNS
# Point your domain to the load balancer URL
```

## Post-Deployment

### 1. Health Checks

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check frontend
curl https://yourdomain.com
```

### 2. Create Admin User

```bash
# Connect to backend pod
kubectl exec -it deployment/backend -n audio-ai-studio -- /bin/sh

# Run admin creation script
node scripts/create-admin.js --email admin@yourdomain.com --password SecurePassword
```

### 3. Configure Monitoring

```bash
# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Install Grafana dashboards
kubectl apply -f infrastructure/k8s/monitoring/
```

### 4. Set Up Backups

```bash
# Configure RDS automated backups
aws rds modify-db-instance \
  --db-instance-identifier audio-ai-studio-db \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00"

# Configure S3 versioning and lifecycle
aws s3api put-bucket-lifecycle-configuration \
  --bucket audio-ai-studio-assets-production \
  --lifecycle-configuration file://s3-lifecycle.json
```

## Scaling

### Horizontal Pod Autoscaling

```bash
# Apply HPA
kubectl apply -f - <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: audio-ai-studio
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF
```

### Database Scaling

```bash
# Scale RDS instance
aws rds modify-db-instance \
  --db-instance-identifier audio-ai-studio-db \
  --db-instance-class db.r6g.xlarge \
  --apply-immediately
```

## Monitoring & Alerts

### CloudWatch Alarms

```bash
# CPU utilization alarm
aws cloudwatch put-metric-alarm \
  --alarm-name backend-high-cpu \
  --alarm-description "Backend CPU utilization > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name api-high-error-rate \
  --alarm-description "API error rate > 5%" \
  --metric-name ErrorRate \
  --namespace AudioAIStudio \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## Troubleshooting

### Check Pod Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n audio-ai-studio

# Frontend logs
kubectl logs -f deployment/frontend -n audio-ai-studio

# Worker logs
kubectl logs -f deployment/worker -n audio-ai-studio
```

### Debug Database Connection

```bash
# Port forward to RDS
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- \
  psql postgresql://postgres:PASSWORD@${RDS_ENDPOINT}/audio_ai_studio
```

### Check Redis Connection

```bash
# Port forward to Redis
kubectl run -it --rm redis-cli --image=redis:7 --restart=Never -- \
  redis-cli -h ${REDIS_ENDPOINT}
```

## Rollback

```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n audio-ai-studio
kubectl rollout undo deployment/frontend -n audio-ai-studio

# Check rollout history
kubectl rollout history deployment/backend -n audio-ai-studio
```

## Disaster Recovery

### Backup Strategy

1. **Database**: Automated daily backups, 7-day retention
2. **S3 Assets**: Versioning enabled, lifecycle policies
3. **Configuration**: Version controlled in Git

### Restore from Backup

```bash
# Restore RDS from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier audio-ai-studio-db-restored \
  --db-snapshot-identifier <snapshot-id>

# Update application to use restored database
kubectl set env deployment/backend \
  DATABASE_URL="postgresql://postgres:PASSWORD@new-endpoint/audio_ai_studio" \
  -n audio-ai-studio
```

## Security Hardening

### Enable WAF

```bash
# Create WAF web ACL
aws wafv2 create-web-acl \
  --name audio-ai-studio-waf \
  --scope REGIONAL \
  --region us-east-1 \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

### Enable VPC Flow Logs

```bash
# Enable VPC flow logs
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids vpc-xxxxx \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/audio-ai-studio
```

## Cost Optimization

1. **Use Reserved Instances** for predictable workloads
2. **Enable S3 Intelligent-Tiering** for asset storage
3. **Use Spot Instances** for batch processing workers
4. **Set up CloudWatch billing alarms**
5. **Review and optimize EKS node groups**

---

For production support: enterprise@audioaistudio.com
