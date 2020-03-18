/* eslint-disable no-console */

import Queue from 'bull';
import redisConfig from '../config/redis';

import * as jobs from '../app/jobs';

const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  options: job.options,
  handle: job.handle,
}));

export default {
  queues,
  add(name, data) {
    const queue = this.queues.find(q => q.name === name);
    if (queue) {
      queue.bull.add(data, queue.options);
    }
  },

  process() {
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);
      queue.bull.on('failed', (job, err) => {
        console.error('Job failed ', job.name, job.data, err);
      });
    });
  },
};
