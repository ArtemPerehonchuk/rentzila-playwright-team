import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class OwnerTendersPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    createTenderBtn: Locator = this.page.locator('[data-testid="emptyBlockButton"]');
}

export default OwnerTendersPage;