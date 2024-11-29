import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class AdminUnitReviewPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    manufacturerField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(2);
    modelNameField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(3);
    technicalCharacteristicsField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(4);
    detailDescriptionField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(5);
    locationField: Locator = this.page.locator('div[class*="AdminCurrentUnit_info_content"] > span');
    unitPhoto: Locator = this.page.locator('[data-testid="imagePreviewBtn"] > img');
    unitService: Locator = this.page.locator('[data-testid="customServiceBtn"]');
    minPriceField: Locator = this.page.locator('[class*="AdminCurrentUnit_minimalPrice"]').first();
    workTypeField: Locator = this.page.locator('[class*="AdminCurrentUnit_workType"]');
    approveChangesBtn: Locator = this.page.locator('[data-testid="approveBtn"]');

    async getLocationFieldText() {
        const text = await this.locationField.evaluate(element => 
            element.textContent?.replace(/\s+/g, ' ').trim() || ''
        );
    
        return text;
    }

    async clickOnApproveChangesBtn() {
        await this.approveChangesBtn.click();
    }
}

export default AdminUnitReviewPage;