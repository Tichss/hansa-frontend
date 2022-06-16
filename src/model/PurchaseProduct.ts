import { Product } from './Product';

export type PurchaseProduct = {
    uuid?: number;
    id: number;
    product: Product;
    amount: number;
    priceBrutto: number;
    partnerId: number;
};
