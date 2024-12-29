import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from '../pages/page';

class OwnerUnitsUI extends Page {

    readonly activeTab: Locator;
    readonly pendingTab: Locator;
    readonly closedTab: Locator;
    readonly rejectedTab: Locator;
    readonly blockEmptyTitle: Locator;
    readonly blockEmptyMsg: Locator;
    readonly emptyBlockBtn: Locator;
    readonly paginationNumBtn: Locator;
    readonly paginationPrevBtn: Locator;
    readonly paginationNextBtn: Locator;
    readonly searchInput: Locator;
    readonly categorySelect: Locator;
    readonly sortingSelect: Locator;
    readonly selectFieldItem: Locator;

    constructor(page: PlaywrightPage) {
        super(page);

        this.activeTab = this.page.locator('button[id*="Активні"]');
        this.pendingTab = this.page.locator('button[id*="Очікуючі"]');
        this.closedTab = this.page.locator('button[id*="Завершені"]');
        this.rejectedTab = this.page.locator('button[id*="Відхилені"]');
        this.blockEmptyTitle = this.page.getByTestId('title');
        this.blockEmptyMsg = this.page.getByTestId('descr');
        this.emptyBlockBtn = this.page.getByTestId('emptyBlockButton');
        this.paginationNumBtn = this.page.locator('a[class*="Pagination_page_"]');
        this.paginationPrevBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="prev"]');
        this.paginationNextBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="next"]');
        this.searchInput = this.page.locator('div[data-testid="search"] input');
        this.categorySelect = this.page.getByTestId('div_CustomSelect').nth(0);
        this.sortingSelect = this.page.getByTestId('div_CustomSelect').nth(1);
        this.selectFieldItem = this.page.getByTestId('item-customSelect');
    }

    getSelectItemWithText(text: string) {
        return this.selectFieldItem.filter({ hasText: text });
    }

    getPaginationBtnWithIndex(index: number) {
        const number = index - 1;
        return this.paginationNumBtn.nth(number);
    }
}

export default OwnerUnitsUI