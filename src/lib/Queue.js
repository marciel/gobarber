import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue{
  constructor(){
    this.queues = {};

    this.init();
  }

  init(){
    jobs.forEach(({key, handle}) => {
      this.queues[key] = {
        bee: new Bee(key,{
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job){
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue(){
    jobs.forEach(job =>{
      const { bee, handle } = this.queues[job.key];
      //Monitorando falhas
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  //Function para monitorar as falhas
  handleFailure(job, err){
    console.log(`Queue ${job.queue.name}: FAILED`,err); //Aqui depois pode ser melhoardo onde armazenar as falhas
  }

}

export default new Queue();
