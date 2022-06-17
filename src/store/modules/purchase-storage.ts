import apiClient from '@/lib/api-client';
import Pageable from '@/model/Pageable';
import { Purchase } from '@/model/Purchase';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ namespaced: true, preserveState: false })
export default class PurchaseStorage extends VuexModule {
    purchases: Pageable<Purchase> | null = null;

    @Mutation
    setPurchases(purchases: Pageable<Purchase> | null): void {
        if (purchases) {
            purchases.items.forEach((purchase) => {
                if (purchase.createdAt) {
                    purchase.createdAt = new Date(purchase.createdAt);
                }
            });
        }
        this.purchases = purchases;
    }

    @Action
    fetchPageablePurchases(request: {
        page: number;
        orderMode: number;
    }): Promise<void> {
        return apiClient
            .get<number, Pageable<Purchase>>('/purchases', {
                params: { page: request.page, orderMode: request.orderMode },
            })
            .then((data: Pageable<Purchase>) => {
                this.context.commit('setPurchases', data);
            })
            .catch(() => {
                // this.context.commit('setError', error);
                return Promise.reject();
            });
    }

    @Action
    addPurchase(purchase: Purchase): Promise<void> {
        return apiClient
            .post<Purchase>('/purchases', purchase)
            .then(() => {
                return Promise.resolve();
            })
            .catch(() => {
                return Promise.reject();
            });
    }

    @Action
    deletePurchaseById(id: number): Promise<void> {
        return apiClient
            .delete(`/purchases/${id}`)
            .then(() => {
                // this.context.commit('deleteUser', id);
                return Promise.resolve();
            })
            .catch(() => {
                return Promise.reject();
            });
    }

    get getPurchases(): Pageable<Purchase> | null {
        return this.purchases;
    }
}
