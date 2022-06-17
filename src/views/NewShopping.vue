<template>
    <div class="wrapper">
        <div class="shop-wrapper">
            <div class="header">
                Válassz egy boltot ahol a vásárlást rögzítjük
                <div class="little-circle">{{ shops.length }}</div>
            </div>
            <div class="shops-list">
                <shop-card
                    v-for="shop in shops"
                    :key="shop.id"
                    :shop="shop"
                    :class="{ 'selected-shop-card': selectedShop == shop }"
                    class="shop-card"
                    @click.native="setSelectedShop(shop)"
                />
            </div>
        </div>
        <div class="product-wrapper">
            <div class="header">
                Válassz termékeket a Kosárba
                <div class="little-circle">{{ products.length }}</div>
            </div>

            <div class="products-list">
                <product-card
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    class="product-card"
                    @click.native="addToCartModal(product)"
                />
            </div>
            <b-modal
                id="add-to-cart-modal"
                class="modal"
                hide-footer
                hide-header
            >
                <img
                    class="close-icon"
                    src="@/assets/close-icon.svg"
                    @click="onClose"
                />
                <product-card
                    :product="selectedProduct"
                    class="product-card-modal"
                />
                <b-form-spinbutton
                    v-model="amount"
                    class="mt-3"
                    min="1"
                    max="12"
                ></b-form-spinbutton>
                <b-button
                    class="w-100 mt-3"
                    variant="primary"
                    @click="addToCart()"
                >
                    Kosárba
                </b-button>
            </b-modal>
        </div>
        <div class="cart-wrapper">
            <div class="header">
                <span>Kosár Tartalma</span>
                <strong> {{ Math.round(total) }} Ft </strong>
                <b-button @click="buy" variant="primary">
                    {{ cart.length > 0 ? cart.length : '' }} Vásárlás
                </b-button>
            </div>
            <div class="cart-list">
                <purchase-product-card
                    v-for="purchaseProduct in cart"
                    :key="purchaseProduct.id"
                    :purchase-product="purchaseProduct"
                    class="product-card"
                    @on-delete="deleteFromCart(purchaseProduct)"
                    deletable
                />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import PurchaseProductCard from '@/components/PurchaseProductCard.vue';
import ShopCard from '@/components/ShopCard.vue';
import { Product } from '@/model/Product';
import { Purchase } from '@/model/Purchase';
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
            addPurchase: 'purchaseStorage/addPurchase',
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

    amount = 1;

    fetchShops!: () => Promise<void>;

    fetchProducts!: () => Promise<void>;

    addPurchase!: (purchase: Purchase) => Promise<void>;

    setSelectedShop(shop: Shop): void {
        this.selectedShop = shop;
    }

    setSelectedProduct(product: Product): void {
        this.selectedProduct = product;
    }

    addToCartModal(product: Product) {
        this.amount = 1;
        this.setSelectedProduct(product);
        this.$bvModal.show('add-to-cart-modal');
    }

    onClose() {
        this.$bvModal.hide('add-to-cart-modal');
    }

    addToCart(amount: number) {
        this.onClose();
        const purchaseProduct = {
            uuid: Math.random(),
            partnerId: 2011068,
            product: this.selectedProduct,
            amount: this.amount,
            priceBrutto: this.selectedProduct!.price * this.amount,
        } as PurchaseProduct;
        this.cart.push(purchaseProduct);
    }
    deleteFromCart(purchaseProduct: PurchaseProduct) {
        this.cart = this.cart.filter((item) => {
            return item.uuid !== purchaseProduct.uuid;
        });
    }

    get total() {
        if (this.cart.length === 0) return 0;
        return this.cart
            .map((purchaseProduct) => purchaseProduct.priceBrutto)
            .reduce((prev, next) => prev + next);
    }

    buy() {
        this.cart.forEach((item) => {
            delete item.uuid;
        });
        const purchase = {
            price: this.total,
            cashRegisterId: 1,
            partnerId: 2011068,
            shop: this.selectedShop,
            purchaseProducts: this.cart,
        } as Purchase;
        this.addPurchase(purchase);
        this.$router.push({ name: 'Dashboard' });
    }

    mounted(): void {
        this.loading = true;
        Promise.all([this.fetchShops(), this.fetchProducts()])
            .catch((error) => {
                this.$store.commit('locationsStorage/setError', error);
            })
            .finally(() => {
                this.loading = false;
            });
    }
}
</script>
<style lang="scss" scoped>
.wrapper {
    margin: auto;
    width: 60%;
    padding: 30px 0;
    .header {
        padding: 15px 20px;
        border-bottom: 1px solid #d9d5ec;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .little-circle {
        background-color: var(--primary);
        border-radius: 50%;
        height: 25px;
        width: 25px;
        display: flex;
        justify-content: center;
        align-content: center;
        color: white;
    }
    .shop-wrapper {
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;

        .shops-list {
            padding: 20px 0;
            display: flex;
            overflow: auto;
            background: white;

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
        }
    }

    .product-wrapper {
        margin-top: 30px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;

        .products-list {
            background: white;
            margin: auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-content: flex-start;
            overflow: auto;
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
    }

    .cart-wrapper {
        margin-top: 30px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;

        .cart-list {
            margin: auto;
            display: flex;
            flex-wrap: wrap;
            // justify-content: center;
            background: white;
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
    }
}

/deep/ #add-to-cart-modal___BV_modal_content_ {
    width: 260px;
    margin: auto;
}

.product-card-modal {
    margin: auto;
}
.close-icon {
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 500;
}
</style>
