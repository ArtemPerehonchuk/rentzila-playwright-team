import { test, expect } from "../fixtures";

const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';

test.beforeEach(async ({ homePage }) => {
    await homePage.navigate('/');
});

test('test case c212: Checking "Послуги" section on the main page', async ({ page, homePage, productsPage, unitPage }) => {
    const servicesList = homePage.servicesList;
    const servicesCount = await servicesList.count();
    let firstServicesUnitName;

    await homePage.closePopUpBtn.click();

    for (let i = 0; i < servicesCount; i++) {
        await page.waitForLoadState('domcontentloaded')
        await homePage.servicesContainer.waitFor({state: 'visible'});
        await homePage.scrollToServicesContainer();

        await expect(homePage.servicesContainer).toBeVisible();
        await expect(await homePage.servicesUnitsList.count()).toBe(7);

        await servicesList.nth(i).click();

        firstServicesUnitName = await homePage.getFirstServicesUnitName();

        await homePage.clickFirstServicesUnit();

        let filterIsVisible = await productsPage.productFilterItem.isVisible();

        if(filterIsVisible) {
            await expect(productsPage.productFilterItem).toHaveText(firstServicesUnitName)
        }

        const productsListIsVisible = await productsPage.produtsList.first().isVisible();

        if(productsListIsVisible) {
            await productsPage.clickFirstProduct();
            await expect(await unitPage.checkUnitIsVisible()).toBe(true);

            await unitPage.clickOnLogo();

            await expect(await homePage.getUrl()).toBe(HOMEPAGE_URL);

            await homePage.announcementsNavMenuItem.click({force: true});

            filterIsVisible = await productsPage.productFilterItem.isVisible();

            if(filterIsVisible) {
                await expect(productsPage.productFilterItem).toBeVisible();
            }

        }

        await productsPage.clickOnLogo()
    }
})

test('test case c213: Checking "Спецтехніка" section on the main page', async ({ homePage, productsPage, unitPage }) => {
    const specialEquipmentsList = homePage.specialEquipmentsList;
    const specialEquipmentsCount = await specialEquipmentsList.count();

    for (let i = 0; i < specialEquipmentsCount; i++) {
        await homePage.scrollToSpecialEquipmentContainer();

        await expect(homePage.specialEquipmentContainer).toBeVisible();
        await expect(await homePage.specialEquipmentsUnitsList.count()).toBe(7);

        await specialEquipmentsList.nth(i).click({force: true});

        await homePage.clickFirstSpecialEquipmentUnit();

        await expect(productsPage.productFilterItem).toBeVisible();
        await expect(await productsPage.checkCategoriesCheckboxesAreChecked()).toBe(true);
        await expect(productsPage.unitsContainer).toBeVisible();

        const productsListIsVisible = await productsPage.produtsList.first().isVisible();

        if(productsListIsVisible){
            await productsPage.clickFirstProduct();

            await expect(await unitPage.checkUnitIsVisible()).toBe(true);

            await unitPage.clickOnLogo();

            await expect(await homePage.getUrl()).toBe(HOMEPAGE_URL);

            await homePage.announcementsNavMenuItem.click({force: true});
            
            await expect(await productsPage.checkCategoriesCheckboxesAreChecked()).toBe(true);}
        }

        await productsPage.clickOnLogo()
})