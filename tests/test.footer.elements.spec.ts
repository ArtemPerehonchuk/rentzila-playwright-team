import { test, expect } from "../fixtures";
import { faker } from '@faker-js/faker';
import testData from '../data/test.data.json' assert {type: 'json'}

const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';
const contactUsFormInputValues = testData.contuctUsFormInputs;

test.beforeEach(async ({ page, homepage }) => {
    await homepage.navigate('/');
});

test('test case C214: Verify that all elements on the footer are displayed and all links are clickable', async ({homepage, privacyPolicyPage, cookiePolicyPage, termsConditionsPage, productsPage, tendersPage }) => {
    await homepage.footerContainer.scrollIntoViewIfNeeded();

    await expect(homepage.footerContainer).toBeVisible();

    await homepage.contactsEmail.click();

    await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(homepage.aboutUsTitle).toBeVisible();
    await expect(homepage.privacyPolicyLink).toBeVisible();
    await expect(homepage.cookiePolicyLink).toBeVisible();
    await expect(homepage.termsConditionsLink).toBeVisible();
    await expect(homepage.announcementsLink).toBeVisible();
    await expect(homepage.tendersLink).toBeVisible();
    await expect(homepage.jobRequestsLink).toBeVisible();
    await expect(homepage.contactsTitle).toBeVisible();
    await expect(homepage.contactsEmail).toBeVisible();
    await expect(homepage.footerRentzilaLogo).toBeVisible();
    await expect(homepage.copyrightLabel).toBeVisible();

    await homepage.clickOnPrivacyPolicyLink();

    await expect(await privacyPolicyPage.getUrl()).toContain(testData.pagesURLPath["privacy-policy"]);
    await expect(privacyPolicyPage.privacyPolicyTitle).toBeVisible();
    await expect(privacyPolicyPage.privacyPolicyTitle).toHaveText(testData.titleTexts.privacyPolicy);

    await homepage.clickOnCookiePolicyLink();

    await expect(await cookiePolicyPage.getUrl()).toContain(testData.pagesURLPath["cookey-policy"]);
    await expect(cookiePolicyPage.cookiePolicyTitle).toBeVisible()
    await expect(cookiePolicyPage.cookiePolicyTitle).toHaveText(testData.titleTexts.cookiePolicy);

    await homepage.clickOnTermsConditionsLink();

    await expect(await termsConditionsPage.getUrl()).toContain(testData.pagesURLPath["terms-conditions"]);
    await expect(termsConditionsPage.termsConditionsTitle).toBeVisible()
    await expect(termsConditionsPage.termsConditionsTitle).toHaveText(testData.titleTexts.termsConditions);

    await homepage.clickOnAnnouncementsLink();

    await expect(await productsPage.getUrl()).toContain(testData.pagesURLPath.products);
    await expect(productsPage.searchInput).toBeVisible();
    await expect(await productsPage.getSearchInputBgText()).toBe(testData.inputPlaceholderTexts.searchAnnouncementInput);

    await productsPage.clickOnLogo();

    await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(await homepage.getSearchServiceSpecialEquipmentTitleText()).toContain(testData.titleTexts.specialEquipment);

    await homepage.clickOnTendersLink();

    await expect(await tendersPage.getUrl()).toContain(testData.pagesURLPath["tenders-map"]);
    await expect(tendersPage.searchInput).toBeVisible();
    await expect(await tendersPage.getSerchInputBgText()).toBe(testData.inputPlaceholderTexts.searchTenderInput);

    await tendersPage.clickOnLogo();

    await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(await homepage.getContactsEmail()).toContain('info@rentzila.com.ua');
});

test('test case C226: Verify "У Вас залишилися питання?" form', async ({ homepage, apiHelper }) => {
    const userName = faker.person.firstName();
    const userPhone = contactUsFormInputValues["other correct phone"];
    
    await homepage.scrollToConsultationForm();

    await expect(homepage.consultationForm).toBeVisible();

    await homepage.clickOnSubmitConsultationBtn();

    await expect(await homepage.checkInputErrorIsDisplayed('name', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    await expect(await homepage.checkInputErrorIsDisplayed('phone', testData.errorMessages.fieldMustBeFilled)).toBe(true);

    await homepage.fillInput('name', 'test');
    await homepage.clickOnSubmitConsultationBtn();

    await expect(await homepage.checkInputErrorIsDisplayed('name', testData.errorMessages.fieldMustBeFilled)).toBe(false);
    await expect(await homepage.checkInputErrorIsDisplayed('phone', testData.errorMessages.fieldMustBeFilled)).toBe(true);

    await homepage.consultationFormPhoneInput.click();

    await expect(await homepage.getPhoneInputText()).toBe('+380');

    await homepage.fillInput('phone', contactUsFormInputValues["correct phone"]);
    await homepage.clearInput('name');
    await homepage.clickOnSubmitConsultationBtn();

    await expect(await homepage.checkInputErrorIsDisplayed('name', testData.errorMessages.fieldMustBeFilled)).toBe(true);
    await expect(await homepage.checkInputErrorIsDisplayed('phone', testData.errorMessages.fieldMustBeFilled)).toBe(false);

    await homepage.fillInput('name', contactUsFormInputValues.test);
    await homepage.fillInput('phone', contactUsFormInputValues["incorrect phone with spaces"]);
    await homepage.clickOnSubmitConsultationBtn();

    await expect(homepage.consultationFormErrorMessage.first()).toBeVisible();
    await expect(homepage.consultationFormErrorMessage.first()).toHaveText(testData.errorMessages.phoneNumberWasNotValidated);
    await expect(homepage.consultationFormErrorMessage).toHaveCSS('border-color', 'rgb(247, 56, 89)')

    await homepage.fillInput('phone', contactUsFormInputValues["incorrect phone same digits and spaces"]);
    await homepage.clickOnSubmitConsultationBtn();

    await expect(homepage.consultationFormErrorMessage.first()).toBeVisible();
    await expect(homepage.consultationFormErrorMessage.first()).toHaveText(testData.errorMessages.phoneNumberWasNotValidated);
    await expect(homepage.consultationFormErrorMessage).toHaveCSS('border-color', testData.borderColors.errorColor)

    await homepage.fillInput('phone', contactUsFormInputValues["other correct phone"]);
    await homepage.clickOnSubmitConsultationBtn();

    await homepage.checkSuccessSubmitConsultationMsg();

    await homepage.clearInput('name');
    await homepage.clearInput('phone');
    await homepage.fillInput('name', userName);
    await homepage.fillInput('phone', contactUsFormInputValues["other correct phone"]);
    await homepage.clickOnSubmitConsultationBtn();

    await homepage.checkSuccessSubmitConsultationMsg();

    const userList = await apiHelper.getUserDetails();
    const reversedUserList = userList.slice().reverse();

    const containsUser = reversedUserList.some((user: any) => {
        return user.name === userName && user.phone === userPhone;
    });

    await expect(containsUser).toBe(true);
});