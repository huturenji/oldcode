/**
 * 单次操作锁。一个任务仅可执行一次，除非手动调用release释放锁
 */
const DEFAULT_GROUP = 'once_lock_default_group'
export default class Once{
    constructor(){
        this.LOCK_ROOM = {};
    }

    release(group){
        delete this.LOCK_ROOM[group ?? DEFAULT_GROUP];
    }

    releaseAll(){
        this.LOCK_ROOM = {};
    }

    exec(task, group){
        if (group==null || group==undefined || group==''){
            group = DEFAULT_GROUP
        }
        //第一个进分组的开启锁
        if (!this.LOCK_ROOM[group]){
            this.LOCK_ROOM[group] = true;
            task?.();
        }
    }
}
