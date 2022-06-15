<template>
    <div class="card-costume">
        <div class="product-image">
            <img src="@/assets/cola.png" alt="" />
        </div>
        <div class="details">
            <div>
                <strong>Termék neve:</strong>
                {{ purchaseProduct?.product.name }}
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
                <strong>Ár(bruttó): </strong> {{ purchaseProduct?.priceBrutto }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PurchaseProduct } from '@/model/PurchaseProduct';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PurchaseProductCard extends Vue {
    @Prop() purchaseProduct!: PurchaseProduct;
}
</script>
<style lang="scss" scoped>
.card-costume {
    width: 100%;
    display: flex;
    .product-image {
        border-radius: 10px;
        height: 100px;
        width: 100px;
        -webkit-box-shadow: 0px 0px 19px -5px rgba(0, 0, 0, 0.5);
        box-shadow: 0px 0px 19px -5px rgba(0, 0, 0, 0.5);
        img {
            height: 100%;
            max-width: 100%;
            display: block;
            margin: auto;
            border-radius: inherit;
        }
    }
    .details {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: space-between;
    }
}
</style>
