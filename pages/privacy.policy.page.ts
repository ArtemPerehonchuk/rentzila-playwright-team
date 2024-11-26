import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class PrivacyPolicyPage extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
    }

    privacyPolicyTitle: Locator = this.page.locator('h1[class*="PrivacyPolicy_title"]');

}

export default PrivacyPolicyPage;