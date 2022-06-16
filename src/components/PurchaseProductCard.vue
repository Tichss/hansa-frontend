<template>
    <div class="card-costume">
        <img
            class="close-icon"
            src="@/assets/close-icon.svg"
            @click="onDelete(purchaseProduct)"
        />
        <div class="product-image">
            <img src="@/assets/cola.png" alt="" />
        </div>
        <div class="details">
            <div>
                <strong>{{ purchaseProduct.product.name }}</strong>
            </div>
            <div>
                <strong>Mennyiség: </strong>
                {{ purchaseProduct?.amount }}
                {{ purchaseProduct?.product.amountUnit }}
            </div>
            <div>
                <strong>Vonalkód: </strong>
                {{ purchaseProduct?.product.barCode }}
            </div>
            <div>
                <strong>Ár(bruttó): </strong>
                {{ Math.round(purchaseProduct?.priceBrutto) }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PurchaseProduct } from '@/model/PurchaseProduct';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PurchaseProductCard extends Vue {
    @Prop() purchaseProduct!: PurchaseProduct;

    @Emit()
    onDelete(): PurchaseProduct {
        return this.purchaseProduct;
    }
}
</script>
<style lang="scss" scoped>
.card-costume {
    position: relative;
    width: 150px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    background-color: white;
    .product-image {
        width: 100%;
        aspect-ratio: 1;
        border-radius: inherit;
        img {
            height: 100%;
            max-width: 100%;
            display: block;
            margin: auto;
            border-radius: inherit;
        }
    }
    .details {
        padding: 10px;
        font-size: 12px;

        .shop-name {
            font-size: 14px;
        }
    }
}
.close-icon {
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 500;
}
</style>
