<template>
    <div>
        <h1>Bolt:</h1>
        <div class="shops-wrapper">
            <shop-card
                v-for="shop in shops"
                :key="shop.id"
                :shop="shop"
                :class="{ 'selected-shop-card': selectedShop == shop }"
                class="shop-card"
                @click.native="setSelectedShop(shop)"
            />
        </div>
        <h1>Termékek:</h1>
        <div class="products-wrapper">
            <product-card
                v-for="product in products"
                :key="product.id"
                :product="product"
                class="product-card"
                @click.native="addToCartModal(product)"
            />
        </div>
        <b-modal id="add-to-cart-modal" class="modal" hide-footer hide-header>
            <img
                class="close-icon"
                src="@/assets/close-icon.svg"
                @click="onClose"
            />
            <b-form-row class="mt-3">
                <b-col>
                    <b-button class="w-100" @click="addToCart(1)">
                        Kosárba
                    </b-button>
                </b-col>
            </b-form-row>
        </b-modal>
        <h1>Kosár:</h1>
        <purchase-product-card
            v-for="purchaseProduct in cart"
            :key="purchaseProduct.id"
            :purchase-product="purchaseProduct"
            class="product-card"
        />
    </div>
</template>
<script lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import PurchaseProductCard from '@/components/PurchaseProductCard.vue';
import ShopCard from '@/components/ShopCard.vue';
import { Product } from '@/model/Product';
import { PurchaseProduct } from '@/model/PurchaseProduct';
import { Shop } from '@/model/Shop';
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';

@Component({
    components: {
        ShopCard,
        ProductCard,
        PurchaseProductCard,
    },
    methods: {
        ...mapActions({
            fetchShops: 'shopStorage/fetchShops',
            fetchProducts: 'productStorage/fetchProducts',
        }),
    },

    computed: {
        ...mapGetters({
            shops: 'shopStorage/getShops',
            products: 'productStorage/getProducts',
        }),
    },
})
export default class NewShopping extends Vue {
    loading = false;

    shops!: Array<Shop> | null;

    products!: Array<Product> | null;

    selectedShop: Shop | null = null;

    selectedProduct: Product | null = null;

    cart: Array<PurchaseProduct> = [];

    fetchShops!: () => Promise<void>;

    fetchProducts!: () => Promise<void>;

    setSelectedShop(shop: Shop): void {
        this.selectedShop = shop;
    }

    setSelectedProduct(product: Product): void {
        this.selectedProduct = product;
    }

    addToCartModal(product: Product) {
        this.setSelectedProduct(product);
        this.$bvModal.show('add-to-cart-modal');
    }

    onClose() {
        this.$bvModal.hide('add-to-cart-modal');
    }

    addToCart(amount: number) {
        this.onClose();
        const purchaseProduct = {
            product: this.selectedProduct,
            amount,
            priceBrutto: this.selectedProduct!.price * amount,
        } as PurchaseProduct;
        this.cart.push(purchaseProduct);
    }

    mounted(): void {
        this.loading = true;
        Promise.all([this.fetchShops(), this.fetchProducts()])
            .catch((error) => {
                this.$store.commit('locationsStorage/setError', error);
            })
            .finally(() => {
                console.log(this.shops);
                console.log(this.products);
                this.loading = false;
            });
    }
}
</script>
<style lang="scss" scoped>
.shops-wrapper {
    margin: auto;
    // border: 1px solid black;
    width: 80%;
    display: flex;
    overflow: auto;

    .selected-shop-card {
        transition: transform 0.2s;
        box-shadow: 0px 0px 20px var(--font-primary-variant);
    }
    .shop-card {
        flex-shrink: 0;
        margin: 10px;
        cursor: pointer;
        transition: transform 0.2s;
        &:hover {
            transform: scale(1.02);
        }
    }
    .product-card {
        flex-shrink: 0;
        margin: 20px;
        cursor: pointer;
        transition: transform 0.2s;
        &:hover {
            transform: scale(1.02);
        }
    }
}

.products-wrapper {
    margin: auto;
    width: 85%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .product-card {
        flex-shrink: 0;
        margin: 10px;
        cursor: pointer;
        transition: transform 0.2s;
        &:hover {
            transform: scale(1.02);
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
