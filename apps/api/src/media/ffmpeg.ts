import { spawn } from 'node:child_process';
import { env } from '../config/env';

export function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegPath = env.ffmpegPath ?? 'ffmpeg';
    const child = spawn(ffmpegPath, args, { stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}
