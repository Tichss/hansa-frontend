import Vue from 'vue';
import Vuex from 'vuex';
import productStorage from './modules/product-storage';
import purchaseStorage from './modules/purchase-storage';
import shopStorage from './modules/shop-storage';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        purchaseStorage,
        shopStorage,
        productStorage,
    },
});
