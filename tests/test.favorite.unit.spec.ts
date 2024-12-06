import { expect } from "@playwright/test";
import { test } from "../fixtures";
import testData from '../data/test_data.json' assert {type: 'json'};
import categories from '../data/category_names.json' assert {type: 'json'};
import { faker } from "@faker-js/faker";

let adminAccessToken: string
let userAccessToken: string
const LOGIN = process.env.VALID_EMAIL || ''
const PASSWORD = process.env.VALID_PASSWORD || ''

test.beforeAll(async ({ apiHelper }) => {
    adminAccessToken = await apiHelper.createAdminAccessToken();
    userAccessToken = await apiHelper.createUserAccessToken();
});

test.beforeEach(async ({ homePage, apiHelper }) => {
    const favUnitIds: number[] = await apiHelper.getFavoriteUnits(adminAccessToken);
    await apiHelper.removeUnitsFromFavorites(adminAccessToken, favUnitIds);
});

test.describe('Favorite Unit Tests', async () => {

    test.beforeEach(async ({ homePage, apiHelper, profilePage }) => {
        let favUnitIds: number[] = await apiHelper.getFavoriteUnits(adminAccessToken);
        await apiHelper.removeUnitsFromFavorites(adminAccessToken, favUnitIds);

        await homePage.loginUser(LOGIN, PASSWORD);
        await homePage.clickOnUserIcon();
        await homePage.clickOnProfileMyAnnouncementsItem();

        await profilePage.favoriteUnitsTab.click();
    });

    test('C300 - The "Обрані оголошення" page without "Обрані" units', async ({ page, ownerUnitsPage }) => {
        await expect(ownerUnitsPage.unitsEmptyTitle).toHaveText("У Вас поки немає обраних оголошень");
        await expect(ownerUnitsPage.emptyBlockBtn).toHaveText("До списку оголошень");

        await ownerUnitsPage.emptyBlockBtn.click();
        await expect(page).toHaveURL(/products/);
    });

    test('C302 - "Обрані" icon functionality', async ({ homePage, productsPage, profilePage, ownerUnitsPage }) => {
        await homePage.announcementsLink.click();

        const unitTitle = await productsPage.getTitleFromUnitCard(0);
        await productsPage.getFavoriteBtnOnUnit(0).click();
        await expect(productsPage.getFavoriteStatusOnUnit(0)).toHaveAttribute('stroke',
            testData.elementStates.favBtn.active);
        await homePage.clickOnUserIcon();
        await homePage.clickOnProfileMyAnnouncementsItem();
        await profilePage.favoriteUnitsTab.click();

        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).toBeVisible();
        await expect(ownerUnitsPage.getFavoriteStatusOnUnit(unitTitle)).toHaveAttribute('stroke',
            testData.elementStates.favBtn.active);
        await ownerUnitsPage.getFavoriteBtnOnUnit(unitTitle).click();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).not.toBeVisible();

        await homePage.announcementsLink.click();
        await expect(productsPage.getFavoriteStatusOnUnit(0)).toHaveAttribute('stroke',
            testData.elementStates.favBtn.inactive);
    });

    test('C305 - "Пошук по назві" search field functionality', async ({ page, homePage, productsPage, profilePage, ownerUnitsPage }) => {
        await homePage.announcementsLink.click();

        const unitTitle = await productsPage.getTitleFromUnitCard(0);
        const unitTitle2 = await productsPage.getTitleFromUnitCard(1);
        await productsPage.getFavoriteBtnOnUnit(0).click();
        await productsPage.getFavoriteBtnOnUnit(1).click();

        await homePage.clickOnUserIcon();
        await homePage.clickOnProfileMyAnnouncementsItem();
        await profilePage.favoriteUnitsTab.click();

        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).toBeVisible();

        await ownerUnitsPage.unitSearchInput.click();
        await page.keyboard.press('Enter');
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).toBeVisible();

        await ownerUnitsPage.enterValueToInput(ownerUnitsPage.unitSearchInput, unitTitle);
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).not.toBeVisible();

        await ownerUnitsPage.enterValueToInput(ownerUnitsPage.unitSearchInput, unitTitle2, 'paste');
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).not.toBeVisible();

        let nonExistentName = faker.string.alpha({length: 15});
        await ownerUnitsPage.enterValueToInput(ownerUnitsPage.unitSearchInput, nonExistentName);
        await expect(ownerUnitsPage.unitsEmptyTitle).toHaveText(`Оголошення за назвою "${nonExistentName}" не знайдені`);
        await expect(ownerUnitsPage.unitsEmptyMsg).toHaveText(`Ви можете змінити пошуковий запит або скинути всі фільтри`);

        await expect(ownerUnitsPage.emptyBlockBtn).toHaveText("Скинути фільтри");
        await ownerUnitsPage.emptyBlockBtn.click();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).toBeVisible();
        await expect(ownerUnitsPage.unitSearchInput).toHaveValue('');
    });
});

test.describe('Favorite units pagination and sorting tests', async () => {

    test.beforeEach(async ({ page, apiHelper, profilePage, homePage }) => {
        let unitIds: number[] = await apiHelper.getUnitIds(12);
        await apiHelper.addUnitsToFavorites(adminAccessToken, unitIds);

        await homePage.loginUser(LOGIN, PASSWORD);
        await homePage.clickOnUserIcon();
        await homePage.clickOnProfileMyAnnouncementsItem();

        await profilePage.favoriteUnitsTab.click();
        await expect(page).toHaveURL(/owner-favourite-units/);
    });

    test('C311 - Check the pagination on the "Обрані оголошення" page', async ({ ownerUnitsPage }) => {
        let numberOfUnitCards = await ownerUnitsPage.getUnitCardsLength();
        expect(numberOfUnitCards).toEqual(5);

        await expect(ownerUnitsPage.paginationPrevBtn).toHaveAttribute('aria-disabled', 'true');
        await expect(ownerUnitsPage.getPaginationBtnWithIndex(1)).toHaveAttribute('aria-current', 'page');

        await ownerUnitsPage.paginationNextBtn.click();
        await expect(ownerUnitsPage.paginationPrevBtn).toHaveAttribute('aria-disabled', 'false');
        await expect(ownerUnitsPage.getPaginationBtnWithIndex(2)).toHaveAttribute('aria-current', 'page');

        await ownerUnitsPage.paginationNextBtn.click();
        await expect(ownerUnitsPage.getPaginationBtnWithIndex(3)).toHaveAttribute('aria-current', 'page');
        await expect(ownerUnitsPage.paginationNextBtn).toHaveAttribute('aria-disabled', 'true');

        numberOfUnitCards = await ownerUnitsPage.getUnitCardsLength();
        expect(numberOfUnitCards).toEqual(2);

        await ownerUnitsPage.getPaginationBtnWithIndex(1).click();
        await expect(ownerUnitsPage.getPaginationBtnWithIndex(1)).toHaveAttribute('aria-current', 'page');
    });

    test('C744 - Check the "Очистити список" button functionality', async ({ ownerUnitsPage }) => {
        let numberOfUnitCards = await ownerUnitsPage.getUnitCardsLength();
        expect(numberOfUnitCards).toEqual(5);

        await ownerUnitsPage.clearFavoritesBtn.click();
        await ownerUnitsPage.clearFavoritesPopupCancelBtn.click();
        await expect(ownerUnitsPage.clearFavoritesPopup).not.toBeVisible();

        await ownerUnitsPage.clearFavoritesBtn.click();
        await ownerUnitsPage.clearFavoritesPopupCloseIcon.click();
        await expect(ownerUnitsPage.clearFavoritesPopup).not.toBeVisible();

        await ownerUnitsPage.clearFavoritesBtn.click();
        await expect(ownerUnitsPage.clearFavoritesPopup).toBeVisible();
        await ownerUnitsPage.logo.click({ force: true });
        await expect(ownerUnitsPage.clearFavoritesPopup).not.toBeVisible();

        numberOfUnitCards = await ownerUnitsPage.getUnitCardsLength();
        expect(numberOfUnitCards).toEqual(5);

        await ownerUnitsPage.clearFavoritesBtn.click();
        await ownerUnitsPage.clearFavoritesPopupConfirmBtn.click();

        await expect(ownerUnitsPage.unitsEmptyTitle).toBeVisible();
    });

    test('C316 - Check the "По даті створення" drop down menu functionality', async ({ownerUnitsPage}) => {
        await expect(ownerUnitsPage.unitSortingSelect).toHaveText(testData.myUnitsFilters.sorting.dateTime.toLowerCase());
        expect(await ownerUnitsPage.verifyUnitsSortedByDateDescending()).toBe(true);

        await ownerUnitsPage.unitSortingSelect.click();
        await ownerUnitsPage.getSelectItemWithText(testData.myUnitsFilters.sorting.alpabetically).click();
        expect(await ownerUnitsPage.verifyUnitsSortedByDateDescending()).toBe(false);

        await ownerUnitsPage.unitSortingSelect.click();
        await ownerUnitsPage.getSelectItemWithText(testData.myUnitsFilters.sorting.dateTime).click();
        expect(await ownerUnitsPage.verifyUnitsSortedByDateDescending()).toBe(true);
    });
});

test.describe('Favorite units category filter tests', async () => {
    let buildingUnitTitle: string
    let civilUnitTitle: string
    let storageUnitTitle: string

    let totalNumberOfUnitCards: number

    let buildingUnit: number
    let civilUnit: number
    let storageUnit: number

    test.beforeEach(async ({ page, apiHelper, profilePage, ownerUnitsPage, homePage }) => {

        buildingUnitTitle = "UnitBuild " + faker.string.alpha({ length: 10 });
        civilUnitTitle = "UnitCivil " + faker.string.alpha({ length: 10 });
        storageUnitTitle = "UnitStorage " + faker.string.alpha({ length: 10 });

        buildingUnit = await apiHelper.createUnit(userAccessToken, buildingUnitTitle, 41, true);
        civilUnit = await apiHelper.createUnit(userAccessToken, civilUnitTitle, 311, true);
        storageUnit = await apiHelper.createUnit(userAccessToken, storageUnitTitle, 370, true);

        const unitIds: number[] = [buildingUnit, civilUnit, storageUnit]
        await apiHelper.addUnitsToFavorites(adminAccessToken, unitIds);

        await homePage.loginUser(LOGIN, PASSWORD);
        await homePage.clickOnUserIcon();
        await homePage.clickOnProfileMyAnnouncementsItem();

        await profilePage.favoriteUnitsTab.click();
        await expect(page).toHaveURL(/owner-favourite-units/);
        totalNumberOfUnitCards = await ownerUnitsPage.getUnitCardsLength();
        expect(totalNumberOfUnitCards).toEqual(3);
    });

    test.afterEach(async ({ apiHelper }) => {
        await apiHelper.deleteUnit(userAccessToken, buildingUnit);
        await apiHelper.deleteUnit(userAccessToken, civilUnit);
        await apiHelper.deleteUnit(userAccessToken, storageUnit);
    });

    test('C315 - "Всі категорії" category filter option', async ({ ownerUnitsPage }) => {
        await expect(ownerUnitsPage.unitCategorySelect).toHaveText(testData.myUnitsFilters.category.allCategories);

        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(testData.myUnitsFilters.category.building).click();
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(
            testData.myUnitsFilters.category.building)).toBe(true);
        expect(await ownerUnitsPage.getUnitCardsLength()).toBeLessThan(totalNumberOfUnitCards);

        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(testData.myUnitsFilters.category.allCategories).click();
        expect(await ownerUnitsPage.getUnitCardsLength()).toEqual(totalNumberOfUnitCards);
    });

    test('C746 - Check the "Будівельна техніка" category filter option', async ({ page, ownerUnitsPage, unitPage }) => {
        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(testData.myUnitsFilters.category.building).click();
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(
            testData.myUnitsFilters.category.building)).toBe(true);
        expect(await ownerUnitsPage.getUnitCardsLength()).toBeLessThan(totalNumberOfUnitCards);

        await ownerUnitsPage.unitCards.first().click();
        expect(categories.secondCategoryNames.building).toContain(
            await unitPage.secondCategoryBreadCrumb.innerText());

        await page.goBack();
        await expect(ownerUnitsPage.unitCategorySelect).toHaveText(testData.myUnitsFilters.category.building);
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(
            testData.myUnitsFilters.category.building)).toBe(true);
        expect(await ownerUnitsPage.getUnitCardsLength()).toBeLessThan(totalNumberOfUnitCards);
    });

    test('C747 - Check the "Комунальна техніка" category filter option', async ({ page, ownerUnitsPage, unitPage }) => {
        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(testData.myUnitsFilters.category.civilEngineering).click();
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(
            testData.myUnitsFilters.category.civilEngineering)).toBe(true);
        expect(await ownerUnitsPage.getUnitCardsLength()).toBeLessThan(totalNumberOfUnitCards);

        await ownerUnitsPage.unitCards.first().click();
        expect(categories.secondCategoryNames.civilEngineering).toContain(
            await unitPage.secondCategoryBreadCrumb.innerText());

        await page.goBack();
        await expect(ownerUnitsPage.unitCategorySelect).toHaveText(testData.myUnitsFilters.category.civilEngineering);
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(
            testData.myUnitsFilters.category.civilEngineering)).toBe(true);
        expect(await ownerUnitsPage.getUnitCardsLength()).toBeLessThan(totalNumberOfUnitCards);
    });

    test('C748 - Check the "Складська техніка" category filter option', async ({ page, ownerUnitsPage, unitPage }) => {
        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(testData.myUnitsFilters.category.storage).click();
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(
            testData.myUnitsFilters.category.storage)).toBe(true);
        expect(await ownerUnitsPage.getUnitCardsLength()).toBeLessThan(totalNumberOfUnitCards);

        await ownerUnitsPage.unitCards.first().click();
        expect(categories.secondCategoryNames.storage).toContain(
            await unitPage.secondCategoryBreadCrumb.innerText());

        await page.goBack();
        await expect(ownerUnitsPage.unitCategorySelect).toHaveText(testData.myUnitsFilters.category.storage);
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(
            testData.myUnitsFilters.category.storage)).toBe(true);
        expect(await ownerUnitsPage.getUnitCardsLength()).toBeLessThan(totalNumberOfUnitCards);
    });
});