# Audio AI Studio - Comprehensive SaaS Platform

A professional-grade audio AI studio that replicates and improves upon ElevenLabs' functionality, offering ultra-realistic text-to-speech, voice cloning, dubbing, and comprehensive audio processing capabilities.

## 🚀 Features

### Core Capabilities
- **Multi-modal TTS Engine**: 32+ languages with adjustable prosody, speed, pitch, and SSML support
- **Voice Cloning**: Instant short-sample cloning and professional multi-sample cloning
- **Studio UI**: Project-based workspace with multi-track editor and timeline
- **Dubbing Studio**: Video upload with automated lip-sync dubbing
- **Conversational AI**: Voice-based chatbots with persistent context
- **Speech-to-Text**: High-accuracy transcription with speaker diarization
- **Music & SFX**: Royalty-free music generation and mixing tools

### Business Features
- **Credits System**: Usage-based billing with overage support
- **API & SDKs**: REST API with JavaScript and Python SDKs
- **Team Management**: Multi-seat workspaces with role-based access
- **Enterprise Security**: HIPAA compliance, SSO/SCIM, audit logs
- **Billing Integration**: Stripe integration with multiple pricing tiers

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL with Redis for caching and job queues
- **Storage**: AWS S3 for media assets
- **Processing**: Bull queues for background job processing
- **Payments**: Stripe for subscription and metered billing
- **Deployment**: Docker, AWS EKS, CloudFront CDN

### Project Structure
```
audio-ai-studio/
├── frontend/           # Next.js React application
├── backend/            # Node.js Express API
├── shared/             # Shared types and utilities
├── infrastructure/     # Terraform and deployment configs
└── docs/              # Documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Redis 6+
- AWS Account (for S3 storage)
- Stripe Account (for payments)

### 1. Clone Repository
```bash
git clone https://github.com/your-org/audio-ai-studio.git
cd audio-ai-studio
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 3. Environment Setup

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/audio_ai_studio"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# AWS (for S3 storage)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="your-s3-bucket"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
```

### 4. Database Setup
```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Servers
```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## 📋 Pricing Tiers

| Plan | Price | Credits/Month | Key Features |
|------|-------|---------------|--------------|
| **Free** | $0 | 10k | TTS, STT, Studio (limited), API access |
| **Starter** | $5 | 30k | + Commercial license, instant voice cloning, dubbing |
| **Creator** | $11 | 100k | + Professional voice cloning, higher quality audio |
| **Pro** | $99 | 500k | + 44.1kHz PCM, higher concurrency, priority support |
| **Scale** | $330 | 2M + 3 seats | + Multi-seat workspace, team admin controls |
| **Business** | $1,320 | 11M + 5 seats | + Low-latency TTS, dedicated support SLA |
| **Enterprise** | Custom | Custom | + HIPAA compliance, SSO, on-premise deployment |

## 🔧 Development

### Available Scripts

#### Root Level
```bash
npm run dev          # Start both frontend and backend
npm run build        # Build all packages
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run type-check   # Type check all packages
```

#### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm run type-check   # Type check
```

#### Backend
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

### Code Quality
- **TypeScript**: Strict type checking across all packages
- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for quality checks

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### AWS Deployment
1. Configure AWS CLI with appropriate credentials
2. Update Terraform variables in `infrastructure/terraform.tfvars`
3. Deploy infrastructure:
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

### Environment Variables for Production
Ensure all production environment variables are set:
- Database connection strings
- Redis connection
- AWS credentials and S3 bucket
- Stripe keys
- OAuth credentials
- JWT secrets
- Email service configuration

## 📚 API Documentation

### Authentication
```bash
# Register new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Text-to-Speech
```bash
# Generate speech
POST /api/tts/generate
Authorization: Bearer <token>
{
  "text": "Hello, world!",
  "voiceId": "voice-uuid",
  "speed": 1.0,
  "pitch": 0,
  "outputFormat": "mp3"
}
```

### Voice Cloning
```bash
# Clone voice
POST /api/voices/clone
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "My Voice"
type: "instant"
audioFiles: [file1.mp3, file2.wav]
```

### Full API documentation available at `/api/docs` when running the server.

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Owner, Admin, Editor, Viewer)
- OAuth2 integration (Google, GitHub)
- Multi-factor authentication support

### Data Protection
- End-to-end encryption for user media
- PII redaction in logs
- Configurable data retention policies
- HIPAA compliance for Enterprise plans

### Infrastructure Security
- TLS encryption in transit
- Data encryption at rest
- WAF protection
- VPC network isolation
- Regular security audits

## 📊 Monitoring & Analytics

### Application Monitoring
- Winston logging with structured JSON
- Error tracking and alerting
- Performance metrics
- Usage analytics

### Infrastructure Monitoring
- Health check endpoints
- Database connection monitoring
- Redis connection monitoring
- Queue processing metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages
- Ensure all checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)

### Community
- [GitHub Issues](https://github.com/your-org/audio-ai-studio/issues)
- [Discussions](https://github.com/your-org/audio-ai-studio/discussions)
- [Discord Community](https://discord.gg/audio-ai-studio)

### Enterprise Support
For enterprise customers, we offer:
- Dedicated support channels
- Custom SLAs
- Priority bug fixes
- Custom feature development
- On-site training

Contact: enterprise@audioaistudio.com

---

**Built with ❤️ by the Audio AI Studio Team**