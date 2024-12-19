import { Page as PlaywrightPage, expect, Locator } from '@playwright/test';
import Page from './page';

class ProductsPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }
    
    produtsList: Locator = this.page.locator('[data-testid="cardWrapper"]');
    unitTitle = this.page.getByTestId('unitName');
    unitCategory = this.page.locator('div[class*="OwnerUnitCard_category_"]');
    favoriteBtn = this.page.getByTestId('favourite');
    favoriteIndicator = this.page.locator('[data-testid="favourite"] g>path');
    productFilterItem: Locator = this.page.locator('div[class*="ResetFilters_selectedCategory"]');
    dropdownArrow: Locator = this.page.locator('[data-testid="rightArrow"]').nth(2);
    unitsContainer: Locator = this.page.locator('div[class*="MapPagination_units_container"]');
    constructionsCheckBox: Locator = this.page.locator('[data-testid="categoryCheckbox"]').nth(1);
    othersCheckBox: Locator = this.page.locator('[data-testid="categoryCheckbox"]').nth(2);
    searchInput: Locator = this.page.getByTestId('searchInput');

    getUnitCardByIndex (index: number) {
        return this.produtsList.nth(index);
    }

    async getTitleFromUnitCard (index: number) {
        return this.getUnitCardByIndex(index).locator(this.unitTitle).innerText();
    }

    getFavoriteBtnOnUnit (index: number) {
        return this.getUnitCardByIndex(index).locator(this.favoriteBtn);
    }

    getFavoriteStatusOnUnit(index: number) {
        return this.getUnitCardByIndex(index).locator(this.favoriteIndicator);
    }

    async clickFirstProduct() {
        if(await this.produtsList.first().isVisible()) {
            const navigationPromise = new Promise<void>(resolve => {
                this.page.on('framenavigated', frame => {
                    if (frame === this.page.mainFrame()) { 
                        resolve();
                    }
                });
            });
        
            await this.produtsList.first().click({force: true});
            await navigationPromise;
            await this.page.waitForLoadState('networkidle')
        }else {}
    }

    async checkCategoriesCheckboxesAreChecked() {
        if(await this.productFilterItem.isVisible()) {
            await expect(this.constructionsCheckBox).toBeChecked();
            await expect(this.othersCheckBox).toBeChecked();
            return true
        }else return false
    }

    async getSearchInputBgText() {
        const searchInputText = await this.searchInput.getAttribute('placeholder');
        return searchInputText;
    }
}

export default ProductsPage;