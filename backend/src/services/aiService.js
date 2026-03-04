import { spawnSync } from 'child_process';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function evaluateMetricsWithAI(metricPayload) {
  const scriptPath = process.env.AI_INFER_SCRIPT_PATH ||
    path.join(__dirname, '../../../ai/infer_isolation_forest.py');

  const input = JSON.stringify({
    cpuUsage: metricPayload.cpuUsage,
    memoryUsage: metricPayload.memoryUsage,
    diskUsage: metricPayload.diskUsage,
    netRx: metricPayload.netRx,
    netTx: metricPayload.netTx
  });

  const result = spawnSync('python', [scriptPath], {
    input,
    encoding: 'utf-8'
  });

  if (result.error) {
    console.error('AI inference failed', result.error);
    return {
      isAnomalous: false,
      anomalyScore: 0,
      healthScore: 100,
      riskLevel: 'Low'
    };
  }

  try {
    const parsed = JSON.parse(result.stdout);
    return parsed;
  } catch (err) {
    console.error('Failed to parse AI output', err, result.stdout, result.stderr);
    return {
      isAnomalous: false,
      anomalyScore: 0,
      healthScore: 100,
      riskLevel: 'Low'
    };
  }
}

