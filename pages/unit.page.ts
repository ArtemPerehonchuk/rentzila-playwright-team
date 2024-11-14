import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class UnitPage extends Page {
    
    constructor(page: PlaywrightPage) {
        super(page);
    }

    unitServicesTitle = this.page.locator('[class*="UnitCharacteristics_services"] [class*="UnitCharacteristics_title"]');
    unitServicesTypesContainer = this.page.locator('[itemprop="services"]');

    async checkUnitIsVisible(isExist: boolean = true) {
        if(isExist) {
            await expect(this.unitServicesTitle).toBeVisible()
            await expect(this.unitServicesTypesContainer).toBeVisible()
            return true
        }else return false
    }
}

export default UnitPage;