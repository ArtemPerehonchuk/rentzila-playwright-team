import { test, expect } from '../fixtures';
import { faker } from "@faker-js/faker";

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let unitName: string;
let createdUnitId: number;
let accessUserToken: string;
let accessAdminToken: string;

test.beforeAll(async ({apiHelper, }) => {
    accessUserToken = await apiHelper.createUserAccessToken(); 
    accessAdminToken = await apiHelper.createAdminAccessToken();
});

test.beforeEach(async ({ homepage }) => {
    await homepage.navigate('/');
    await homepage.closePopUpBtn.click();
    await homepage.enterBtn.click()
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();
});

test('Verify creating unit through the API request', async( { apiHelper, homepage, ownerUnitsPage} ) => {
    unitName = faker.string.alpha({length: 15});

    const { response: createUnitResponse, unit } = await apiHelper.createUnit(accessUserToken, unitName);

    await expect(createUnitResponse.status()).toBe(201)

    createdUnitId = await apiHelper.getUnitId(accessUserToken, unitName);

    await homepage.clickOnUserIcon();
    await homepage.clickOnProfileMyAnnouncementsItem();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();

    const uploadPhotoResponse = await apiHelper.uploadUnitPhoto(accessUserToken, createdUnitId);

    await expect(uploadPhotoResponse.status()).toBe(201)

    await expect(ownerUnitsPage.unitName.first()).toHaveText(unitName);

    const deleteUnitResponse  = await apiHelper.deleteUnit(accessUserToken, createdUnitId);

    await expect(deleteUnitResponse.status()).toBe(204)
})