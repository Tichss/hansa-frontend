import Vue from 'vue';
import Vuex from 'vuex';
import purchaseStorage from './modules/purchase-storage';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        purchaseStorage,
    },
});
