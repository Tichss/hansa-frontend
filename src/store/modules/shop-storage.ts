import apiClient from '@/lib/api-client';
import { Shop } from '@/model/Shop';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ namespaced: true, preserveState: false })
export default class ShopStorage extends VuexModule {
    shops: Array<Shop> | null = null;

    @Mutation
    setShops(shops: Array<Shop> | null): void {
        this.shops = shops;
    }

    @Action
    fetchShops(): Promise<void> {
        return apiClient
            .get<number, Array<Shop>>('/shops')
            .then((data: Array<Shop>) => {
                this.context.commit('setShops', data);
            })
            .catch(() => {
                return Promise.reject();
            });
    }

    get getShops(): Array<Shop> | null {
        return this.shops;
    }
}
