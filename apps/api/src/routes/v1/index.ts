import { Router } from 'express';
import { router as auth } from './routes.auth';
import { router as tts } from './routes.tts';
import { router as stt } from './routes.stt';
import { router as voices } from './routes.voices';
import { router as jobs } from './routes.jobs';
import { router as webhooks } from '../webhooks/routes.webhooks';
import { router as billing } from './routes.billing';
import { router as projects } from './routes.projects';
import { router as dubbing } from './routes.dubbing';
import { router as conversation } from './routes.conversation';
import { router as music } from './routes.music';
import { router as docs } from './routes.docs';

export const routerV1 = Router();

routerV1.use('/auth', auth);
routerV1.use('/tts', tts);
routerV1.use('/stt', stt);
routerV1.use('/voices', voices);
routerV1.use('/jobs', jobs);
routerV1.use('/webhooks', webhooks);
routerV1.use('/billing', billing);
routerV1.use('/projects', projects);
routerV1.use('/dubbing', dubbing);
routerV1.use('/conversation', conversation);
routerV1.use('/music', music);
routerV1.use('/docs', docs);
