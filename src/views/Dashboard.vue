<template>
    <div class="wrapper">
        <div class="table-wrapper">
            <div class="header">
                <b-dropdown variant="outline-primary">
                    <template #button-content>
                        <b-icon-filter /> Filter
                    </template>
                    <b-dropdown-item @click="setOrderMode(1)">
                        Legfrissebb
                    </b-dropdown-item>
                    <b-dropdown-item @click="setOrderMode(2)">
                        Legrégebbi
                    </b-dropdown-item>

                    <b-dropdown-divider />

                    <b-dropdown-item @click="setOrderMode(3)">
                        Legdrágább
                    </b-dropdown-item>
                    <b-dropdown-item @click="setOrderMode(4)">
                        Legolcsóbb
                    </b-dropdown-item>

                    <b-dropdown-divider />

                    <b-dropdown-item @click="setOrderMode(5)">
                        Bolt neve A-Z
                    </b-dropdown-item>
                    <b-dropdown-item @click="setOrderMode(6)">
                        Bolt neve Z-A
                    </b-dropdown-item>
                </b-dropdown>
                <b-button
                    variant="primary"
                    @click="$router.push({ name: 'NewShopping' })"
                >
                    <b-icon-plus />
                    Új vásárlás
                </b-button>
            </div>
            <b-table
                id="table"
                class="table"
                :items="purchases?.items"
                :fields="getTableFields"
                small
                sort-icon-left
                responsive
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
                    <b-button
                        :id="row.item.id"
                        v-show="!row.detailsShowing"
                        variant="primary"
                        v-b-toggle="'collapse' + row.item.id"
                        @click="row.toggleDetails"
                    >
                        <b-icon-chevron-down />
                    </b-button>
                    <b-button
                        :id="row.item.id"
                        v-show="row.detailsShowing"
                        variant="primary"
                        v-b-toggle="'collapse' + row.item.id"
                        @click="row.toggleDetails"
                    >
                        <b-icon-chevron-up />
                    </b-button>
                    <b-button
                        @click="
                            $router.push({
                                name: 'NewShopping',
                                params: { id: row.item.id },
                            })
                        "
                        class="ml-1"
                        variant="primary"
                    >
                        <b-icon-pen />
                    </b-button>
                    <b-button
                        @click="deleteOnClick(row.item.id)"
                        class="ml-1"
                        variant="font-negative"
                    >
                        <b-icon-trash />
                    </b-button>
                </template>

                <template #row-details="row">
                    <h2>Bolt:</h2>
                    <shop-card :shop="row.item.shop" />
                    <h2>Termékek:</h2>
                    <div class="purchase-product-wrapper">
                        <purchase-product-card
                            v-for="purchaseProduct in row.item.purchaseProducts"
                            :key="purchaseProduct.id"
                            class="purchase-product"
                            :purchaseProduct="purchaseProduct"
                        />
                    </div>
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
                        @change="
                            fetchPageablePurchases({
                                page: $event,
                                orderMode: orderMode,
                            })
                        "
                        class="pagination m-0"
                    />
                </div>
                <b-button v-b-modal.export-modal variant="primary">
                    <b-icon-download />
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
                    <b-row align-v="end">
                        <b-col cols="8">
                            <label for="file-name">Fájl név:</label>
                            <b-form-input id="file-name" v-model="fileName" />
                        </b-col>
                        <b-col>
                            <b-form-select
                                v-model="selectedFileFormat"
                                :options="selectableFileFormats"
                            />
                        </b-col>
                    </b-row>

                    <b-form-row class="mt-3">
                        <b-col>
                            <b-button
                                @click="onExport"
                                class="w-100"
                                variant="primary"
                            >
                                <b-icon-download />
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
import PurchaseProductCard from '@/components/PurchaseProductCard.vue';
import ShopCard from '@/components/ShopCard.vue';
import Pageable from '@/model/Pageable';
import { Purchase } from '@/model/Purchase';
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';
import exportFromJSON from 'export-from-json';
import cloneDeep from 'lodash.clonedeep';

@Component({
    components: {
        ShopCard,
        PurchaseProductCard,
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

    orderMode = 1;

    fetchPageablePurchases!: (request: {
        page: number;
        orderMode: number;
    }) => Promise<void>;

    deletePurchaseById!: (id: number) => Promise<void>;

    setOrderMode(orderMode: number) {
        this.orderMode = orderMode;
        this.loading = true;
        if (this.purchases) {
            this.fetchPageablePurchases({
                page: this.purchases.currentPage,
                orderMode: this.orderMode,
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    deleteOnClick(id: number) {
        this.deletePurchaseById(id).then(() => {
            if (this.purchases) {
                this.fetchPageablePurchases({
                    page: this.purchases.currentPage,
                    orderMode: this.orderMode,
                });
            }
        });
    }

    onClose() {
        this.$bvModal.hide('export-modal');
    }

    onExport() {
        let exportData;
        if (this.purchases?.items) {
            exportData = cloneDeep(this.purchases?.items) as Array<any>;
            exportData.forEach((element) => {
                delete element.purchaseProducts;
                element.shop = element.shop.name;
                element.createdAt = element.createdAt.toISOString();
            });
        }
        exportFromJSON({
            data: exportData ?? [],
            fileName: this.fileName,
            exportType:
                this.selectedFileFormat === 'csv'
                    ? exportFromJSON.types.csv
                    : exportFromJSON.types.xls,
        });
        this.$bvModal.hide('export-modal');
    }

    get getTableFields(): Array<any> {
        return [
            {
                key: 'id',
                label: 'Id',
                sortable: true,
            },
            {
                key: 'createdAt',
                label: 'Időpont',
                sortable: true,
            },
            {
                key: 'price',
                label: 'Végösszeg',
                sortable: true,
            },
            {
                key: 'cashRegisterId',
                label: 'Pénztárgép azonosító',
                sortable: true,
            },
            {
                key: 'shop.name',
                label: 'Bolt',
                sortable: true,
            },
            {
                key: 'show_details',
                label: 'Részletek',
            },
        ];
    }

    mounted(): void {
        this.loading = true;
        this.fetchPageablePurchases({
            page: 1,
            orderMode: this.orderMode,
        }).finally(() => {
            this.loading = false;
        });
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    margin: auto;
    width: 80%;
    max-width: 1200px;
    .table-wrapper {
        margin: 30px 0;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;

        .header {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            border-bottom: 1px solid #d9d5ec;
        }

        .footer {
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .pagination-wrapper {
                margin-right: 15px;
                display: inline-block;
                .pagination {
                    width: fit-content;
                }
            }
        }

        .table {
            margin-bottom: 0;
            $tabble_padding: 20px;
            .purchase-product-wrapper {
                margin: auto;
                display: flex;
                flex-wrap: wrap;
                .purchase-product {
                    flex-shrink: 0;
                    margin: 10px;
                }
            }
            /deep/ th {
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
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
                font-size: 14px;
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
}
.close-icon {
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 500;
}
</style>
