export default {
    namespace: 'decocoms',
    state: {
        storeList: [],
        seckillStoreList: []
    },

    effects: {
    },
 
    reducers: {
        setParams(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    }
};
