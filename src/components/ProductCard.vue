<template>
    <div class="card-costume">
        <div class="product-image">
            <img src="@/assets/cola.png" alt="" />
        </div>
        <div class="details">
            <div>
                <strong>{{ product?.name }}</strong>
            </div>
            <div>
                <strong>{{ Math.round(product?.price) }} Ft</strong>/{{
                    product.amountUnit
                }}
                (bruttó)
            </div>
            <div>
                <strong>Vonalkód: </strong>
                {{ product.barCode }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Product } from '@/model/Product';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProductCard extends Vue {
    @Prop() product!: Product;
}
</script>
<style lang="scss" scoped>
.card-costume {
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
</style>
