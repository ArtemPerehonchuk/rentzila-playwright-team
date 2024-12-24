import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class AdminUnitReviewPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly manufacturerField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(2);
    readonly modelNameField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(3);
    readonly technicalCharacteristicsField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(4);
    readonly detailDescriptionField: Locator = this.page.locator('[class*="AdminCurrentUnit_info_content"]').nth(5);
    readonly locationField: Locator = this.page.locator('div[class*="AdminCurrentUnit_info_content"] > span');
    readonly unitPhoto: Locator = this.page.locator('[data-testid="imagePreviewBtn"] > img');
    readonly unitService: Locator = this.page.locator('[data-testid="customServiceBtn"]');
    readonly minPriceField: Locator = this.page.locator('[class*="AdminCurrentUnit_minimalPrice"]').first();
    readonly workTypeField: Locator = this.page.locator('[class*="AdminCurrentUnit_workType"]');
    readonly approveChangesBtn: Locator = this.page.locator('[data-testid="approveBtn"]');

    async getLocationFieldText(): Promise<string> {
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