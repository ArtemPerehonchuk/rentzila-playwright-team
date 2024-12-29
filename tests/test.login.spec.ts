import { test, expect } from "../fixtures";
import testData from '../data/test.data.json' assert {type: 'json'};

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const VALID_PHONE: string = process.env.VALID_PHONE || '';
const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';
const incorrectPhoneNumbers = Object.values(testData.incorrectPhoneNumbers);
const incorrectEmails = Object.values(testData.incorrectEmails);
const incorrectPasswords = Object.values(testData.incorrectPasswords);
const correctPhoneNumbers: string[] = [
        process.env.CORRECT_PHONE_NUMBERS_FULL || '',
        process.env.CORRECT_PHONE_NUMBERS_WITHOUT_PLUS || '',
        process.env.CORRECT_PHONE_NUMBERS_WITHOUT_PLUS38 || ''
    ];

test.describe('Negative test cases for login form', () => {
    test.beforeEach(async ({ page, homePage }) => {
        await homePage.navigate('/');
        await homePage.enterBtn.click();
    });

    test('test case C200: Authorization with empty fields', async( {homePage} ) => {

        await homePage.clickOnSubmitLoginFormBtn();
    
        await expect(homePage.autorizationForm).toBeVisible();
        await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.fieldMustBeFilled)).toBe(true);
        await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    
        await homePage.fillInput('email', VALID_EMAIL);
        await homePage.clickOnSubmitLoginFormBtn();

        await expect(homePage.autorizationForm).toBeVisible();
        await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.fieldMustBeFilled)).toBe(false);
        await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    
        await homePage.clearInput('email');

        await expect(homePage.autorizationForm).toBeVisible();
        await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.fieldMustBeFilled)).toBe(true);
        await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    
        await homePage.fillInput('password', VALID_PASSWORD);
        await homePage.clickOnSubmitLoginFormBtn();
    
        await expect(homePage.autorizationForm).toBeVisible();
        await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.fieldMustBeFilled)).toBe(true);
        await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.fieldMustBeFilled)).toBe(false);
    
        await homePage.clearInput('password');
        await homePage.fillInput('email', VALID_EMAIL);
        await homePage.clickOnSubmitLoginFormBtn();

        await expect(homePage.autorizationForm).toBeVisible();
        await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.fieldMustBeFilled)).toBe(false);
        await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    
        await homePage.clearInput('email');

        await expect(homePage.autorizationForm).toBeVisible();
        await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.fieldMustBeFilled)).toBe(true);
        await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    
        await homePage.fillInput('password', VALID_PASSWORD);
        await homePage.clickOnSubmitLoginFormBtn();

        await expect(homePage.autorizationForm).toBeVisible();
        await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.fieldMustBeFilled)).toBe(true);
        await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.fieldMustBeFilled)).toBe(false);
    });

    test('test case C207: Authorization with invalid phone', async( {homePage } ) => {

        await homePage.fillInput('password', VALID_PASSWORD);

        await expect(await homePage.getPasswordInputValue()).toBe(VALID_PASSWORD);
    
        for (const phoneNumber of incorrectPhoneNumbers) {
            await homePage.fillInput('email', phoneNumber);
            await homePage.clickOnSubmitLoginFormBtn();

            await expect(homePage.loginErrorInputsMsg).toHaveText(testData.errorMessages.incorrectEmailOrPhoneFormat);
        }
    });

    test('test case C576: Authorization with invalid email', async( {homePage } ) => {

        await homePage.fillInput('password', VALID_PASSWORD);

        await expect(await homePage.getPasswordInputValue()).toBe(VALID_PASSWORD);
    
        for (const email of incorrectEmails) {
            await homePage.fillInput('email', email);
            await homePage.clickOnSubmitLoginFormBtn();

            await expect(homePage.loginErrorInputsMsg).toHaveText(testData.errorMessages.incorrectEmailOrPhoneFormat);
        }
    });

    test('test case C577: Authorization with invalid password', async( { homePage } ) => {
        await homePage.fillInput('email', VALID_EMAIL);

        await expect(await homePage.getLoginEmailOrPhoneInputValue()).toBe(VALID_EMAIL);
    
        for (const password of incorrectPasswords) {
            await homePage.fillInput('password', password);
            await homePage.clickOnSubmitLoginFormBtn();

            if(await homePage.invalidEmailOrPasswordError.isVisible()) {
                await expect(homePage.invalidEmailOrPasswordError).toContainText(testData.errorMessages.invalidEmailOrPassword);
            }
            else if(await homePage.loginErrorInputsMsg.isVisible()) {
                await expect(homePage.loginErrorInputsMsg).toContainText(testData.errorMessages.incorrectPasswordFormat);
            }else return
        }
    });
});

test.describe('Positive test cases for login form', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.navigate('/');
        await homePage.enterBtn.click();
    });

    test('test case C201: Authorization with valid email and password', async( {homePage} ) => {
        await homePage.fillInput('email', VALID_EMAIL);

        await expect(await homePage.getLoginEmailOrPhoneInputValue()).toBe(VALID_EMAIL);

        await homePage.fillInput('password', VALID_PASSWORD);

        await expect(await homePage.getLoginEmailOrPhoneInputValue()).toBe(VALID_EMAIL);
    
        await homePage.hidePasswordIcon.click();

        await expect(await homePage.getPasswordInputType()).toBe('text');

        await homePage.hidePasswordIcon.click();

        await expect(await homePage.getPasswordInputType()).toBe('password');
    
        await homePage.clickOnSubmitLoginFormBtn();


        await expect(await homePage.checkUserIconIsDisplayed()).toBe(true);
        await expect(await homePage.getUrl()).toBe(HOMEPAGE_URL);
    
        await homePage.clickOnUserIcon();
        await expect(homePage.profileDropDown).toBeVisible();
        await expect(await homePage.getProfileDropDownEmail()).toBe(VALID_EMAIL);

        await homePage.logout();

        await expect(await homePage.checkUserIconIsDisplayed(false)).toBe(false);
    })
    
    test('test case C202: Authorization with valid phone and password', async( {homePage, profilePage} ) => {
        for(const phoneNumber of correctPhoneNumbers) {    
            await homePage.fillInput('email', phoneNumber);

            await expect(await homePage.checkInputErrorIsDisplayed('email', testData.errorMessages.requiredField)).toBe(false);

            await homePage.fillInput('password', VALID_PASSWORD);

            await expect(await homePage.checkInputErrorIsDisplayed('password', testData.errorMessages.requiredField)).toBe(false);
    
            await homePage.clickOnSubmitLoginFormBtn();

            await expect(await homePage.checkUserIconIsDisplayed()).toBe(true);
            await expect(await homePage.getUrl()).toBe(HOMEPAGE_URL);
    
            await homePage.clickOnUserIcon();
            await homePage.clickOnMyProfileMenuItem();

            await expect(await profilePage.getUrl()).toContain(testData.pagesURLPath.ownerCabinet);
            await expect(profilePage.profilePhoneInput).toBeVisible();
            await expect(await profilePage.getProfilePhoneInputValue()).toBe(VALID_PHONE);

            await profilePage.clickOnLogoutBtn();
            
            await expect(await homePage.getUrl()).toContain(HOMEPAGE_URL);
    
            await homePage.enterBtn.click();
        }
    })
})