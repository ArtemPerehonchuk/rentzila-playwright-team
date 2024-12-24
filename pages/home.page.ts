import { Page as PlaywrightPage, expect, request, APIRequestContext, Locator } from '@playwright/test';
import Page from './page';
import ApiHelper from '../helpers/api.helper';


class HomePage extends Page {
    private apiHelper?: ApiHelper;

    constructor(page: PlaywrightPage, request?: APIRequestContext) {
        super(page);
        if(request) {
            this.apiHelper = new ApiHelper(request);
        }
    }

    readonly servicesContainer: Locator = this.page.locator('[data-testid="services"]');
    readonly servicesList: Locator = this.page.locator('div[class*="RentzilaProposes_categories_list"] > div[class*="RentzilaProposes_service"]');
    readonly servicesUnitsList: Locator = this.page.locator('div[class*="RentzilaProposes_proposes_list"]').first().locator('div[class*="RentzilaProposes_proposes_item"]');;
    readonly firstServucesUnit: Locator = this.page.locator('div[class*="RentzilaProposes_proposes_item"]').first();
    readonly announcementsNavMenuItem: Locator = this.page.locator('[class*="Navbar_link"][href="/products/"]');
    readonly specialEquipmentContainer: Locator = this.page.getByTestId('specialEquipment');
    readonly specialEquipmentsList: Locator = this.page.locator('div[class*="RentzilaProposes_categories_list"]').nth(1).locator('div[class*="RentzilaProposes_service"]');
    readonly specialEquipmentsUnitsList: Locator = this.page.locator('div[class*="RentzilaProposes_proposes_list"]').nth(1).locator('div[class*="RentzilaProposes_proposes_item"]');
    readonly footerContainer: Locator = this.page.locator('div[class*="Footer_footer__Dhw_9"]');
    readonly footerRentzilaLogo: Locator = this.page.locator('div[class*="Footer_container"] > div[data-testid="logo"]');
    readonly aboutUsTitle: Locator = this.page.getByTestId('content');
    readonly privacyPolicyLink: Locator = this.page.getByTestId('politika-konfidenciinosti');
    readonly cookiePolicyLink: Locator = this.page.getByTestId('pravila-vikoristannya-failiv-cookie');
    readonly termsConditionsLink: Locator = this.page.getByTestId('umovi-dostupu-ta-koristuvannya');
    readonly announcementsLink: Locator = this.page.locator('div[role="listitem"] > a[href="/products/"]');
    readonly tendersLink: Locator = this.page.locator('div[role="listitem"] > a[href="/tenders-map/"]');
    readonly jobRequestsLink: Locator = this.page.locator('div[role="listitem"] > a[href="/requests-map/"]');
    readonly contactsTitle: Locator = this.page.locator('div[class*="RentzilaContacts_title"]');
    readonly contactsEmail: Locator = this.page.locator('a[class*="RentzilaContacts_email"]');
    readonly copyrightLabel: Locator = this.page.getByTestId('copyright');
    readonly searchServicesSpecialEquipmentTitle: Locator = this.page.locator('h1[class*="HeroSection_title"]');
    readonly consultationForm: Locator = this.page.locator('div[class*="ConsultationForm_container"]');
    readonly submitConsultationBtn: Locator = this.page.locator('button[type="submit"]');
    readonly consultationFormErrorMessage: Locator = this.page.locator('p[class*="ConsultationForm_error_message"]');
    readonly consultationFormNameInput: Locator = this.page.locator('input[name="name"]');
    readonly consultationFormPhoneInput: Locator = this.page.locator('#mobile');
    readonly enterBtn: Locator = this.page.locator('[class*="NavbarAuthBlock_buttonEnter"]');
    readonly loginEmailOrPhoneInput: Locator = this.page.locator('#email');
    readonly loginPasswordInput: Locator = this.page.locator('#password');
    readonly loginErrorInputsMsg: Locator = this.page.locator('p[class*="CustomReactHookInput_error_message"]');
    readonly autorizationForm: Locator = this.page.locator('[class*="LoginForm_form"]');
    readonly submitLoginFormBtn: Locator = this.page.locator('[class*="LoginForm_form"] [class*="ItemButtons_darkBlueRoundBtn"]');
    readonly hidePasswordIcon: Locator = this.page.locator('div[data-testid="reactHookButton"]');
    readonly userIcon: Locator = this.page.locator('div[data-testid="avatarBlock"]');
    readonly profileDropDown: Locator = this.page.locator('[class*="ProfileDropdownMenu_container"]');
    readonly profileDropDownEmail: Locator = this.page.locator('div[data-testid="email"]');
    readonly profileLogoutBtn: Locator = this.page.locator('div[data-testid="logout"]');
    readonly myProfileMenuItem: Locator = this.page.locator('div[data-testid="profile"]');
    readonly invalidEmailOrPasswordError: Locator = this.page.locator('div[data-testid="errorMessage"]');
    readonly createUnitBtn: Locator = this.page.locator('a[class*="Navbar_addAnnouncement"]');
    readonly closePopUpBtn: Locator = this.page.locator('[data-testid="crossButton"]');
    readonly profileAnnouncementsDropDownMenuItem: Locator = this.page.locator('[data-testid="units"]');
    readonly profileMyAnnouncementsItem: Locator = this.page.locator('[data-testid="units"] > ul > li:nth-child(1)');
    readonly profileTendersItem: Locator = this.page.locator('[data-testid="tenders"]');

    async scrollToServicesContainer() {
        await this.servicesContainer.scrollIntoViewIfNeeded();
    }

    async scrollToSpecialEquipmentContainer() {
        await this.specialEquipmentContainer.scrollIntoViewIfNeeded();
    }

    async clickFirstServicesUnit() {
        await this.servicesUnitsList.first().click({force: true});
        await this.page.waitForTimeout(3000)
    }

    async clickFirstSpecialEquipmentUnit() {
        await this.specialEquipmentsUnitsList.first().click()
    }

    async getFirstServicesUnitName(): Promise<string> {
        return await this.servicesUnitsList.first().innerText();
    }

    async getFirstSpecialEquipmentsUnitName(): Promise<string> {
        return await this.specialEquipmentsUnitsList.first().innerText();
    }

    async scrollToFooter() {
        await this.footerContainer.scrollIntoViewIfNeeded();
    }

    async clickOnPrivacyPolicyLink() {
        const navigationPromise = new Promise<void>(resolve => {
            this.page.on('framenavigated', frame => {
                if (frame === this.page.mainFrame()) { 
                    resolve();
                }
            });
        });
    
        await this.privacyPolicyLink.click(); 
        await navigationPromise;              
    }

    async clickOnCookiePolicyLink() {
        const navigationPromise = new Promise<void>(resolve => {
            this.page.on('framenavigated', frame => {
                if (frame === this.page.mainFrame()) { 
                    resolve();
                }
            });
        });
    
        await this.cookiePolicyLink.click(); 
        await navigationPromise; 
    }

    async clickOnTermsConditionsLink() {
        const navigationPromise = new Promise<void>(resolve => {
            this.page.on('framenavigated', frame => {
                if (frame === this.page.mainFrame()) { 
                    resolve();
                }
            });
        });

        await this.termsConditionsLink.click();
        await navigationPromise;
    }

    async clickOnAnnouncementsLink() {
        const navigationPromise = new Promise<void>(resolve => {
            this.page.on('framenavigated', frame => {
                if (frame === this.page.mainFrame()) { 
                    resolve();
                }
            });
        });
    
        await this.announcementsLink.click(); 
        await navigationPromise; 
    }

    async getSearchServiceSpecialEquipmentTitleText(): Promise<string> {
        return await this.searchServicesSpecialEquipmentTitle.innerText();
    }

    async clickOnTendersLink() {
        await this.tendersLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getContactsEmail(): Promise<string | null> {
        const emailAttr = await this.contactsEmail.getAttribute('href');
        return emailAttr
    }

    async scrollToConsultationForm() {
        await this.consultationForm.scrollIntoViewIfNeeded();
    }

    async clickOnSubmitConsultationBtn() {
        await this.submitConsultationBtn.click();
        await this.page.waitForTimeout(5000);
    }

    async checkInputErrorIsDisplayed(inputName: string, errorText: string) {
        const inputValues = {
            name: await this.consultationFormNameInput.evaluate((el) => (el as HTMLInputElement).value),
            phone: await this.consultationFormPhoneInput.evaluate((el) => (el as HTMLInputElement).value),
            email: '',
            password: ''
        };

        if (await this.loginEmailOrPhoneInput.isVisible()) {
            inputValues.email = await this.loginEmailOrPhoneInput.evaluate((el) => (el as HTMLInputElement).value);
        }

        if (await this.loginPasswordInput.isVisible()) {
            inputValues.password = await this.loginPasswordInput.evaluate((el) => (el as HTMLInputElement).value);
        }
    
        const showError = async (inputLocator: any, errorLocator: any, errorIndex: number) => {
            const borderColor = await inputLocator.evaluate((el: any) => window.getComputedStyle(el).borderColor);
            await expect(borderColor).toBe('rgb(247, 56, 89)');
            await expect(errorLocator.nth(errorIndex)).toBeVisible();
            const errorMessageText = await errorLocator.nth(errorIndex).innerText();
            await expect(errorMessageText).toBe(errorText);
            return true;
        };
    
        if (inputName === 'name' && inputValues.name === '') {
            return await showError(this.consultationFormNameInput, this.consultationFormErrorMessage, 0);
        }
    
        if (inputName === 'phone' && inputValues.phone === '') {
            const errorIndex = inputValues.name === '' ? 1 : 0;
            return await showError(this.consultationFormPhoneInput, this.consultationFormErrorMessage, errorIndex);
        }

        if (inputName === 'email' && inputValues.email === '') {
            return await showError(this.loginEmailOrPhoneInput, this.loginErrorInputsMsg, 0);
        }
        if (inputName === 'password' && inputValues.password === '') {
            const errorIndex = inputValues.email === '' ? 1 : 0;
            return await showError(this.loginPasswordInput, this.loginErrorInputsMsg, errorIndex);
        }
    
        return false;
    }

    async fillInput(inputName: string, inputValue: string) {
        if (inputValue !== '') {
            switch (inputName) {
                case 'name':
                    await this.consultationFormNameInput.fill(inputValue);
                    break;
                case 'phone':
                    await this.consultationFormPhoneInput.fill(inputValue);
                    break;
                case 'email':
                    await this.loginEmailOrPhoneInput.fill(inputValue);
                    break;
                case 'password':
                    await this.loginPasswordInput.fill(inputValue);
                    break;
                default:
                    throw new Error(`Unknown input name: ${inputName}`);
            }
        }
    }

    async getPhoneInputText(): Promise<string> {
        return await this.consultationFormPhoneInput.inputValue();
    }

    async clearInput(inputName: string) {
        switch(inputName) {
            case 'name':
                await this.consultationFormNameInput.clear();
                break;
            case 'phone':
                await this.consultationFormPhoneInput.clear();
                break;
            case 'email':
                await this.loginEmailOrPhoneInput.clear();
                break;
            case 'password':
                await this.loginPasswordInput.clear();
                break;
            default:
                throw new Error(`Unknown input name: ${inputName}`);
        }
    }

    async checkSuccessSubmitConsultationMsg() {
        await this.page.on('dialog', async (dialog) => {
            expect(dialog.type()).toBe('alert');
            await dialog.accept();
        });
    }

    async clickOnSubmitLoginFormBtn() {
        await this.submitLoginFormBtn.click();
        await this.page.waitForTimeout(1000)
    }

    async getLoginEmailOrPhoneInputValue(): Promise<string> {
        return await this.loginEmailOrPhoneInput.inputValue();
    }

    async getPasswordInputValue(): Promise<string> {
        return await this.loginPasswordInput.inputValue();
    }

    async getPasswordInputType(): Promise<string | null> {
        return await this.loginPasswordInput.getAttribute('type')
    }

    async checkUserIconIsDisplayed(shouldBeVisible: boolean = true) {
        if(shouldBeVisible) {
            await expect(this.userIcon).toBeVisible();
            return true
        }else return false
    }

    async clickOnUserIcon() {
        await this.userIcon.click();
        await this.page.waitForLoadState('load');
    }

    async getProfileDropDownEmail(): Promise<string> {
        return await this.profileDropDownEmail.innerText();
    }

    async logout() {
        await this.profileLogoutBtn.click();
    }

    async clickOnMyProfileMenuItem() {
        await this.myProfileMenuItem.click();
        await this.page.waitForTimeout(2000);
    }

    async getIncorrectPasswordErrorText(): Promise<string | undefined> {
        if(await this.invalidEmailOrPasswordError.isVisible()) {
            return await this.invalidEmailOrPasswordError.innerText()
        }else if(await this.loginErrorInputsMsg.isVisible()) {
            return await this.loginErrorInputsMsg.innerText()
        }
    }

    async clickOnProfileMyAnnouncementsItem() {
        await this.profileAnnouncementsDropDownMenuItem.click({ force: true });
    
        try {
            const dialog = await this.page.waitForEvent('dialog', { timeout: 3000 });
            await dialog.accept();
        } catch (e) {
        }
    
        await this.page.waitForLoadState('networkidle');
    }

    async logoutUser() {
        await this.clickOnUserIcon();
        await this.logout();
        await this.page.waitForTimeout(2000);
    }

    async loginUser(email: string, password: string) {
        await this.enterBtn.click();
        await this.fillInput('email', email);
        await this.fillInput('password', password);
        await this.submitLoginFormBtn.click();
        await this.page.waitForLoadState('domcontentloaded')
    }

    async clickOnProfileTendersItem() {
        await this.profileTendersItem.click();
        await this.page.waitForLoadState('networkidle');
    }
}

export default HomePage;