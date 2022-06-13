import { PurchaseProduct } from './PurchaseProduct';
import { Shop } from './Shop';

export type Purchase = {
    id: number | null;
    createdAt: Date;
    price: number;
    cashRegisterId: number;
    partnerId: number;
    shop: Shop;
    purchaseProducts: Array<PurchaseProduct>;
};
