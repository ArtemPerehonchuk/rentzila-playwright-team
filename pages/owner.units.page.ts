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
    clearFavoritesBtn = this.page.locator('button[class*="OwnerFavouriteUnitsPage_removeList_"]');
    clearFavoritesPopup = this.page.locator('[class*="DialogPopup_content_"]');
    clearFavoritesPopupConfirmBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]', { hasText: 'Так' });
    clearFavoritesPopupCancelBtn = this.page.locator('[class*="ItemButtons_lightRedBtn_"]');
    clearFavoritesPopupCloseIcon = this.page.locator('[class*="PopupLayout_closeIcon_"]');
    unitsEmptyTitle = this.page.getByTestId('title');
    unitsEmptyMsg = this.page.getByTestId('descr');
    toProductsBtn = this.page.getByTestId('emptyBlockButton');
    resetFiltersBtn = this.page.getByTestId('emptyBlockButton').filter({ hasText: 'Скинути фільтри' });
    unitSearchInput = this.page.locator('div[data-testid="search"] input');
    paginationNumBtn = this.page.locator('a[class*="Pagination_page_"]');
    paginationPrevBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="prev"]');
    paginationNextBtn = this.page.locator('a[class*="Pagination_arrow_"][rel="next"]');
    unitCategorySelect = this.page.getByTestId('div_CustomSelect').nth(0);
    selectFieldItem = this.page.getByTestId('item-customSelect')

    getPaginationBtnWithIndex(index: number) {
        const number = index - 1;
        const paginationBtn = this.paginationNumBtn.nth(number);
        return paginationBtn
    }

    getSelectItemWithText(text: string) {
        const item = this.selectFieldItem.filter({ hasText: text });
        return item
    }

    getUnitCardByTitle(title: string) {
        const unitCard = this.unitCards.filter({ has: this.unitName.filter({ hasText: title }) });
        return unitCard
    }

    async clickFavoriteBtnOnUnit(title: string) {
        const favBtn = this.getUnitCardByTitle(title).locator(this.favoriteBtn);
        await favBtn.click();
    }

    async getCategoryOnUnit(index: number) {
        const unitCard = this.unitCards.nth(index);
        const category = (await unitCard.locator(this.unitCategory).innerText()).split('/')[0].trim();
        return category
    }

    async verifyAllUnitsDisplayedWithCategory(expectedCategory: string) {
        try {
            const unitCardsCount = await this.getUnitCardsLength();

            if (unitCardsCount === 0) {
                throw new Error("No unit cards found");
            }
            for (let i = 0; i < unitCardsCount; i++) {
                const category = await this.getCategoryOnUnit(i);
                expect(category).toBe(expectedCategory);
            }

        } catch (error) {
            if (error instanceof Error && error.message === "No unit cards found") {
                console.warn(`No units found for category ${expectedCategory}`);
                await expect(this.unitsEmptyTitle).toHaveText(`Оголошення в категорії "${expectedCategory}" не знайдені`);
                await expect(this.unitsEmptyMsg).toHaveText("Ви можете змінити пошуковий запит або скинути всі фільтри");
            } else {
                throw error; 
            }
        }
    }

    async verifyFavoriteStatusOnUnit(title: string, status: 'active' | 'inactive') {
        const favStatusColor = await this.getUnitCardByTitle(title).locator(this.favoriteIndicator).getAttribute('stroke');
        if (status === 'active') {
            expect(favStatusColor).toEqual("#F73859");
        } else if (status === 'inactive') {
            expect(favStatusColor).toEqual("#404B69");
        }
    }

    async clearFavoritesIfVisible() {
        try {
            await this.clearFavoritesBtn.waitFor({ timeout: 3000 });
            const isVisible = await this.clearFavoritesBtn.isVisible();

            if (isVisible) {
                await this.clearFavoritesBtn.click();
                await this.clearFavoritesPopupConfirmBtn.click();
            }
            return isVisible;
        } catch (error) { }
    }

    async enterUnitSearch(text: string, caseOption: 'uppercase' | 'lowercase' | 'paste' | 'default' = 'default') {
        let formattedText = text;

        if (caseOption == 'uppercase') {
            formattedText = text.toUpperCase();
        } else if (caseOption == 'lowercase') {
            formattedText = text.toLowerCase();
        } else if (caseOption == 'paste') {
            await this.page.evaluate(async (text) => {
                await navigator.clipboard.writeText(text);
            }, text);

            await this.unitSearchInput.clear();
            await this.unitSearchInput.click();
            await this.page.keyboard.press(process.platform === 'darwin' ? 'Meta+V' : 'Control+V');
            return
        }
        await this.unitSearchInput.fill(formattedText);
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