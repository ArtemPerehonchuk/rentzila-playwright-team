import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class TermsConditionsPage extends Page { 

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly termsConditionsTitle: Locator = this.page.locator('h1[class*="TermsConditions_title"]');

}

export default TermsConditionsPage;