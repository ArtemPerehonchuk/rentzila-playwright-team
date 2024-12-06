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
        await use(new ProductsPage(page));
    },

    unitPage: async ({ page }, use) => {
        await use(new UnitPage(page));
    },

    privacyPolicyPage: async ({ page }, use) => {
        await use(new PrivacyPolicyPage(page));
    },

    cookiePolicyPage: async ({ page }, use) => {
        await use(new CookiePolicyPage(page));
    },

    termsAndConditionsPage: async ({ page }, use) => {
        await use(new TermsConditionsPage(page));
    },

    tendersPage: async ({ page }, use) => {
        await use(new TendersPage(page));
    },

    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },

    ownerUnitsPage: async ({ page }, use) => {
        await use(new OwnerUnitsPage(page));
    },

    createUnitPage: async ({ page }, use) => {
        await use(new CreateUnitPage(page));
    },

    editUnitPage: async ({ page }, use) => {
        await use(new EditUnitPage(page));
    },

    photoTab: async ({ page }, use) => {
        await use(new PhotoTab(page));
    },

    servicesTab: async ({ page }, use) => {
        await use(new ServicesTab(page));
    },

    pricesTab: async ({ page }, use) => {
        await use(new PricesTab(page));
    },
});