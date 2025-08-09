import { mkdir } from 'fs/promises';
import { join } from 'path';

async function createLogDirectories() {
  const logDir = join(process.cwd(), 'logs');

  try {
    await mkdir(logDir, { recursive: true });
    console.log('✅ Logs directory created successfully');
  } catch (error) {
    console.error('❌ Error creating logs directory:', error.message);
    process.exit(1);
  }
}

createLogDirectories();
