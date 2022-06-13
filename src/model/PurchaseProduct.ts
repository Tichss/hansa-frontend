import { Product } from './Product';

export type PurchaseProduct = {
    id: number;
    product: Product;
    amount: number;
    priceBrutto: number;
    partnerId: number;
};
