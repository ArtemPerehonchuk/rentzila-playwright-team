import{ test as baseTest, expect, request, APIRequestContext } from '@playwright/test';
import AdminMainPage from './pages/admin.main.page';
import AdminUnitReviewPage from './pages/admin.unit.review.page';
import AdminUnitsPage from './pages/admin.units.page';
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
import TendersPage from './pages/tenders.page';
import TermsConditionsPage from './pages/terms.conditions.page';
import UnitDetailsPage from './pages/unit.details.page';
import UnitPage from './pages/unit.page';
import ApiHelper from './helpers/api.helper';
import CreateTenderPage from './pages/create.tender.page';
import OwnerTendersPage from './pages/owner.tenders.page'

type TestFixtures = {
    homepage: HomePage;
    adminMainPage: AdminMainPage;
    adminUnitReviewPage: AdminUnitReviewPage;
    adminUnitsPage: AdminUnitsPage;
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
    ownerTendersPage: OwnerTendersPage;
}

export const test = baseTest.extend<TestFixtures>({
    homepage: async({page}, use) => {
        const homePage = new HomePage(page);

        await homePage.navigate('/');
        await homePage.clickOnClosePopUpBtn();
        
        await use(homePage)
    },
    adminMainPage: async({page}, use) => {
        const adminMainPage = new AdminMainPage(page);   
        await use(adminMainPage)
    },
    adminUnitReviewPage: async({page}, use) => {
        const adminUnitReviewPage = new AdminUnitReviewPage(page);
        await use(adminUnitReviewPage);
    },
    adminUnitsPage: async({page}, use) => {
        const adminUnitsPage = new AdminUnitsPage(page);
        await use(adminUnitsPage);
    },
    cookiePolicyPage: async({page}, use) => {
        const cookiePolicyPage = new CookiePolicyPage(page);
        await use(cookiePolicyPage);
    },
    createUnitPage: async({page}, use) => {
        const createUnitPage = new CreateUnitPage(page);
        await use(createUnitPage);
    },
    editUnitPage: async({page}, use) => {
        const editUnitPage = new EditUnitPage(page);
        await use(editUnitPage);
    },
    ownerUnitsPage: async({page}, use) => {
        const ownerUnitsPage = new OwnerUnitsPage(page);
        await use(ownerUnitsPage);
    },
    photoTab: async({page}, use) => {
        const photoTab = new PhotoTab(page);
        await use(photoTab);
    },
    pricesTab: async({page}, use) => {
        const pricesTab = new PricesTab(page);
        await use(pricesTab);
    },
    privacyPolicyPage: async({page}, use) => {
        const privacyPolicyPage = new PrivacyPolicyPage(page);
        await use(privacyPolicyPage);
    },
    productsPage: async({page}, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },
    profilePage: async({page}, use) => {
        const profilePage = new ProfilePage(page);
        await use(profilePage);
    },
    servicesTab: async({page}, use) => {
        const servicesTab = new ServicesTab(page);
        await use(servicesTab);
    },
    tendersPage: async({page}, use) => {
        const tendersPage = new TendersPage(page);
        await use(tendersPage);
    },
    termsConditionsPage: async({page}, use) => {
        const termsConditionsPage = new TermsConditionsPage(page);
        await use(termsConditionsPage);
    },
    unitDetailsPage: async({page}, use) => {
        const unitDetailsPage = new UnitDetailsPage(page);
        await use(unitDetailsPage);
    },
    unitPage: async({page}, use) => {
        const unitPage = new UnitPage(page);
        await use(unitPage);
    },
    apiHelper: async({}, use) => {
        const apiRequestContext: APIRequestContext = await request.newContext();
        const apiHelper = new ApiHelper(apiRequestContext);
        await use(apiHelper);
    },
    createTenderPage: async({page}, use) => {
        const createTenderPage = new CreateTenderPage(page);
        await use(createTenderPage);
    },
    ownerTendersPage: async({page}, use) => {
        const ownerTendersPage = new OwnerTendersPage(page);
        await use(ownerTendersPage);
    },
});

export { expect };