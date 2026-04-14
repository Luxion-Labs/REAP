import pino from 'pino';
import pinoPretty from 'pino-pretty';
import { createWriteStream, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LOG_DIR = join(process.cwd(), 'logs');
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

const logPath = join(LOG_DIR, `deployment-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);

const pretty = pinoPretty({
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname',
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    depthLimit: 20,
    base: undefined,
  },
  pino.multistream([
    { stream: pretty, level: (process.env.LOG_LEVEL || 'info') as any },
    { stream: pino.destination({ dest: logPath, sync: true }), level: 'debug' },
  ])
);

export default logger;
