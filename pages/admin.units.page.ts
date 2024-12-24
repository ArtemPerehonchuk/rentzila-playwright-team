import { Page as PlaywrightPage, expect, Locator } from '@playwright/test';
import Page from './page';
import HomePage from './home.page';
import AdminMainPage from './admin.main.page';

const homepageUrl: string = process.env.HOMEPAGE_URL || '';
const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || '';

class AdminUnitsPage extends Page {
    homepage: HomePage;
    adminMainPage: AdminMainPage;

    constructor(page: PlaywrightPage) {
        super(page);
        this.homepage = new HomePage(page);
        this.adminMainPage = new AdminMainPage(page);
    }

    readonly announcementsTitle: Locator = this.page.locator('[class*="AdminLayout_title"]');
    readonly allUnitsTab: Locator = this.page.locator('[data-testid="statusBtns"]').first();
    readonly waitingsTab: Locator = this.page.locator('[data-testid="statusBtns"]').nth(1);
    readonly activesTab: Locator = this.page.locator('[data-testid="statusBtns"]').nth(2);
    readonly statusColumn: Locator = this.page.locator('[class*="AdminTableRowUnits_status"]');
    readonly serachUnitInput: Locator = this.page.locator('[data-testid="input"]');
    readonly unitNameCell: Locator = this.page.locator('td[class*="MuiTableCell-root"]').nth(1);
    readonly adminWatchUnitIcon: Locator = this.page.locator('[data-testid="adminShowButton"]');
    readonly sortDateBtn: Locator = this.page.locator('[data-testid="ArrowDownwardIcon"]').nth(6);
    readonly adminShowIcon: Locator = this.page.locator('[data-testid="adminOkoButton"]');

    async clickOnWaitingsTab() {
        await this.waitingsTab.click();
        await this.page.waitForLoadState('load');
    }

    async clickOnActivesTab() {
        await this.activesTab.click();
        await this.page.waitForLoadState('load');
    }

    async clickOnAllUnitsTab() {
        await this.allUnitsTab.click();
        await this.page.waitForLoadState('load');
    }

    async getStatusColumnItemsLength() {
        const statusColumnItems = await this.statusColumn.all();
        return statusColumnItems.length
    }

    async getStatusColumnTexts() {
        return await this.statusColumn.allInnerTexts();
    }

    async fillSearchInput(value: string) { 
        await this.serachUnitInput.type(value);
        await this.page.waitForLoadState('load');
    }

    async verifyEditedUnitPresentsInWaitingsTab(expectedUnitTab: string, unitName: string) {
        await this.homepage.logoutUser();
    
        await this.homepage.loginUser(ADMIN_EMAIL, ADMIN_PASSWORD);
    
        await expect(this.adminMainPage.adminPanelIcon).toBeVisible();
    
        await this.adminMainPage.clickOnAdminPanelIcon();
    
        await expect(this.adminMainPage.adminPanelTitle).toBeVisible();
        await expect(this.adminMainPage.adminPanelTitle).toHaveText('Панель стану');
    
        await this.adminMainPage.clickOnAnnouncementsMenuItem();
        await this.sortDateBtn.click({force: true});
        await this.page.waitForTimeout(1000);
    
        const adminUnitsPageUrl = await this.getUrl();
    
        await expect(adminUnitsPageUrl).toContain('units');
        await expect(this.announcementsTitle).toBeVisible();
        await expect(await this.announcementsTitle).toHaveText('Оголошення');
        await expect(this.allUnitsTab).toBeVisible();
        await expect(await this.allUnitsTab).toHaveText('Всі');
        await expect(this.allUnitsTab).toHaveCSS('background-color', 'rgb(40, 49, 73)');
    
        if(expectedUnitTab === 'waitings') {
            await this.clickOnWaitingsTab();

            await expect(this.waitingsTab).toHaveCSS('background-color', 'rgb(40, 49, 73)');
        }else if(expectedUnitTab === 'actives') {
            await this.clickOnActivesTab();

            await expect(this.activesTab).toHaveCSS('background-color', 'rgb(40, 49, 73)');
        }
        
        await this.sortDateBtn.click();
        await this.page.waitForTimeout(1000);
        await this.fillSearchInput(unitName);
        await this.page.waitForTimeout(1000);

        if(!await this.unitNameCell.isVisible()) {
            await this.clickOnAllUnitsTab();
        }
    
        await expect(this.unitNameCell).toHaveText(unitName);
    }

    async clickOnAdminWatchUnitIcon() {
        await this.adminWatchUnitIcon.first().click();
        await this.page.waitForLoadState('load');
    }

    async clickOnAdminShowIcon() {
        await this.adminShowIcon.first().click();
        await this.page.waitForLoadState('load');
    }
}

export default AdminUnitsPage;