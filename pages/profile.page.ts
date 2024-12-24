import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class ProfilePage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    profilePhoneInput: Locator = this.page.locator('input[data-testid="input_OwnerProfileNumber"]');
    profileLogoutBtn: Locator = this.page.locator('div[data-testid="logOut"]');


    async getProfilePhoneInputValue(): Promise<string> {
        return (await this.profilePhoneInput.inputValue()).split(' ').join('');
    }

    async clickOnLogoutBtn() {
        await this.profileLogoutBtn.click({force: true});
        await this.page.waitForLoadState('domcontentloaded');
    }
}

export default ProfilePage;