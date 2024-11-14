import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class ProductsPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }
    
    produtsList = this.page.locator('[data-testid="cardWrapper"]');
    productFilterItem = this.page.locator('div[class*="ResetFilters_selectedCategory"]');
    dropdownArrow = this.page.locator('[data-testid="rightArrow"]').nth(2);
    unitsContainer = this.page.locator('div[class*="MapPagination_units_container"]');
    constructionsCheckBox = this.page.locator('[data-testid="categoryCheckbox"]').nth(1);
    othersCheckBox = this.page.locator('[data-testid="categoryCheckbox"]').nth(2);
    searchInput = this.page.getByTestId('searchInput');

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
            await this.page.waitForTimeout(3000)
        }else {}
    }

    async filtersAreChecked(unitName: string) {
        const dropdownCheckBox = this.page.locator('label', { hasText: unitName });
        if (!await dropdownCheckBox.isVisible()) {
            await this.dropdownArrow.click();
            await this.page.waitForLoadState('domcontentloaded');
        }
        await expect(dropdownCheckBox).toBeChecked();
        return true
    }

    async clickOnDropdownArrow() {
        await this.dropdownArrow.click();
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