import apiClient from '@/lib/api-client';
import Pageable from '@/model/Pageable';
import { Purchase } from '@/model/Purchase';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ namespaced: true, preserveState: false })
export default class PurchaseStorage extends VuexModule {
    purchases: Pageable<Purchase> | null = null;

    purchase: Purchase | null = null;

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

    @Mutation
    setPurchase(purchase: Purchase | null): void {
        if (purchase) {
            if (purchase.createdAt) {
                purchase.createdAt = new Date(purchase.createdAt);
            }
        }
        this.purchase = purchase;
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
                return Promise.reject();
            });
    }

    @Action
    fetchPurchaseById(id: number): Promise<void> {
        return apiClient
            .get<number, Purchase>(`/purchases/${id}`)
            .then((data: Purchase) => {
                this.context.commit('setPurchase', data);
            })
            .catch(() => {
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
    updatePurchase(purchase: Purchase): Promise<void> {
        return apiClient
            .put<Purchase>('/purchases', purchase)
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

    get getPurchase(): Purchase | null {
        return this.purchase;
    }
}
