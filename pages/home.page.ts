import { Page as PlaywrightPage, expect, request, APIRequestContext } from '@playwright/test';
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

    servicesContainer = this.page.locator('[data-testid="services"]');
    servicesList = this.page.locator('div[class*="RentzilaProposes_categories_list"] > div[class*="RentzilaProposes_service"]');
    servicesUnitsList = this.page.locator('div[class*="RentzilaProposes_proposes_list"]').first().locator('div[class*="RentzilaProposes_proposes_item"]');;
    firstServucesUnit = this.page.locator('div[class*="RentzilaProposes_proposes_item"]').first();
    announcementsNavMenuItem = this.page.locator('[class*="Navbar_link"][href="/products/"]');
    specialEquipmentContainer = this.page.getByTestId('specialEquipment');
    specialEquipmentsList = this.page.locator('div[class*="RentzilaProposes_categories_list"]').nth(1).locator('div[class*="RentzilaProposes_service"]');
    specialEquipmentsUnitsList = this.page.locator('div[class*="RentzilaProposes_proposes_list"]').nth(1).locator('div[class*="RentzilaProposes_proposes_item"]');
    footerContainer = this.page.locator('div[class*="Footer_footer__Dhw_9"]');
    footerRentzilaLogo = this.page.locator('div[class*="Footer_container"] > div[data-testid="logo"]');
    aboutUsTitle = this.page.getByTestId('content');
    privacyPolicyLink = this.page.getByTestId('politika-konfidenciinosti');
    cookiePolicyLink = this.page.getByTestId('pravila-vikoristannya-failiv-cookie');
    termsConditionsLink = this.page.getByTestId('umovi-dostupu-ta-koristuvannya');
    announcementsLink = this.page.locator('div[role="listitem"] > a[href="/products/"]');
    tendersLink = this.page.locator('div[role="listitem"] > a[href="/tenders-map/"]');
    jobRequestsLink = this.page.locator('div[role="listitem"] > a[href="/requests-map/"]');
    contactsTitle = this.page.locator('div[class*="RentzilaContacts_title"]');
    contactsEmail = this.page.locator('a[class*="RentzilaContacts_email"]');
    copyrightLabel = this.page.getByTestId('copyright');
    searchServicesSpecialEquipmentTitle = this.page.locator('h1[class*="HeroSection_title"]');
    consultationForm = this.page.locator('div[class*="ConsultationForm_container"]');
    submitConsultationBtn = this.page.locator('button[type="submit"]');
    consultationFormErrorMessage = this.page.locator('p[class*="ConsultationForm_error_message"]');
    consultationFormNameInput = this.page.locator('input[name="name"]');
    consultationFormPhoneInput = this.page.locator('#mobile');
    enterBtn = this.page.locator('[class*="NavbarAuthBlock_buttonEnter"]');
    loginEmailOrPhoneInput = this.page.locator('#email');
    loginPasswordInput = this.page.locator('#password');
    loginErrorInputsMsg = this.page.locator('p[class*="CustomReactHookInput_error_message"]');
    autorizationForm = this.page.locator('[class*="LoginForm_form"]');
    submitLoginFormBtn = this.page.locator('[class*="LoginForm_form"] [class*="ItemButtons_darkBlueRoundBtn"]');
    hidePasswordIcon = this.page.locator('div[data-testid="reactHookButton"]');
    userIcon = this.page.locator('div[data-testid="avatarBlock"]');
    profileDropDown = this.page.locator('[class*="ProfileDropdownMenu_container"]');
    profileDropDownEmail = this.page.locator('div[data-testid="email"]');
    profileLogoutBtn = this.page.locator('div[data-testid="logout"]');
    myProfileMenuItem = this.page.locator('div[data-testid="profile"]');
    invalidEmailOrPasswordError = this.page.locator('div[data-testid="errorMessage"]');
    createUnitBtn = this.page.locator('a[class*="Navbar_addAnnouncement"]');
    closePopUpBtn = this.page.locator('[data-testid="crossButton"]');
    profileAnnouncementsDropDownMenuItem = this.page.locator('[data-testid="units"]');
    profileMyAnnouncementsItem = this.page.locator('[data-testid="units"] > ul > li:nth-child(1)');

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

    async clickOnAnnouncementsNavMenuItem() {
        await this.announcementsNavMenuItem.click({force: true});
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

    async getSearchServiceSpecialEquipmentTitleText() {
        return await this.searchServicesSpecialEquipmentTitle.innerText();
    }

    async clickOnTendersLink() {
        await this.tendersLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async clickOnContactsEmail() {
        await this.contactsEmail.click();
    }

    async getContactsEmail() {
        const emailAttr = await this.contactsEmail.getAttribute('href');
        return emailAttr
    }

    async scrollToConsultationForm() {
        await this.consultationForm.scrollIntoViewIfNeeded();
    }

    async clickOnSubmitConsultationBtn() {
        await this.submitConsultationBtn.click();
        await this.page.waitForTimeout(4000);
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

    async clickOnPhoneInput() {
        await this.consultationFormPhoneInput.click();
    }

    async getPhoneInputText() {
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

    async getUsersList() {
        if (this.apiHelper) {
            return await this.apiHelper.getUserDetails();
        }
    }

    async clickOnEnterBtn() {
        await this.enterBtn.click();
    }

    async clickOnSubmitLoginFormBtn() {
        await this.submitLoginFormBtn.click();
        await this.page.waitForTimeout(500)
    }

    async getLoginEmailOrPhoneInputValue() {
        return await this.loginEmailOrPhoneInput.inputValue();
    }

    async getPasswordInputValue() {
        return await this.loginPasswordInput.inputValue();
    }

    async clickOnHidePasswordIcon() {
        await this.hidePasswordIcon.click();
    }

    async getPasswordInputType() {
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

    async getProfileDropDownEmail() {
        return await this.profileDropDownEmail.innerText();
    }

    async logout() {
        await this.profileLogoutBtn.click();
    }

    async clickOnMyProfileMenuItem() {
        await this.myProfileMenuItem.click();
        await this.page.waitForTimeout(2000);
    }

    async getIncorrectPasswordErrorText() {
        if(await this.invalidEmailOrPasswordError.isVisible()) {
            return await this.invalidEmailOrPasswordError.innerText()
        }else if(await this.loginErrorInputsMsg.isVisible()) {
            return await this.loginErrorInputsMsg.innerText()
        }
    }

    async clickOnCreateUnitBtn() {
        await this.createUnitBtn.click();
    }

    async clickOnClosePopUpBtn() {
        await this.closePopUpBtn.click();
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
        await this.clickOnEnterBtn();
        await this.fillInput('email', email);
        await this.fillInput('password', password);
        await this.submitLoginFormBtn.click();
        await this.page.waitForLoadState('networkidle')
    }
}

export default HomePage;