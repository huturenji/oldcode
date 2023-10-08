/**
 * 任务队列锁。执行完一个（异步）任务后，才会开始执行下一个任务
 */
export default class Queue{
    constructor(){
        this.TASK_QUEUE = [];
        this.start = false;
    }

    async run(){
        if (this.TASK_QUEUE.length>0){
            let task = this.TASK_QUEUE.shift();//pop出队列第一个任务
            await task();//执行任务
            //队列是否扫描完
            if (this.TASK_QUEUE.length == 0){
                this.start = false;
                return;
            }
            this.start = true;
            this.run();
        }
    }

    exec(task){
        this.TASK_QUEUE.push(task);
        if (!this.start){
            this.start = true;
            this.run();
        }
    }
}
