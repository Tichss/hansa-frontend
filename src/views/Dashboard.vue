<template>
    <div class="wrapper">
        <b-button @click="$router.push({ name: 'NewShopping' })">
            Új vásárlás
        </b-button>
        <b-table
            id="table"
            class="table"
            :items="purchases?.items"
            :fields="getTableFields"
            small
        >
            <template #table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong> Töltés </strong>
                </div>
            </template>
            <template #cell(createdAt)="row">
                {{ row.item.createdAt?.toLocaleString() }}
            </template>
            <template #cell(show_details)="row">
                <img
                    v-show="!row.detailsShowing"
                    :id="row.item.id"
                    v-b-toggle="'collapse' + row.item.id"
                    src="@/assets/arrow_down.svg"
                    @click="row.toggleDetails"
                />
                <img
                    v-show="row.detailsShowing"
                    :id="row.item.id"
                    v-b-toggle="'collapse' + row.item.id"
                    src="@/assets/arrow_up.svg"
                    @click="row.toggleDetails"
                />
                <button @click="deleteOnClick(row.item.id)">Delete</button>
            </template>

            <template #row-details="row">
                <h2>Bolt:</h2>
                <shop-card :shop="row.item.shop" />
                <h2>Termékek:</h2>
                <product-card
                    v-for="purchaseProduct in row.item.purchaseProducts"
                    :key="purchaseProduct.id"
                    :purchaseProduct="purchaseProduct"
                />
            </template>
        </b-table>
        <b-pagination
            :value="purchases?.currentPage"
            :total-rows="purchases?.totalItems"
            :per-page="20"
            aria-controls="table"
            limit="5"
            @change="fetchPageablePurchases($event)"
        />
        <b-button v-b-modal.export-modal variant="primary">Export</b-button>
        <b-modal id="export-modal" class="modal" hide-footer hide-header>
            <b-form-row>
                <b-col cols="8"> <b-form-input v-model="fileName" /> </b-col>
                <b-col>
                    <b-form-select
                        v-model="selectedFileFormat"
                        :options="selectableFileFormats"
                    />
                </b-col>
            </b-form-row>

            <b-form-row class="mt-3">
                <b-col>
                    <b-button @click="onExport" class="w-100">
                        Export
                    </b-button>
                </b-col>
                <b-col>
                    <b-button @click="onClose" class="w-100"> Bezár </b-button>
                </b-col>
            </b-form-row>
        </b-modal>
    </div>
</template>
<script lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import ShopCard from '@/components/ShopCard.vue';
import Pageable from '@/model/Pageable';
import { Purchase } from '@/model/Purchase';
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import exportFromJSON from 'export-from-json';

@Component({
    components: {
        ShopCard,
        ProductCard,
    },
    methods: {
        ...mapActions({
            fetchPageablePurchases: 'purchaseStorage/fetchPageablePurchases',
            deletePurchaseById: 'purchaseStorage/deletePurchaseById',
        }),
    },

    computed: {
        ...mapGetters({
            purchases: 'purchaseStorage/getPurchases',
        }),
    },
})
export default class Dashboard extends Vue {
    loading = false;

    purchases!: Pageable<Purchase> | null;

    fileName = '';

    selectableFileFormats = ['csv', 'xls'];

    selectedFileFormat = 'csv';

    fetchPageablePurchases!: (page: number) => Promise<void>;

    deletePurchaseById!: (id: number) => Promise<void>;

    deleteOnClick(id: number) {
        this.deletePurchaseById(id).then(() => {
            if (this.purchases) {
                this.fetchPageablePurchases(this.purchases.currentPage);
            }
        });
    }

    onClose() {
        this.$bvModal.hide('export-modal');
    }

    onExport() {
        exportFromJSON({
            data: this.purchases?.items ?? [],
            fileName: this.fileName,
            exportType:
                this.selectedFileFormat === 'csv'
                    ? exportFromJSON.types.csv
                    : exportFromJSON.types.xls,
            withBOM: true,
        });
        this.$bvModal.hide('export-modal');
    }

    get getTableFields(): Array<any> {
        return [
            {
                key: 'id',
                label: 'Id',
            },
            {
                key: 'createdAt',
                label: 'Időpont',
            },
            {
                key: 'cashRegisterId',
                label: 'Pénztárgép azonosító',
            },
            {
                key: 'shop.name',
                label: 'Bolt',
            },
            {
                key: 'show_details',
                label: 'Részletek',
            },
        ];
    }

    mounted(): void {
        this.loading = true;
        this.fetchPageablePurchases(1).finally(() => {
            this.loading = false;
            console.log(this.purchases?.items[0]);
        });
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    margin: auto;
    width: 80%;
    max-width: 800px;
    .table {
        $tabble_padding: 15px;
        /deep/ th {
            font-size: 14px;
            font-weight: 500;
            background: #fcfcfd;
            color: #667085;
            height: 40px;
            vertical-align: middle !important;
            border-top: unset;
            white-space: nowrap;
            overflow: hidden;
            &:first-child {
                padding-left: $tabble_padding;
            }

            &:last-child {
                padding-right: $tabble_padding;
                width: 1%;
                white-space: nowrap;
            }
        }

        /deep/ td {
            font-size: 14px;
            font-weight: 400;
            background: white;
            color: #667085;
            vertical-align: middle;
            min-height: 77px;
            white-space: nowrap;

            &:first-child {
                padding-left: $tabble_padding;
            }

            &:last-child {
                padding-right: $tabble_padding;
                width: 1%;
            }
        }
    }
}
</style>
