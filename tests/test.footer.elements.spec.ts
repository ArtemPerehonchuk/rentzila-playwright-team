import { test, expect } from "../fixtures";
import { faker } from '@faker-js/faker';
import testData from '../data/test.data.json' assert {type: 'json'}

const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';
const contactUsFormInputValues = testData.contuctUsFormInputs;

test.beforeEach(async ({ page, homePage }) => {
    await homePage.navigate('/');
});

test('test case C214: Verify that all elements on the footer are displayed and all links are clickable', async ({homePage, privacyPolicyPage, cookiePolicyPage, termsConditionsPage, productsPage, tendersPage }) => {
    await homePage.footerContainer.scrollIntoViewIfNeeded();

    await expect(homePage.footerContainer).toBeVisible();

    await homePage.contactsEmail.click();

    await expect(await homePage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(homePage.aboutUsTitle).toBeVisible();
    await expect(homePage.privacyPolicyLink).toBeVisible();
    await expect(homePage.cookiePolicyLink).toBeVisible();
    await expect(homePage.termsConditionsLink).toBeVisible();
    await expect(homePage.announcementsLink).toBeVisible();
    await expect(homePage.tendersLink).toBeVisible();
    await expect(homePage.jobRequestsLink).toBeVisible();
    await expect(homePage.contactsTitle).toBeVisible();
    await expect(homePage.contactsEmail).toBeVisible();
    await expect(homePage.footerRentzilaLogo).toBeVisible();
    await expect(homePage.copyrightLabel).toBeVisible();

    await homePage.clickOnPrivacyPolicyLink();

    await expect(await privacyPolicyPage.getUrl()).toContain(testData.pagesURLPath["privacy-policy"]);
    await expect(privacyPolicyPage.privacyPolicyTitle).toBeVisible();
    await expect(privacyPolicyPage.privacyPolicyTitle).toHaveText(testData.titleTexts.privacyPolicy);

    await homePage.clickOnCookiePolicyLink();

    await expect(await cookiePolicyPage.getUrl()).toContain(testData.pagesURLPath["cookey-policy"]);
    await expect(cookiePolicyPage.cookiePolicyTitle).toBeVisible()
    await expect(cookiePolicyPage.cookiePolicyTitle).toHaveText(testData.titleTexts.cookiePolicy);

    await homePage.clickOnTermsConditionsLink();

    await expect(await termsConditionsPage.getUrl()).toContain(testData.pagesURLPath["terms-conditions"]);
    await expect(termsConditionsPage.termsConditionsTitle).toBeVisible()
    await expect(termsConditionsPage.termsConditionsTitle).toHaveText(testData.titleTexts.termsConditions);

    await homePage.clickOnAnnouncementsLink();

    await expect(await productsPage.getUrl()).toContain(testData.pagesURLPath.products);
    await expect(productsPage.searchInput).toBeVisible();
    await expect(await productsPage.getSearchInputBgText()).toBe(testData.inputPlaceholderTexts.searchAnnouncementInput);

    await productsPage.clickOnLogo();

    await expect(await homePage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(await homePage.getSearchServiceSpecialEquipmentTitleText()).toContain(testData.titleTexts.specialEquipment);

    await homePage.clickOnTendersLink();

    await expect(await tendersPage.getUrl()).toContain(testData.pagesURLPath["tenders-map"]);
    await expect(tendersPage.searchInput).toBeVisible();
    await expect(await tendersPage.getSerchInputBgText()).toBe(testData.inputPlaceholderTexts.searchTenderInput);

    await tendersPage.clickOnLogo();

    await expect(await homePage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(await homePage.getContactsEmail()).toContain('info@rentzila.com.ua');
});

test('test case C226: Verify "У Вас залишилися питання?" form', async ({ homePage, apiHelper }) => {
    const userName = faker.person.firstName();
    const userPhone = contactUsFormInputValues["other correct phone"];
    
    await homePage.scrollToConsultationForm();

    await expect(homePage.consultationForm).toBeVisible();

    await homePage.clickOnSubmitConsultationBtn();

    await expect(await homePage.checkInputErrorIsDisplayed('name', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    await expect(await homePage.checkInputErrorIsDisplayed('phone', testData.errorMessages.fieldMustBeFilled)).toBe(true);

    await homePage.fillInput('name', 'test');
    await homePage.clickOnSubmitConsultationBtn();

    await expect(await homePage.checkInputErrorIsDisplayed('name', testData.errorMessages.fieldMustBeFilled)).toBe(false);
    await expect(await homePage.checkInputErrorIsDisplayed('phone', testData.errorMessages.fieldMustBeFilled)).toBe(true);

    await homePage.consultationFormPhoneInput.click();

    await expect(await homePage.getPhoneInputText()).toBe('+380');

    await homePage.fillInput('phone', contactUsFormInputValues["correct phone"]);
    await homePage.clearInput('name');
    await homePage.clickOnSubmitConsultationBtn();

    await expect(await homePage.checkInputErrorIsDisplayed('name', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    await expect(await homePage.checkInputErrorIsDisplayed('phone', testData.errorMessages.fieldMustBeFilled)).toBe(false);

    await homePage.fillInput('name', contactUsFormInputValues.test);
    await homePage.fillInput('phone', contactUsFormInputValues["incorrect phone with spaces"]);
    await homePage.clickOnSubmitConsultationBtn();

    await expect(homePage.consultationFormErrorMessage.first()).toBeVisible();
    await expect(homePage.consultationFormErrorMessage.first()).toHaveText(testData.errorMessages.phoneNumberWasNotValidated);
    await expect(homePage.consultationFormErrorMessage).toHaveCSS('border-color', 'rgb(247, 56, 89)')

    await homePage.fillInput('phone', contactUsFormInputValues["incorrect phone same digits and spaces"]);
    await homePage.clickOnSubmitConsultationBtn();

    await expect(homePage.consultationFormErrorMessage.first()).toBeVisible();
    await expect(homePage.consultationFormErrorMessage.first()).toHaveText(testData.errorMessages.phoneNumberWasNotValidated);
    await expect(homePage.consultationFormErrorMessage).toHaveCSS('border-color', testData.borderColors.errorColor)

    await homePage.fillInput('phone', contactUsFormInputValues["other correct phone"]);
    await homePage.clickOnSubmitConsultationBtn();

    await homePage.checkSuccessSubmitConsultationMsg();

    await homePage.clearInput('name');
    await homePage.clearInput('phone');
    await homePage.fillInput('name', userName);
    await homePage.fillInput('phone', contactUsFormInputValues["other correct phone"]);
    await homePage.clickOnSubmitConsultationBtn();

    await homePage.checkSuccessSubmitConsultationMsg();

    const userList = await apiHelper.getUserDetails();
    const reversedUserList = userList.slice().reverse();

    const containsUser = reversedUserList.some((user: any) => {
        return user.name === userName && user.phone === userPhone;
    });

    await expect(containsUser).toBe(true);
});