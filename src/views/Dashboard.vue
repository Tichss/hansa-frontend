<template>
    <div class="wrapper">
        <div class="table-wrapper">
            <div class="header">
                <b-dropdown variant="primary">
                    <template #button-content> Filter </template>
                    <b-dropdown-item href="#">Action</b-dropdown-item>
                    <b-dropdown-item href="#">Another action</b-dropdown-item>
                </b-dropdown>
                <b-button @click="$router.push({ name: 'NewShopping' })">
                    Új vásárlás
                </b-button>
            </div>
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
            <div class="footer">
                <div class="pagination-wrapper">
                    <b-pagination
                        :value="purchases?.currentPage"
                        :total-rows="purchases?.totalItems"
                        :per-page="20"
                        aria-controls="table"
                        limit="5"
                        @change="fetchPageablePurchases($event)"
                        class="pagination m-0"
                    />
                </div>
                <b-button v-b-modal.export-modal variant="primary">
                    Export
                </b-button>
                <b-modal
                    id="export-modal"
                    class="modal"
                    hide-footer
                    hide-header
                >
                    <img
                        class="close-icon"
                        src="@/assets/close-icon.svg"
                        @click="onClose"
                    />
                    <b-form-row>
                        <b-col cols="8">
                            <b-form-input v-model="fileName" />
                        </b-col>
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
                    </b-form-row>
                </b-modal>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ProductCard from '@/components/PurchaseProductCard.vue';
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
    .table-wrapper {
        background: #ffffff;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;

        .header {
            padding: 15px 20px;
            border-bottom: 1px solid #d9d5ec;
        }

        .footer {
            background: #f4f2ff;
            .pagination-wrapper {
                display: inline-block;
                .pagination {
                    width: fit-content;
                }
            }
        }
    }
    .table {
        margin-bottom: 0;
        $tabble_padding: 15px;
        /deep/ th {
            font-style: normal;
            font-weight: 600;
            font-size: 12px;
            line-height: 15px;
            text-transform: uppercase;
            color: var(--font-primary-variant);
            background: var(--background-stripe);
            border-bottom: unset;

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
            font-size: 12px;
            font-weight: 500;
            background: white;
            color: #6e6893;
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
.close-icon {
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 500;
}
</style>
