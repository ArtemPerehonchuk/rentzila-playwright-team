import { test, expect } from "../fixtures";
import testData from '../data/test-data.json' assert {type: 'json'};

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const VALID_PHONE: string = process.env.VALID_PHONE || '';
const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';
const incorrectPhoneNumbers = Object.values(testData["incorrect-phone-numbers"]);
const incorrectEmails = Object.values(testData["incorrect-emails"]);
const incorrectPasswords = Object.values(testData["incorrect-passwords"]);
const pagesUrlPath = testData["pages URL path"];
const correctPhoneNumbers: string[] = [
        process.env.CORRECT_PHONE_NUMBERS_FULL || '',
        process.env.CORRECT_PHONE_NUMBERS_WITHOUT_PLUS || '',
        process.env.CORRECT_PHONE_NUMBERS_WITHOUT_PLUS38 || ''
    ];
const errorMessages = testData["error messages"];

test.describe('Negative test cases for login form', () => {
    test.beforeEach(async ({ page, homepage }) => {
        await homepage.navigate('/');
        await homepage.enterBtn.click();
    });

    test('test case C200: Authorization with empty fields', async( {homepage} ) => {

        await homepage.clickOnSubmitLoginFormBtn();
    
        await expect(homepage.autorizationForm).toBeVisible();
        await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["field must be filled"])).toBe(true);
        await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["field must be filled"])).toBe(true);
    
        await homepage.fillInput('email', VALID_EMAIL);
        await homepage.clickOnSubmitLoginFormBtn();

        await expect(homepage.autorizationForm).toBeVisible();
        await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["field must be filled"])).toBe(false);
        await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["field must be filled"])).toBe(true);
    
        await homepage.clearInput('email');

        await expect(homepage.autorizationForm).toBeVisible();
        await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["field must be filled"])).toBe(true);
        await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["field must be filled"])).toBe(true);
    
        await homepage.fillInput('password', VALID_PASSWORD);
        await homepage.clickOnSubmitLoginFormBtn();
    
        await expect(homepage.autorizationForm).toBeVisible();
        await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["field must be filled"])).toBe(true);
        await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["field must be filled"])).toBe(false);
    
        await homepage.clearInput('password');
        await homepage.fillInput('email', VALID_EMAIL);
        await homepage.clickOnSubmitLoginFormBtn();

        await expect(homepage.autorizationForm).toBeVisible();
        await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["field must be filled"])).toBe(false);
        await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["field must be filled"])).toBe(true);
    
        await homepage.clearInput('email');

        await expect(homepage.autorizationForm).toBeVisible();
        await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["field must be filled"])).toBe(true);
        await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["field must be filled"])).toBe(true);
    
        await homepage.fillInput('password', VALID_PASSWORD);
        await homepage.clickOnSubmitLoginFormBtn();

        await expect(homepage.autorizationForm).toBeVisible();
        await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["field must be filled"])).toBe(true);
        await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["field must be filled"])).toBe(false);
    });

    test('test case C207: Authorization with invalid phone', async( {homepage } ) => {

        await homepage.fillInput('password', VALID_PASSWORD);

        await expect(await homepage.getPasswordInputValue()).toBe(VALID_PASSWORD);
    
        for (const phoneNumber of incorrectPhoneNumbers) {
            await homepage.fillInput('email', phoneNumber);
            await homepage.clickOnSubmitLoginFormBtn();

            await expect(homepage.loginErrorInputsMsg).toHaveText(errorMessages["incorrect email or phone format"]);
        }
    });

    test('test case C576: Authorization with invalid email', async( {homepage } ) => {

        await homepage.fillInput('password', VALID_PASSWORD);

        await expect(await homepage.getPasswordInputValue()).toBe(VALID_PASSWORD);
    
        for (const email of incorrectEmails) {
            await homepage.fillInput('email', email);
            await homepage.clickOnSubmitLoginFormBtn();

            await expect(homepage.loginErrorInputsMsg).toHaveText(errorMessages["incorrect email or phone format"]);
        }
    });

    test('test case C577: Authorization with invalid password', async( { homepage } ) => {
        await homepage.fillInput('email', VALID_EMAIL);

        await expect(await homepage.getLoginEmailOrPhoneInputValue()).toBe(VALID_EMAIL);
    
        for (const password of incorrectPasswords) {
            await homepage.fillInput('password', password);
            await homepage.clickOnSubmitLoginFormBtn();

            await expect(await homepage.getIncorrectPasswordErrorText()).toMatch(/^(Пароль повинен містити|Невірний e-mail або пароль)/);
        }
    });
});

test.describe('Positive test cases for login form', () => {
    test.beforeEach(async ({ homepage }) => {
        await homepage.navigate('/');
        await homepage.enterBtn.click();
    });

    test('test case C201: Authorization with valid email and password', async( {homepage} ) => {
        await homepage.fillInput('email', VALID_EMAIL);

        await expect(await homepage.getLoginEmailOrPhoneInputValue()).toBe(VALID_EMAIL);

        await homepage.fillInput('password', VALID_PASSWORD);

        await expect(await homepage.getLoginEmailOrPhoneInputValue()).toBe(VALID_EMAIL);
    
        await homepage.hidePasswordIcon.click();

        await expect(await homepage.getPasswordInputType()).toBe('text');

        await homepage.hidePasswordIcon.click();

        await expect(await homepage.getPasswordInputType()).toBe('password');
    
        await homepage.clickOnSubmitLoginFormBtn();


        await expect(await homepage.checkUserIconIsDisplayed()).toBe(true);
        await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);
    
        await homepage.clickOnUserIcon();
        await expect(homepage.profileDropDown).toBeVisible();
        await expect(await homepage.getProfileDropDownEmail()).toBe(VALID_EMAIL);

        await homepage.logout();

        await expect(await homepage.checkUserIconIsDisplayed(false)).toBe(false);
    })
    
    test('test case C202: Authorization with valid phone and password', async( {homepage, profilePage} ) => {
        for(const phoneNumber of correctPhoneNumbers) {    
            await homepage.fillInput('email', phoneNumber);

            await expect(await homepage.checkInputErrorIsDisplayed('email', errorMessages["required field"])).toBe(false);

            await homepage.fillInput('password', VALID_PASSWORD);

            await expect(await homepage.checkInputErrorIsDisplayed('password', errorMessages["required field"])).toBe(false);
    
            await homepage.clickOnSubmitLoginFormBtn();

            await expect(await homepage.checkUserIconIsDisplayed()).toBe(true);
            await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);
    
            await homepage.clickOnUserIcon();
            await homepage.clickOnMyProfileMenuItem();

            await expect(await profilePage.getUrl()).toContain(pagesUrlPath["owner-cabinet"]);
            await expect(profilePage.profilePhoneInput).toBeVisible();
            await expect(await profilePage.getProfilePhoneInputValue()).toBe(VALID_PHONE);

            await profilePage.clickOnLogoutBtn();
            
            await expect(await homepage.getUrl()).toContain(HOMEPAGE_URL);
    
            await homepage.enterBtn.click();
        }
    })
})