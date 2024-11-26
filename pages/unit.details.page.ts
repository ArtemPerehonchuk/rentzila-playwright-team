import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class UnitDetailsPage extends Page {
    constructor(page: PlaywrightPage) {
        super(page)
    }

    unitsPaymentMethod: Locator = this.page.locator('[class*="ImageWithDescription_paymentMethod"]');
    editUnitBtn: Locator = this.page.locator('[class*="CurrentUnitButtons_emptyBtn"]');

    async clickOnEditUnitBtn() {
        await this.editUnitBtn.click();
    }
}

export default UnitDetailsPage;