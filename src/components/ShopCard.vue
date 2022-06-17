<template>
    <div class="card-costume">
        <div class="shop-image">
            <img src="@/assets/shop.jpg" alt="" />
        </div>
        <div class="details">
            <div class="shop-name">
                <strong>{{ shop?.name }}</strong>
            </div>
            <div><strong>Azonosító: </strong>{{ shop?.id }}</div>
            <div><strong>Partner azonosító: </strong>{{ shop?.partnerId }}</div>
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
    width: 150px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    background-color: white;
    .shop-image {
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
        white-space: normal;

        .shop-name {
            font-size: 14px;
        }
    }
}
</style>
