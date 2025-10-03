import { PrismaClient, PlanTier, VoiceType, Gender, AgeRange } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default voices
  const voices = [
    {
      name: 'Sarah',
      type: VoiceType.PRESET,
      language: 'en',
      gender: Gender.FEMALE,
      ageRange: AgeRange.ADULT,
      accent: 'American',
      description: 'Professional female voice, American English',
      isPublic: true,
      previewUrl: 'https://example.com/previews/sarah.mp3',
    },
    {
      name: 'James',
      type: VoiceType.PRESET,
      language: 'en',
      gender: Gender.MALE,
      ageRange: AgeRange.ADULT,
      accent: 'British',
      description: 'Warm male voice, British English',
      isPublic: true,
      previewUrl: 'https://example.com/previews/james.mp3',
    },
    {
      name: 'Maria',
      type: VoiceType.PRESET,
      language: 'es',
      gender: Gender.FEMALE,
      ageRange: AgeRange.YOUNG_ADULT,
      accent: 'Spanish',
      description: 'Energetic female voice, Spanish accent',
      isPublic: true,
      previewUrl: 'https://example.com/previews/maria.mp3',
    },
    {
      name: 'Hiroshi',
      type: VoiceType.PRESET,
      language: 'ja',
      gender: Gender.MALE,
      ageRange: AgeRange.ADULT,
      accent: 'Japanese',
      description: 'Clear male voice, Japanese English',
      isPublic: true,
      previewUrl: 'https://example.com/previews/hiroshi.mp3',
    },
    {
      name: 'Emma',
      type: VoiceType.PRESET,
      language: 'en',
      gender: Gender.FEMALE,
      ageRange: AgeRange.YOUNG_ADULT,
      accent: 'Australian',
      description: 'Friendly female voice, Australian English',
      isPublic: true,
      previewUrl: 'https://example.com/previews/emma.mp3',
    },
  ];

  for (const voice of voices) {
    await prisma.voice.upsert({
      where: { name: voice.name },
      update: voice,
      create: voice,
    });
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@audioaistudio.com' },
    update: {},
    create: {
      email: 'admin@audioaistudio.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'OWNER',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create admin subscription
  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      planTier: PlanTier.ENTERPRISE,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      creditsIncluded: -1, // unlimited
      creditsUsed: 0,
    },
  });

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@audioaistudio.com' },
    update: {},
    create: {
      email: 'demo@audioaistudio.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'VIEWER',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create demo subscription
  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      planTier: PlanTier.CREATOR,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      creditsIncluded: 100000,
      creditsUsed: 15000,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });