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
    await this.page.waitForLoadState('load');
    return this.page.url();
  }

  async clickOnLogo() {
    await this.logo.click();
    await this.page.waitForTimeout(2000);
  }

  async enterValueToInput(locator: Locator, text: string, caseOption: 'paste' | 'default' = 'default') {
    if (caseOption == 'paste') {
      await this.page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
      }, text);

      await locator.clear();
      await locator.click();
      await this.page.keyboard.press(process.platform === 'darwin' ? 'Meta+V' : 'Control+V');
      return
    }

    await locator.fill(text);
  }
}

export default Page