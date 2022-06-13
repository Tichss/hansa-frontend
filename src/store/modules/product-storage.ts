import apiClient from '@/lib/api-client';
import { Product } from '@/model/Product';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ namespaced: true, preserveState: false })
export default class ProductStorage extends VuexModule {
    products: Array<Product> | null = null;

    @Mutation
    setProducts(products: Array<Product> | null): void {
        this.products = products;
    }

    @Action
    fetchProducts(): Promise<void> {
        return apiClient
            .get<number, Array<Product>>('/products')
            .then((data: Array<Product>) => {
                this.context.commit('setProducts', data);
            })
            .catch(() => {
                return Promise.reject();
            });
    }

    get getProducts(): Array<Product> | null {
        return this.products;
    }
}
