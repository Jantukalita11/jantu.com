import { PrismaClient, JobStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class JobService {
  async createJob(data: {
    type: string;
    ownerId: string;
    input: any;
    status?: JobStatus;
    projectId?: string;
  }) {
    return await prisma.job.create({
      data: {
        type: data.type as any,
        ownerId: data.ownerId,
        input: data.input,
        status: data.status || 'PENDING',
        projectId: data.projectId,
      },
    });
  }

  async updateJobStatus(jobId: string, status: JobStatus, progress?: number) {
    const updateData: any = { status };
    if (progress !== undefined) {
      updateData.progress = progress;
    }

    return await prisma.job.update({
      where: { id: jobId },
      data: updateData,
    });
  }

  async completeJob(jobId: string, output: any) {
    return await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        output,
        completedAt: new Date(),
      },
    });
  }

  async failJob(jobId: string, error: string) {
    return await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'FAILED',
        error,
        completedAt: new Date(),
      },
    });
  }

  async getJob(jobId: string, userId: string) {
    return await prisma.job.findFirst({
      where: {
        id: jobId,
        ownerId: userId,
      },
    });
  }

  async getUserJobs(userId: string, limit: number = 50, offset: number = 0) {
    return await prisma.job.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async cancelJob(jobId: string, userId: string) {
    const job = await this.getJob(jobId, userId);
    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status === 'COMPLETED' || job.status === 'FAILED') {
      throw new Error('Cannot cancel completed or failed job');
    }

    return await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    });
  }
}