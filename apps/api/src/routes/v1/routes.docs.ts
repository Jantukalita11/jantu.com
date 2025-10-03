import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

export const router = Router();

const openapiPath = path.resolve(process.cwd(), 'packages/openapi/openapi.yaml');
let openapiDoc: any = undefined;
try {
  const raw = fs.readFileSync(openapiPath, 'utf8');
  openapiDoc = yaml.parse(raw);
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('OpenAPI not found at', openapiPath);
}

router.use('/', swaggerUi.serve, swaggerUi.setup(openapiDoc ?? { openapi: '3.0.3', info: { title: 'API', version: '0.0.0' } }));
