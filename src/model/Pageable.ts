export default class Pageable<T> {
    public currentPage: number;

    public totalPages: number;

    public totalItems: number;

    public items: T[];

    constructor(pageable: Pageable<T>) {
        this.currentPage = pageable.currentPage;
        this.totalItems = pageable.totalItems;
        this.totalPages = pageable.totalPages;
        this.items = pageable.items;
    }
}
