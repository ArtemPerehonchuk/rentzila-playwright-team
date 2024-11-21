import { Page as PlaywrightPage } from '@playwright/test';
import Page from './page';

class OwnerUnitsPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    firstUnitName = this.page.locator('[class*="OwnerUnitCard_name"]').first();
    activeAnnouncementsTab = this.page.locator('button[id*="Активні"]');
    waitingsAnnouncementsTab = this.page.locator('button[id*="Очікуючі"]');
    activeAnnouncementsTabTitle = this.page.locator('[data-testid="title"]');
    unitCards = this.page.locator('[class*="OwnerUnitCard_container"]');
    editUnitBtn = this.page.locator('[class*="ItemButtons_lightBlueBtn"]');
    editWaitingsUnitBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    firstWaitingsUnit = this.page.locator('[class*="OwnerUnitCard_container"]').first();

    async clickOnWaitingsAnnouncementsTab() {
        await this.waitingsAnnouncementsTab.click();
        await this.page.waitForLoadState('load');
    }

    async getFirstUnitNameText() {
        return await this.firstUnitName.innerText();
    }

    async clickOnActiveAnnouncementsTab() {
        await this.activeAnnouncementsTab.click();
        await this.page.waitForLoadState('load')
    }

    async getUnitCardsLength() {
        const cards =  await this.unitCards.all();
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

        for(const currentUnitName of unitCardsNames) {
            if(currentUnitName === unitName) {
                editedUnitName = currentUnitName;
                return editedUnitName;
            }
        }
        return editedUnitName;
    }

    async clickOnFirstWaitingsUnit() {
        await this.firstWaitingsUnit.click();
    }
}

export default OwnerUnitsPage;