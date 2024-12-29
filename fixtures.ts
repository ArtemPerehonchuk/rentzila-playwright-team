import { test as baseTest, expect, request, APIRequestContext } from '@playwright/test';
import CookiePolicyPage from './pages/cookie.policy.page';
import CreateUnitPage from './pages/create.unit.page';
import EditUnitPage from './pages/edit.unit.page';
import HomePage from './pages/home.page';
import OwnerUnitsPage from './pages/owner.units.page';
import PhotoTab from './pages/photo.tab';
import PricesTab from './pages/prices.tab';
import PrivacyPolicyPage from './pages/privacy.policy.page';
import ProductsPage from './pages/products.page';
import ProfilePage from './pages/profile.page';
import ServicesTab from './pages/services.tab';
import OwnerUnitsUI from './page_elements/owner.units.ui'
import TenderViewPage from './pages/tender.view.page'
import OwnerTendersPage from './pages/owner.tenders.page'
import TendersPage from './pages/tenders.page';
import TermsConditionsPage from './pages/terms.conditions.page';
import UnitDetailsPage from './pages/unit.details.page';
import UnitPage from './pages/unit.page';
import ApiHelper from './helpers/api.helper';
import CreateTenderPage from './pages/create.tender.page';

type TestFixtures = {
    homePage: HomePage;
    cookiePolicyPage: CookiePolicyPage;
    createUnitPage: CreateUnitPage;
    editUnitPage: EditUnitPage;
    ownerUnitsPage: OwnerUnitsPage;
    photoTab: PhotoTab;
    pricesTab: PricesTab;
    privacyPolicyPage: PrivacyPolicyPage;
    productsPage: ProductsPage;
    profilePage: ProfilePage;
    servicesTab: ServicesTab;
    tendersPage: TendersPage;
    termsConditionsPage: TermsConditionsPage;
    unitDetailsPage: UnitDetailsPage;
    unitPage: UnitPage;
    apiHelper: ApiHelper;
    createTenderPage: CreateTenderPage;
    ownerUnitsUI: OwnerUnitsUI;
    tenderViewPage: TenderViewPage;
    ownerTendersPage: OwnerTendersPage;
}

export const test = baseTest.extend<TestFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);

        await homePage.navigate('/');
        await homePage.closePopUpBtn.click();

        await use(homePage)
    },
    cookiePolicyPage: async ({ page }, use) => {
        await use(new CookiePolicyPage(page));
    },
    createUnitPage: async ({ page }, use) => {
        await use(new CreateUnitPage(page));
    },
    editUnitPage: async ({ page }, use) => {
        await use(new EditUnitPage(page));
    },
    ownerUnitsPage: async ({ page }, use) => {
        await use(new OwnerUnitsPage(page));
    },
    photoTab: async ({ page }, use) => {
        await use(new PhotoTab(page));
    },
    pricesTab: async ({ page }, use) => {
        await use(new PricesTab(page));
    },
    privacyPolicyPage: async ({ page }, use) => {
        await use(new PrivacyPolicyPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
    servicesTab: async ({ page }, use) => {
        await use(new ServicesTab(page));
    },
    tendersPage: async ({ page }, use) => {
        await use(new TendersPage(page));
    },
    termsConditionsPage: async ({ page }, use) => {
        await use(new TermsConditionsPage(page)
        );
    },
    unitDetailsPage: async ({ page }, use) => {
        await use(new UnitDetailsPage(page));
    },
    unitPage: async ({ page }, use) => {
        await use(new UnitPage(page));
    },
    apiHelper: async ({ }, use) => {
        const apiRequestContext: APIRequestContext = await request.newContext();
        const apiHelper = new ApiHelper(apiRequestContext);
        await use(apiHelper);
    },
    createTenderPage: async ({ page }, use) => {
        await use(new CreateTenderPage(page));
    },
    ownerUnitsUI: async ({ page }, use) => {
        await use(new OwnerUnitsUI(page));
    },
    ownerTendersPage: async ({ page }, use) => {
        await use(new OwnerTendersPage(page));
    },
    tenderViewPage: async ({ page }, use) => {
        await use(new TenderViewPage(page));
    },
});

export { expect };