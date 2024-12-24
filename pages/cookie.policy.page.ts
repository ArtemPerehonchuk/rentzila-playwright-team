import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class CookiePolicyPage extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly cookiePolicyTitle: Locator = this.page.locator('h1[class*="Cookies_title"]');
}

export default CookiePolicyPage;