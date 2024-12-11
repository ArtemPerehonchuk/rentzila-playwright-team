import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from '../pages/page';

class OwnerUnitsUI extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    activeTab = this.page.locator('button[id*="Активні"]');
    pendingTab = this.page.locator('button[id*="Очікуючі"]');
    closedTab = this.page.locator('button[id*="Завершені"]');
    rejectedTab = this.page.locator('button[id*="Відхилені"]');
    blockEmptyTitle = this.page.getByTestId('title');
    blockEmptyMsg = this.page.getByTestId('descr');
    emptyBlockBtn = this.page.getByTestId('emptyBlockButton');
    paginationNumBtn = this.page.locator('a[class*="Pagination_page_"]');
    paginationPrevBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="prev"]');
    paginationNextBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="next"]');
    searchInput = this.page.locator('div[data-testid="search"] input');
    categorySelect = this.page.getByTestId('div_CustomSelect').nth(0);
    sortingSelect = this.page.getByTestId('div_CustomSelect').nth(1);
    selectFieldItem = this.page.getByTestId('item-customSelect');

    getSelectItemWithText(text: string) {
        return this.selectFieldItem.filter({ hasText: text });
    }

    getPaginationBtnWithIndex(index: number) {
        const number = index - 1;
        return this.paginationNumBtn.nth(number);
    }
}

export default OwnerUnitsUI