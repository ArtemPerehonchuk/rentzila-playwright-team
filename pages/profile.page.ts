import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class ProfilePage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    profilePhoneInput = this.page.locator('input[data-testid="input_OwnerProfileNumber"]');
    profileLogoutBtn = this.page.locator('div[data-testid="logOut"]');
    unitsDropdown = this.page.getByTestId('leftsideCategory').filter({hasText: "Оголошення"});
    favoriteUnitsTab = this.page.getByTestId('variant').filter({hasText: "Обрані оголошення"});

    async getProfilePhoneInputValue() {
        return (await this.profilePhoneInput.inputValue()).split(' ').join('');
    }

    async clickOnLogoutBtn() {
        await this.profileLogoutBtn.click({force: true});
        await this.page.waitForLoadState('domcontentloaded');
    }
}

export default ProfilePage;