import { test as baseTest, request, APIRequestContext } from '@playwright/test';
import ApiHelper from './helpers/api.helper';
import HomePage from './pages/home.page';
import ProductsPage from './pages/products.page';
import UnitPage from './pages/unit.page';
import PrivacyPolicyPage from './pages/privacy.policy.page';
import TermsConditionsPage from './pages/terms.conditions.page';
import CookiePolicyPage from './pages/cookie.policy.page';
import TendersPage from './pages/tenders.page';
import ProfilePage from './pages/profile.page';
import OwnerUnitsPage from './pages/owner.units.page';
import CreateUnitPage from './pages/create.unit.page';
import EditUnitPage from './pages/edit.unit.page';
import PricesTab from './pages/prices.tab';
import PhotoTab from './pages/photo.tab';
import ServicesTab from './pages/services.tab';

type TestFixtures = {
    homePage: HomePage;
    apiHelper: ApiHelper;
    productsPage: ProductsPage;
    unitPage: UnitPage;
    privacyPolicyPage: PrivacyPolicyPage;
    cookiePolicyPage: CookiePolicyPage;
    termsAndConditionsPage: TermsConditionsPage;
    tendersPage: TendersPage;
    profilePage: ProfilePage;
    ownerUnitsPage: OwnerUnitsPage;
    createUnitPage: CreateUnitPage;
    editUnitPage: EditUnitPage;
    photoTab: PhotoTab;
    servicesTab: ServicesTab;
    pricesTab: PricesTab;
};

export const test = baseTest.extend<TestFixtures>({

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);

        await homePage.navigate();
        await homePage.clickOnClosePopUpBtn();

        await use(homePage);
    },

    apiHelper: async ({ }, use) => {
        const apiRequestContext: APIRequestContext = await request.newContext();
        const apiHelper = new ApiHelper(apiRequestContext);
        await use(apiHelper);
    },

    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },

    unitPage: async ({ page }, use) => {
        const singleUnitPage = new UnitPage(page);
        await use(singleUnitPage);
    },

    privacyPolicyPage: async ({ page }, use) => {
        const privacyPolicyPage = new PrivacyPolicyPage(page);
        await use(privacyPolicyPage);
    },

    cookiePolicyPage: async ({ page }, use) => {
        const cookiePolicyPage = new CookiePolicyPage(page);
        await use(cookiePolicyPage);
    },

    termsAndConditionsPage: async ({ page }, use) => {
        const termsAndConditionsPage = new TermsConditionsPage(page);
        await use(termsAndConditionsPage);
    },

    tendersPage: async ({ page }, use) => {
        const tendersPage = new TendersPage(page);
        await use(tendersPage);
    },

    profilePage: async ({ page }, use) => {
        const profilePage = new ProfilePage(page);
        await use(profilePage);
    },

    ownerUnitsPage: async ({ page }, use) => {
        const ownerUnitsPage = new OwnerUnitsPage(page);
        await use(ownerUnitsPage);
    },

    createUnitPage: async ({ page }, use) => {
        const createUnitPage = new CreateUnitPage(page);
        await use(createUnitPage);
    },

    editUnitPage: async ({ page }, use) => {
        const editUnitPage = new EditUnitPage(page);
        await use(editUnitPage);
    },

    photoTab: async ({ page }, use) => {
        const photoTab = new PhotoTab(page);
        await use(photoTab);
    },

    servicesTab: async ({ page }, use) => {
        const servicesTab = new ServicesTab(page);
        await use(servicesTab);
    },

    pricesTab: async ({ page }, use) => {
        const pricesTab = new PricesTab(page);
        await use(pricesTab);
    },
});