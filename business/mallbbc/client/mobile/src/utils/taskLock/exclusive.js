
/**
 * 排它锁
 * 当一个任务执行时，进入队列的任务不会执行。仅当第一个任务执行完后，再进入队列的第一个任务才可执行
 */
export default (function(){
    let LOCK_ROOM = {};
    return async (task, group)=>{
        if (group==null || group==undefined || group==''){
            group = 'exclusive_lock_default_group'
        }
        //第一个进分组的开启锁
        if (!LOCK_ROOM[group]){
            LOCK_ROOM[group] = new Promise(async resolve=>{
                await task?.();
                //执行完任务，移除锁
                resolve();
                delete LOCK_ROOM[group]
            });
            await LOCK_ROOM[group]
            return false;
        }
        await LOCK_ROOM[group]
        return true;
    };
})()