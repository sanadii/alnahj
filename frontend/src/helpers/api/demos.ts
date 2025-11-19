import axios from 'utils/axios';
import type { DemoSeedJob, DemoSeedRequestPayload } from 'types/demo';

export const startDemoSeedJob = async (payload: DemoSeedRequestPayload): Promise<DemoSeedJob> => {
  const response = await axios.post('/api/demos/election-seed/', payload);
  return response.data as DemoSeedJob;
};

export const getDemoSeedJob = async (jobId: number): Promise<DemoSeedJob> => {
  const response = await axios.get(`/api/demos/election-seed/${jobId}/`);
  return response.data as DemoSeedJob;
};

