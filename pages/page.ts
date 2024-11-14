import { Page as PlaywrightPage, Locator, expect } from '@playwright/test';

class Page {
    public page: PlaywrightPage;
    public logo: Locator;
   
    constructor(page: PlaywrightPage) {
      this.page = page;

      this.logo = this.page.locator('a[class="Navbar_logo__RsJHS"]');
    }

    async navigate(path = '') {
      await this.page.goto(path);
    }

    async getUrl() {
      await this.page.waitForLoadState('load')
      return await this.page.url()
    }

    async clickOnLogo() {
        await this.logo.click();
        await this.page.waitForTimeout(2000);
    }
  }

export default Page