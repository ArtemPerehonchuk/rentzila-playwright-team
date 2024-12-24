import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class OwnerUnitsPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly firstUnitName: Locator = this.page.locator('[class*="OwnerUnitCard_name"]').first();
    readonly activeAnnouncementsTab: Locator = this.page.locator('button[id*="Активні"]');
    readonly waitingsAnnouncementsTab: Locator = this.page.locator('button[id*="Очікуючі"]');
    readonly activeAnnouncementsTabTitle: Locator = this.page.locator('[data-testid="title"]');
    readonly unitCards: Locator = this.page.locator('[class*="OwnerUnitCard_container"]');
    readonly editUnitBtn: Locator = this.page.locator('[class*="ItemButtons_lightBlueBtn"]');
    readonly editWaitingsUnitBtn: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    readonly firstWaitingsUnit: Locator = this.page.locator('[class*="OwnerUnitCard_container"]').first();

    async clickOnWaitingsAnnouncementsTab() {
        await this.waitingsAnnouncementsTab.click();
        await this.page.waitForLoadState('load');
    }

    async getFirstUnitNameText(): Promise<string> {
        return await this.firstUnitName.innerText();
    }

    async clickOnActiveAnnouncementsTab() {
        await this.activeAnnouncementsTab.click();
        await this.page.waitForLoadState('load')
    }

    async getUnitCardsLength(): Promise<number> {
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
}

export default OwnerUnitsPage;