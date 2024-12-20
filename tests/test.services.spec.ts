import { test, expect } from "../fixtures";

const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';

test.beforeEach(async ({ homepage }) => {
    await homepage.navigate('/');
});

test('test case c212: Checking "Послуги" section on the main page', async ({ page, homepage, productsPage, unitPage }) => {
    const servicesList = homepage.servicesList;
    const servicesCount = await servicesList.count();
    let firstServicesUnitName;

    await homepage.closePopUpBtn.click();

    for (let i = 0; i < servicesCount; i++) {
        await page.waitForLoadState('domcontentloaded')
        await homepage.servicesContainer.waitFor({state: 'visible'});
        await homepage.scrollToServicesContainer();

        await expect(homepage.servicesContainer).toBeVisible();
        await expect(await homepage.servicesUnitsList.count()).toBe(7);

        await servicesList.nth(i).click();

        firstServicesUnitName = await homepage.getFirstServicesUnitName();

        await homepage.clickFirstServicesUnit();

        let filterIsVisible = await productsPage.productFilterItem.isVisible();

        if(filterIsVisible) {
            await expect(productsPage.productFilterItem).toHaveText(firstServicesUnitName)
        }

        const productsListIsVisible = await productsPage.produtsList.first().isVisible();

        if(productsListIsVisible) {
            await productsPage.clickFirstProduct();
            await expect(await unitPage.checkUnitIsVisible()).toBe(true);

            await unitPage.clickOnLogo();

            await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);

            await homepage.announcementsNavMenuItem.click({force: true});

            filterIsVisible = await productsPage.productFilterItem.isVisible();

            if(filterIsVisible) {
                await expect(productsPage.productFilterItem).toBeVisible();
            }

        }

        await productsPage.clickOnLogo()
    }
})

test('test case c213: Checking "Спецтехніка" section on the main page', async ({ homepage, productsPage, unitPage }) => {
    const specialEquipmentsList = homepage.specialEquipmentsList;
    const specialEquipmentsCount = await specialEquipmentsList.count();

    for (let i = 0; i < specialEquipmentsCount; i++) {
        await homepage.scrollToSpecialEquipmentContainer();

        await expect(homepage.specialEquipmentContainer).toBeVisible();
        await expect(await homepage.specialEquipmentsUnitsList.count()).toBe(7);

        await specialEquipmentsList.nth(i).click({force: true});

        await homepage.clickFirstSpecialEquipmentUnit();

        await expect(productsPage.productFilterItem).toBeVisible();
        await expect(await productsPage.checkCategoriesCheckboxesAreChecked()).toBe(true);
        await expect(productsPage.unitsContainer).toBeVisible();

        const productsListIsVisible = await productsPage.produtsList.first().isVisible();

        if(productsListIsVisible){
            await productsPage.clickFirstProduct();

            await expect(await unitPage.checkUnitIsVisible()).toBe(true);

            await unitPage.clickOnLogo();

            await expect(await homepage.getUrl()).toBe(HOMEPAGE_URL);

            await homepage.announcementsNavMenuItem.click({force: true});
            
            await expect(await productsPage.checkCategoriesCheckboxesAreChecked()).toBe(true);}
        }

        await productsPage.clickOnLogo()
})