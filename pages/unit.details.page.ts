import { Page as PlaywrightPage } from '@playwright/test';
import Page from './page';

class UnitDetailsPage extends Page {
    constructor(page: PlaywrightPage) {
        super(page)
    }

    unitsPaymentMethod = this.page.locator('[class*="ImageWithDescription_paymentMethod"]');
    editUnitBtn = this.page.locator('[class*="CurrentUnitButtons_emptyBtn"]');

    async clickOnEditUnitBtn() {
        await this.editUnitBtn.click();
    }
}

export default UnitDetailsPage;