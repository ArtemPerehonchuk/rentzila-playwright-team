import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class OwnerTendersPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly createTenderBtn: Locator = this.page.locator('[data-testid="emptyBlockButton"]');
    readonly rejectedTab: Locator  = this.page.locator('button[id*="Відхилені"]');
    readonly rejectedTenders: Locator = this.page.locator('[data-testid="tenderLink"]');
    readonly editBtn: Locator = this.page.locator('[class*="CurrentTenderButtons_fillBtn"]');
    readonly waitingsTab: Locator = this.page.locator('button[id*="Очікуючі"]');
    readonly firstWaitingTenderName: Locator = this.page.locator('[class*="CurrentItemInfo_name"]').first();
}

export default OwnerTendersPage;