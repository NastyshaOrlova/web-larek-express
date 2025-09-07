import fs from 'fs';
import cron from 'node-cron';
import path from 'path';

const startCleanupScheduler = () => {
  cron.schedule('0 * * * *', () => {
    const tempDir = 'uploads/temp';
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    if (!fs.existsSync(tempDir)) return;

    fs.readdir(tempDir, (err, files) => {
      if (err) return;

      files.forEach((file) => {
        const filePath = path.join(tempDir, file);
        fs.stat(filePath, (_err, stats) => {
          if (err) return;

          if (stats.mtime.getTime() < oneHourAgo) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  });
};

export default startCleanupScheduler;
