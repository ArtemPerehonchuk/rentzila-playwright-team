import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class UnitPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    unitServicesTitle = this.page.locator('[class*="UnitCharacteristics_services"] [class*="UnitCharacteristics_title"]');
    unitServicesTypesContainer = this.page.locator('[itemprop="services"]');
    secondCategoryBreadCrumb = this.page.locator("span[data-testid='secondCategorySpan']");

    async checkUnitIsVisible() {
        await expect(this.unitServicesTitle).toBeVisible()
        await expect(this.unitServicesTypesContainer).toBeVisible()
    }
}

export default UnitPage;