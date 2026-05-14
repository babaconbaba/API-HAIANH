import cluster from 'node:cluster';
import os from 'node:os';

const WORKERS = parseInt(process.env.WORKERS || '') || os.cpus().length;

if (cluster.isPrimary) {
  console.log(`[MISA API] Primary ${process.pid} — spawning ${WORKERS} workers`);

  for (let i = 0; i < WORKERS; i++) cluster.fork();

  cluster.on('exit', (worker, code) => {
    console.log(`[MISA API] Worker ${worker.process.pid} died (code ${code}), respawning...`);
    cluster.fork();
  });
} else {
  // Each worker runs the full Express app
  import('./index');
}
