import { expect } from "@playwright/test";
import { test } from "../fixtures";
import testData from '../data/test_data.json' assert {type: 'json'};
import { faker } from "@faker-js/faker";

let adminAccessToken: string | null
const LOGIN = process.env.VALID_EMAIL || ''
const PASSWORD = process.env.VALID_PASSWORD || ''

test.beforeAll(async ({ apiHelper }) => {
    adminAccessToken = await apiHelper.createAdminAccessToken();
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
        await expect(page).toHaveURL("products/");
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

        // await ownerUnitsPage.enterUnitSearch("<>{};^'"); //special symbols can be entered on automation or manually by pasting
        // await expect(ownerUnitsPage.unitSearchInput).toHaveValue('');

        await ownerUnitsPage.enterUnitSearch(unitTitle);
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).not.toBeVisible();

        await ownerUnitsPage.enterUnitSearch(unitTitle2, 'paste');
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).not.toBeVisible();

        let nonExistentName = faker.string.alpha({length: 15});
        await ownerUnitsPage.enterUnitSearch(nonExistentName);
        expect(ownerUnitsPage.unitsEmptyTitle).toHaveText(`Оголошення за назвою "${nonExistentName}" не знайдені`);
        expect(ownerUnitsPage.unitsEmptyMsg).toHaveText(`Ви можете змінити пошуковий запит або скинути всі фільтри`);

        await expect(ownerUnitsPage.emptyBlockBtn).toHaveText("Скинути фільтри");
        await ownerUnitsPage.emptyBlockBtn.click();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle)).toBeVisible();
        await expect(ownerUnitsPage.getUnitCardByTitle(unitTitle2)).toBeVisible();
        await expect(ownerUnitsPage.unitSearchInput).toHaveValue('');
    });
});

test.describe('Favorite units search and sorting tests', async () => {

    test.beforeEach(async ({ page, homePage, apiHelper, profilePage, ownerUnitsPage }) => {
        let favUnitIds: number[] = await apiHelper.getFavoriteUnits(adminAccessToken);
        await apiHelper.removeUnitsFromFavorites(adminAccessToken, favUnitIds);

        let unitIds: number[] = await apiHelper.getUnitIds(12);
        await apiHelper.addUnitsToFavorites(adminAccessToken, unitIds);

        await homePage.loginUser(process.env.VALID_EMAIL || '', process.env.VALID_PASSWORD || '');
        await homePage.clickOnUserIcon();
        await homePage.clickOnProfileMyAnnouncementsItem();
        await profilePage.favoriteUnitsTab.click();
        await expect(page).toHaveURL('owner-favourite-units/');
    });

    test('C311 - Check the pagination on the "Обрані оголошення" page', async ({ apiHelper, ownerUnitsPage }) => {
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

    test('C315 - "Всі категорії" dropdown menu functionality', async ({ ownerUnitsPage }) => {
        const allCategories = "Всі категорії"
        const category = "Будівельна техніка"
        const category2 = "Комунальна техніка"
        const category3 = "Складська техніка"

        await expect(ownerUnitsPage.unitCategorySelect).toHaveText(allCategories);
        let numberOfUnitCards = await ownerUnitsPage.getUnitCardsLength();
        expect(numberOfUnitCards).toEqual(5);

        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(category).click();
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(category)).toBe(true);

        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(category2).click();
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(category2)).toBe(true);

        await ownerUnitsPage.unitCategorySelect.click();
        await ownerUnitsPage.getSelectItemWithText(category3).click();
        expect(await ownerUnitsPage.verifyAllUnitsDisplayedWithCategory(category3)).toBe(true);
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
});