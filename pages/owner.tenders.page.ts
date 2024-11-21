import { Page as PlaywrightPage } from '@playwright/test';
import Page from './page';

class OwnerTendersPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    createTenderBtn = this.page.locator('[data-testid="emptyBlockButton"]');

    async clickOnCreateTenderBtn() {
        await this.createTenderBtn.click();
    }
    
}

export default OwnerTendersPage;