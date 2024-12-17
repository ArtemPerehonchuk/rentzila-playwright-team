import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class OwnerTendersPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    createTenderBtn: Locator = this.page.locator('[data-testid="emptyBlockButton"]');
    rejectedTab: Locator  = this.page.locator('button[id*="Відхилені"]');
    rejectedTenders: Locator = this.page.locator('[data-testid="tenderLink"]');
    editBtn: Locator = this.page.locator('[class*="CurrentTenderButtons_fillBtn"]')
}

export default OwnerTendersPage;