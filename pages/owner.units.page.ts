import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class OwnerUnitsPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    unitName = this.page.locator('[class*="OwnerUnitCard_name"]');
    unitCategory = this.page.locator('div[class*="OwnerUnitCard_category_"]');
    activeAnnouncementsTab = this.page.locator('button[id*="Активні"]');
    waitingsAnnouncementsTab = this.page.locator('button[id*="Очікуючі"]');
    activeAnnouncementsTabTitle = this.page.locator('[data-testid="title"]');
    unitCards = this.page.locator('div[class*="OwnerUnitCard_unitCard_"]');
    editUnitBtn = this.page.locator('[class*="ItemButtons_lightBlueBtn"]');
    editWaitingsUnitBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    favoriteBtn = this.page.locator('[data-testid="favourite"]');
    favoriteIndicator = this.page.locator('[data-testid="favourite"] g>path');
    unitCreationDate = this.page.locator('div[class*="OwnerUnitCard_dot_"]~div');
    clearFavoritesBtn = this.page.locator('button[class*="OwnerFavouriteUnitsPage_removeList_"]');
    clearFavoritesPopup = this.page.locator('[class*="DialogPopup_content_"]');
    clearFavoritesPopupConfirmBtn = this.page.locator('div[class*="DialogPopup_btnsWrapper_"] button[class*="ItemButtons_darkBlueBtn"]');
    clearFavoritesPopupCancelBtn = this.page.locator('[class*="ItemButtons_lightRedBtn_"]');
    clearFavoritesPopupCloseIcon = this.page.locator('[class*="PopupLayout_closeIcon_"]');
    unitsEmptyTitle = this.page.getByTestId('title');
    unitsEmptyMsg = this.page.getByTestId('descr');
    emptyBlockBtn = this.page.getByTestId('emptyBlockButton');
    unitSearchInput = this.page.locator('div[data-testid="search"] input');
    paginationNumBtn = this.page.locator('a[class*="Pagination_page_"]');
    paginationPrevBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="prev"]');
    paginationNextBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="next"]');
    unitCategorySelect = this.page.getByTestId('div_CustomSelect').nth(0);
    unitSortingSelect = this.page.getByTestId('div_CustomSelect').nth(1);
    selectFieldItem = this.page.getByTestId('item-customSelect');

    getPaginationBtnWithIndex(index: number) {
        const number = index - 1;
        return this.paginationNumBtn.nth(number);
    }

    async verifyUnitsSortedByDateDescending() {
        const dateTexts = await this.unitCreationDate.allInnerTexts();

        const parsedDates = dateTexts.map(dateText => {
            const [day, month, year] = dateText.split('.').map(Number);
            return new Date(year, month - 1, day);
        });

        const sortedDates = [...parsedDates].sort((a, b) => b.getTime() - a.getTime());

        return parsedDates.every((date, index) => date.getTime() === sortedDates[index].getTime());
    }

    getSelectItemWithText(text: string) {
        return this.selectFieldItem.filter({ hasText: text });
    }

    getUnitCardByTitle(title: string) {
        return this.unitCards.filter({ has: this.unitName.filter({ hasText: title }) });
    }

    getFavoriteBtnOnUnit(title: string) {
        return this.getUnitCardByTitle(title).locator(this.favoriteBtn);
    }

    getFavoriteStatusOnUnit(title: string) {
        return this.getUnitCardByTitle(title).locator(this.favoriteIndicator);
    }

    async getCategoryOnUnit(index: number) {
        const unitCard = this.unitCards.nth(index);
        const category = (await unitCard.locator(this.unitCategory).innerText()).split('/')[0].trim();
        return category
    }

    async verifyAllUnitsDisplayedWithCategory(expectedCategory: string) {
        const unitCardsCount = await this.getUnitCardsLength();

        if (unitCardsCount === 0) {
            console.warn(`No units found for category ${expectedCategory}`);
            const isEmptyTitleCorrect = (await this.unitsEmptyTitle.innerText()) === `Оголошення в категорії "${expectedCategory}" не знайдені`;
            const isEmptyMsgCorrect = (await this.unitsEmptyMsg.innerText()) === "Ви можете змінити пошуковий запит або скинути всі фільтри";
            return isEmptyTitleCorrect && isEmptyMsgCorrect;
        }
        else {
            for (let i = 0; i < unitCardsCount; i++) {
                const category = await this.getCategoryOnUnit(i);
                if (category !== expectedCategory) {
                    console.warn(`Mismatched category: ${category}, expected ${expectedCategory}`);
                    return false;
                }
            }
            return true;
        }
    }

    async clickOnWaitingsAnnouncementsTab() {
        await this.waitingsAnnouncementsTab.click();
        await this.page.waitForLoadState('load');
    }

    async getFirstUnitNameText() {
        return await this.unitName.first().innerText();
    }

    async clickOnActiveAnnouncementsTab() {
        await this.activeAnnouncementsTab.click();
        await this.page.waitForLoadState('load')
    }

    async getUnitCardsLength() {
        const cards = await this.unitCards.all();
        const unitCardsLength = cards.length;
        return unitCardsLength;
    }

    async clickOnEditUnitBtn() {
        await this.editUnitBtn.first().click();
        await this.page.waitForTimeout(1000);
    }

    async clickOnEditWaitingsUnitBtn() {
        await this.editWaitingsUnitBtn.first().click();
        await this.page.waitForLoadState('load');
    }

    async verifyEditedUnitExludedFromUnitCards(unitName: string) {
        const unitCardsNames = await this.unitCards.allInnerTexts();
        let editedUnitName = '';

        for (const currentUnitName of unitCardsNames) {
            if (currentUnitName === unitName) {
                editedUnitName = currentUnitName;
                return editedUnitName;
            }
        }
        return editedUnitName;
    }
}

export default OwnerUnitsPage;