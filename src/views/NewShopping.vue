<template>
    <div>
        <h1>Bolt:</h1>
        <div></div>
        <h1>Termékek:</h1>
    </div>
</template>
<script lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import ShopCard from '@/components/ShopCard.vue';
import { Product } from '@/model/Product';
import { Shop } from '@/model/Shop';
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';

@Component({
    components: {
        ShopCard,
        ProductCard,
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

    fetchShops!: () => Promise<void>;

    fetchProducts!: () => Promise<void>;

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
<style lang="scss" scoped></style>
