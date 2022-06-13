<template>
    <div class="card-costume">
        <div class="shop-image">
            <img src="@/assets/shop.jpg" alt="" />
        </div>
        <div class="details">
            <div><strong>Bolt neve: </strong> {{ shop?.name }}</div>
            <div><strong>Azonosító: </strong> {{ shop?.id }}</div>
            <div>
                <strong>Partner azonosító: </strong> {{ shop?.partnerId }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Shop } from '@/model/Shop';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ShopCard extends Vue {
    @Prop() shop!: Shop;
}
</script>
<style lang="scss" scoped>
.card-costume {
    width: 100%;
    display: flex;
    .shop-image {
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
        // background-image: url('~@/assets/shop.jpg');
    }
    .details {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: space-between;
    }
}
</style>
