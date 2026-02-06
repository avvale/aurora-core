import { Logger } from '@nestjs/common';
import { env } from 'node:process';

export const memoryWatcher = (): void => {
  setInterval(
    () => {
      const memoryUsage = process.memoryUsage();

      Logger.log(
        `${(Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100).toFixed(2)} MB`,
        'Memory Usage',
      );
      Logger.log(
        `${(Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100).toFixed(2)} MB`,
        'Memory Total',
      );
      Logger.log(
        `${(Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100).toFixed(2)} MB`,
        'Memory RSS',
      );
    },
    (+env.APP_HEALTH_SECONDS_MEMORY_CHECK || 300) * 1000,
  );
};
