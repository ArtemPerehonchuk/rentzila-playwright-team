import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class AdminMainPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly announcementsMenuItem : Locator= this.page.locator('a[href="/admin/units/"]');
    readonly searchUnitInput : Locator= this.page.locator('[data-testid="input"]');
    readonly adminPanelIcon : Locator= this.page.locator('[data-testid="superuserIcon_Navbar"]');
    readonly adminShowUnitDetailsBtn : Locator= this.page.locator('[data-testid="adminShowButton"]').first();
    readonly aproveUnitBtn : Locator= this.page.locator('[data-testid="approveBtn"]');
    readonly homeBtn : Locator= this.page.locator('[data-testid="homeButton"]');
    readonly adminPanelTitle : Locator= this.page.locator('[class*="AdminLayout_title"]');
    readonly dateSortContainer : Locator= this.page.locator('[class*="MuiTableCell-head "]').nth(6);
    readonly dateSortBtn : Locator= this.page.locator('[data-testid="ArrowDownwardIcon"]').nth(6);
    readonly searchedUnitStatus: Locator = this.page.locator('[class*="AdminTableRowUnits_status"]').first();

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