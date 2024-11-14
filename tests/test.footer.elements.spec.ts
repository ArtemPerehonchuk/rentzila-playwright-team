import { test, expect, request, APIRequestContext } from "@playwright/test";
import HomePage from '../pages/home.page';
import PrivacyPolicyPage from '../pages/privacy.policy.page';
import CookiePolicyPage from '../pages/cookie.policy.page';
import TermsConditionsPage from '../pages/terms.conditions.page';
import ProductsPage from "../pages/products.page";
import TendersPage from '../pages/tenders.page';
import { faker } from '@faker-js/faker';
import testData from '../data/test_data.json' assert {type: 'json'}


let apiRequestContext: APIRequestContext;

let homepage: HomePage;

const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';
const pagesUrlPath = testData["pages URL path"];
const contactUsFormInputValues = testData["contuct us form inputs"];


test.beforeEach(async ({ page }) => {
    apiRequestContext = await request.newContext(); 
    homepage = new HomePage(page, apiRequestContext);
    await homepage.navigate('/');
});

test('test case C214: Verify that all elements on the footer are displayed and all links are clickable', async ({ page }) => {
    const privacyPolicyPage = new PrivacyPolicyPage(page);
    const cookiePolicyPage = new CookiePolicyPage(page);
    const termsConditionsPage = new TermsConditionsPage(page);
    const productsPage = new ProductsPage(page);
    const tendersPage = new TendersPage(page);
    
    await homepage.scrollToFooter();

    await expect(homepage.footerContainer).toBeVisible();

    await homepage.clickOnContactsEmail();

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

    await expect(await privacyPolicyPage.getUrl()).toContain(pagesUrlPath["privacy-policy"]);
    await expect(privacyPolicyPage.privacyPolicyTitle).toBeVisible();
    await expect(privacyPolicyPage.privacyPolicyTitle).toHaveText('Політика конфіденційності');

    await homepage.clickOnCookiePolicyLink();

    await expect(await cookiePolicyPage.getUrl()).toContain(pagesUrlPath["cookey-policy"]);
    await expect(cookiePolicyPage.cookiePolicyTitle).toBeVisible()
    await expect(cookiePolicyPage.cookiePolicyTitle).toHaveText('Політика використання файлів cookie');

    await homepage.clickOnTermsConditionsLink();

    await expect(await termsConditionsPage.getUrl()).toContain(pagesUrlPath["terms-conditions"]);
    await expect(termsConditionsPage.termsConditionsTitle).toBeVisible()
    await expect(termsConditionsPage.termsConditionsTitle).toHaveText('Угода користувача');

    await homepage.clickOnAnnouncementsLink();

    await expect(await productsPage.getUrl()).toContain(pagesUrlPath["products"]);
    await expect(productsPage.searchInput).toBeVisible();
    await expect(await productsPage.getSearchInputBgText()).toBe('Пошук оголошень або послуг');

    await productsPage.clickOnLogo();

    await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(await homepage.getSearchServiceSpecialEquipmentTitleText()).toContain('Сервіс пошуку');

    await homepage.clickOnTendersLink();

    await expect(await tendersPage.getUrl()).toContain(pagesUrlPath["tenders-map"]);
    await expect(tendersPage.searchInput).toBeVisible();
    await expect(await tendersPage.getSerchInputBgText()).toBe('Пошук тендера за ключовими словами');

    await tendersPage.clickOnLogo();

    await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);
    await expect(await homepage.getContactsEmail()).toContain('info@rentzila.com.ua');
});

test('test case C226: Verify "У Вас залишилися питання?" form', async ({ page }) => {
    const userName = faker.person.firstName();
    const userPhone = contactUsFormInputValues["other correct phone"];
    
    await homepage.scrollToConsultationForm();

    await expect(await homepage.consultationForm).toBeVisible();

    await homepage.clickOnSubmitConsultationBtn();

    await expect(await homepage.checkInputErrorIsDisplayed('name', 'Поле не може бути порожнім')).toBe(true);
    await expect(await homepage.checkInputErrorIsDisplayed('phone', 'Поле не може бути порожнім')).toBe(true);

    await homepage.fillInput('name', 'test');
    await homepage.clickOnSubmitConsultationBtn();

    await expect(await homepage.checkInputErrorIsDisplayed('name', 'Поле не може бути порожнім')).toBe(false);
    await expect(await homepage.checkInputErrorIsDisplayed('phone', 'Поле не може бути порожнім')).toBe(true);

    await homepage.clickOnPhoneInput();

    await expect(await homepage.getPhoneInputText()).toBe('+380');

    await homepage.fillInput('phone', contactUsFormInputValues["correct phone"]);
    await homepage.clearInput('name');
    await homepage.clickOnSubmitConsultationBtn();

    await expect(await homepage.checkInputErrorIsDisplayed('name', 'Поле не може бути порожнім')).toBe(true);
    await expect(await homepage.checkInputErrorIsDisplayed('phone', 'Поле не може бути порожнім')).toBe(false);

    await homepage.fillInput('name', contactUsFormInputValues.test);
    await homepage.fillInput('phone', contactUsFormInputValues["incorrect phone with spaces"]);
    await homepage.clickOnSubmitConsultationBtn();

    await expect(homepage.consultationFormErrorMessage.first()).toBeVisible();
    await expect(homepage.consultationFormErrorMessage.first()).toHaveText('Телефон не пройшов валідацію');
    await expect(homepage.consultationFormErrorMessage).toHaveCSS('border-color', 'rgb(247, 56, 89)')

    await homepage.fillInput('phone', contactUsFormInputValues["incorrect phone same digits and spaces"]);
    await homepage.clickOnSubmitConsultationBtn();

    await expect(homepage.consultationFormErrorMessage.first()).toBeVisible();
    await expect(homepage.consultationFormErrorMessage.first()).toHaveText('Телефон не пройшов валідацію');
    await expect(homepage.consultationFormErrorMessage).toHaveCSS('border-color', 'rgb(247, 56, 89)')

    await homepage.fillInput('phone', contactUsFormInputValues["other correct phone"]);
    await homepage.clickOnSubmitConsultationBtn();

    await homepage.checkSuccessSubmitConsultationMsg();

    await homepage.clearInput('name');
    await homepage.clearInput('phone');
    await homepage.fillInput('name', userName);
    await homepage.fillInput('phone', contactUsFormInputValues["other correct phone"]);
    await homepage.clickOnSubmitConsultationBtn();

    await homepage.checkSuccessSubmitConsultationMsg();
        
    const userList = await homepage.getUsersList();

    const containsUser = userList.some((user: any) => {
        return user.name === userName && user.phone === userPhone
    });

    await expect(containsUser).toBe(true);
});