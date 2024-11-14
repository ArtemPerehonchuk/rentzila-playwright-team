import { test, expect, request, APIRequestContext } from "@playwright/test";
import HomePage from '../pages/home.page';
import OwnerUnitsPage from '../pages/owner.units.page';
import ApiHelper from "../helpers/api.helper";
import { faker } from "@faker-js/faker";

let apiRequestContext: APIRequestContext;
let homepage: HomePage;
let ownerUnitsPage: OwnerUnitsPage;
let apiHelper: ApiHelper;
let accessUserToken: string;
let accessAdminToken: string;

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let unitName: string;
let createdUnitId: number;

test.beforeAll(async () => {
    apiRequestContext = await request.newContext();
    apiHelper = new ApiHelper(apiRequestContext);
    accessUserToken = await apiHelper.createUserAccessToken(); 
    accessAdminToken = await apiHelper.createAdminAccessToken();
});

test.beforeEach(async ({ page }) => {
    homepage = new HomePage(page, apiRequestContext);
    ownerUnitsPage = new OwnerUnitsPage(page);
    
    await homepage.navigate('/');
    await homepage.clickOnClosePopUpBtn();
    await homepage.clickOnEnterBtn()
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();
});

test('Verify creating unit through the API request', async( {page} ) => {
    unitName = faker.string.alpha({length: 15});

    const { response: createUnitResponse, unit } = await apiHelper.createUnit(accessUserToken, unitName);

    await expect(createUnitResponse.status()).toBe(201)

    createdUnitId = await apiHelper.getUnitId(accessUserToken, unitName);

    await homepage.clickOnUserIcon();
    await homepage.clickOnProfileMyAnnouncementsItem();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();

    const {response: uploadPhotoResponse, responseData} = await apiHelper.uploadUnitPhoto(accessUserToken, createdUnitId);

    await expect(uploadPhotoResponse.status()).toBe(201)

    await expect(ownerUnitsPage.firstUnitName).toHaveText(unitName);

    const deleteUnitResponse  = await apiHelper.deleteUnit(accessUserToken, createdUnitId);

    await expect(deleteUnitResponse.status()).toBe(204)
})