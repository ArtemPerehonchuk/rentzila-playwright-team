import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class AdminMainPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    adminPanelIcon = this.page.locator('[data-testid="superuserIcon_Navbar"]');
    announcementsMenuItem = this.page.locator('a[href="/admin/units/"]');
    searchUnitInput = this.page.locator('[data-testid="input"]');
    adminShowUnitDetailsBtn = this.page.locator('[data-testid="adminShowButton"]').first();
    aproveUnitBtn = this.page.locator('[data-testid="approveBtn"]');
    homeBtn = this.page.locator('[data-testid="homeButton"]');
    adminPanelTitle = this.page.locator('[class*="AdminLayout_title"]');
    dateSortContainer = this.page.locator('[class*="MuiTableCell-head "]').nth(6);
    dateSortBtn = this.page.locator('[data-testid="ArrowDownwardIcon"]').nth(6);
    searchedUnitStatus = this.page.locator('[class*="AdminTableRowUnits_status"]').first();

    async moveAnnouncementToActiveState(unitId: string) {
        await this.clickOnAdminPanelIcon();
        await this.clickOnAnnouncementsMenuItem();
        await this.page.waitForLoadState('load');
        await this.dateSortBtn.click({force: true});
        await this.page.waitForTimeout(1000);
        await this.searchUnitInput.type(unitId);
        await this.page.waitForSelector(`th[id^="enhanced-table-checkbox"] >> text=${unitId}`);

        const unitStatus = await this.searchedUnitStatus.innerText();

        if(unitStatus !== 'Активне') {
            await this.adminShowUnitDetailsBtn.click({force: true});
            await this.page.waitForTimeout(2000);
            await this.aproveUnitBtn.click({force: true});
            await this.page.waitForTimeout(2000);    
        }
        await this.homeBtn.click({force: true});
        await this.page.waitForTimeout(1000);
    }

    async clickOnAdminPanelIcon() {
        await this.adminPanelIcon.click();
    }

    async clickOnAnnouncementsMenuItem() {
        const navigationPromise = new Promise<void>(resolve => {
            this.page.on('framenavigated', frame => {
                if (frame === this.page.mainFrame()) { 
                    resolve();
                }
            });
        });
    
        await this.announcementsMenuItem.click(); 
        await navigationPromise; 
        await this.page.waitForLoadState('load');
    }
}

export default AdminMainPage;