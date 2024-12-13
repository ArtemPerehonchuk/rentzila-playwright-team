import { test, expect, request, APIRequestContext } from "@playwright/test";
import HomePage from '../pages/home.page';
import OwnerUnitsPage from '../pages/owner.units.page';
import AdminMainPage from '../pages/admin.main.page';
import EditUnitPage from '../pages/edit.unit.page';
import AdminUnitsPage from '../pages/admin.units.page';
import AdminUnitReviewPage from '../pages/admin.unit.review.page';
import ApiHelper from "../helpers/api.helper";
import UnitDetailsPage from '../pages/unit.details.page';
import { faker } from "@faker-js/faker";
import testData from '../data/test_data.json' assert {type: 'json'};

let apiRequestContext: APIRequestContext;
let homepage: HomePage;
let ownerUnitsPage: OwnerUnitsPage;
let adminMainPage: AdminMainPage;
let editUnitPage: EditUnitPage;
let adminUnitsPage: AdminUnitsPage;
let adminUnitReviewPage: AdminUnitReviewPage;
let unitDetailsPage: UnitDetailsPage;
let apiHelper: ApiHelper;
let accessUserToken: string;
let accessAdminToken: string;

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || '';

let unitName: string;
let createdUnitId: number;
let activeUnitName: string;
let editedUnitName: string;

test.beforeAll(async () => {
    apiRequestContext = await request.newContext();
    apiHelper = new ApiHelper(apiRequestContext);
    accessUserToken = await apiHelper.createUserAccessToken(); 
    accessAdminToken = await apiHelper.createAdminAccessToken();
});

test.afterAll(async () => {
    await apiHelper.deleteAllUnits(accessUserToken)
});

test.beforeEach(async ({ page }) => {
    homepage = new HomePage(page, apiRequestContext);
    ownerUnitsPage = new OwnerUnitsPage(page);
    adminMainPage = new AdminMainPage(page);
    editUnitPage = new EditUnitPage(page);
    adminUnitsPage= new AdminUnitsPage(page);
    adminUnitReviewPage = new AdminUnitReviewPage(page);
    unitDetailsPage = new UnitDetailsPage(page);
    
    await homepage.navigate('/');
    await homepage.clickOnClosePopUpBtn();
    await homepage.clickOnEnterBtn()
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();

    unitName = faker.string.alpha({length: 15});

    await homepage.clickOnUserIcon();
    await homepage.clickOnProfileMyAnnouncementsItem();
    
    await expect(ownerUnitsPage.page).toHaveURL(/owner-units-page/);

    await ownerUnitsPage.clickOnActiveAnnouncementsTab();

    if(await ownerUnitsPage.activeAnnouncementsTabTitle.isVisible()) {
        await apiHelper.createUnit(accessUserToken, unitName);

        createdUnitId = await apiHelper.getUnitId(accessUserToken, unitName);

        await apiHelper.uploadUnitPhoto(accessUserToken, createdUnitId);
        await homepage.logoutUser();
        await homepage.loginUser(ADMIN_EMAIL, ADMIN_PASSWORD);
        await adminMainPage.moveAnnouncementToActiveState(createdUnitId.toString());
        await homepage.logoutUser();
        await homepage.loginUser(VALID_EMAIL, VALID_PASSWORD);
        await homepage.clickOnUserIcon();
        await homepage.clickOnProfileMyAnnouncementsItem();
        await ownerUnitsPage.clickOnActiveAnnouncementsTab();
    }
    editedUnitName = await ownerUnitsPage.getFirstUnitNameText();
});

test('Test case C182: Edit Unit without changes', async({page}) => {
    const unitCardsLength = await ownerUnitsPage.getUnitCardsLength();

    if(unitCardsLength === 0) {
        await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    }

    activeUnitName = await ownerUnitsPage.getFirstUnitNameText();

    await expect(unitCardsLength).not.toBe('');
    
    await ownerUnitsPage.clickOnEditUnitBtn();

    await expect(editUnitPage.page).toHaveURL(/edit-unit/);

    await editUnitPage.clickOnCancelUnitChangesBtn();

    await expect(ownerUnitsPage.page).toHaveURL(/owner-units-page/);

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.clickOnLookInMyAnnouncementsBtn();

    if(unitCardsLength === 1) {
        await expect(ownerUnitsPage.activeAnnouncementsTabTitle).toBeVisible();
        await expect(await ownerUnitsPage.activeAnnouncementsTabTitle).toHaveText('У Вас поки немає активних оголошень');
        await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', activeUnitName);
    }else if(unitCardsLength > 0 && unitCardsLength !== 1) {
        const editedUnitName = await ownerUnitsPage.verifyEditedUnitExludedFromUnitCards(unitName);

        await expect(editedUnitName).toBe('');
        await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('actives', activeUnitName)
    }

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C272: Check ""Назва оголошення"" input field', async({page}) => {
    const nineCharStr = faker.string.alpha({length: 9});
    const over100CharStr = faker.string.alpha({length: 101});
    const tenCharStr = faker.string.alpha({length: 10});
    const inputValues = [
        '<>{};^',
        nineCharStr,
        over100CharStr
    ];

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clearUnitNameInput();
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.unitNameInputError).toBeVisible();
    await expect(editUnitPage.unitNameInputError).toHaveText('Це поле обов’язкове');

    for(const inputValue of inputValues) {
        await editUnitPage.fillUnitNameInput(inputValue);
        await editUnitPage.clickOnSaveUnitChangesBtn();

        switch(inputValue) {
            case '<>{};^':
                await expect(editUnitPage.unitNameInput).toHaveText('', {useInnerText: true});
                await expect(editUnitPage.unitNameInput).toHaveAttribute('placeholder', 'Введіть назву оголошення');
                break

            case nineCharStr:
                await expect(editUnitPage.unitNameInputError).toBeVisible();
                await expect(editUnitPage.unitNameInputError).toHaveText('У назві оголошення повинно бути не менше 10 символів');
                break

            case over100CharStr:
                await expect(editUnitPage.unitNameInputError).toBeVisible();
                await expect(editUnitPage.unitNameInputError).toHaveText('У назві оголошення може бути не більше 100 символів');
                break
        }
    }

    await editUnitPage.clearUnitNameInput();

    await editUnitPage.fillUnitNameInput(tenCharStr);

    await expect(editUnitPage.unitNameInputError).not.toBeVisible();

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', tenCharStr);

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C273: Check ""Виробник транспортного засобу"" input field', async({page}) => {
    const randomString = faker.string.alpha({length: 15});
    const randomChar = faker.string.alpha({length: 1});

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clickOnVehicleManufacturerInputCloseIcon();

    await expect(editUnitPage.vehicleManufacturerInput).toHaveAttribute('placeholder', 'Введіть виробника транспортного засобу');

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.vehicleManufacturerInputError).toBeVisible();
    await expect(editUnitPage.vehicleManufacturerInputError).toHaveText('Це поле обов’язкове');

    await editUnitPage.fillVehicleManufacturerInput('<>{};^');

    await expect(editUnitPage.unitNameInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillVehicleManufacturerInput(randomString);

    await expect(editUnitPage.vehicleManufacturerNotFoundMsg).toBeVisible();

    const capitalizedRandomString = randomString.charAt(0).toUpperCase() + randomString.slice(1);

    await expect(editUnitPage.vehicleManufacturerNotFoundMsg).toHaveText(`На жаль, виробника “${capitalizedRandomString}“ не знайдено в нашій базі.
Щоб додати виробника - зв\`яжіться із службою підтримки`);

    await editUnitPage.clearVehicleManufacturerInput();
    await editUnitPage.fillVehicleManufacturerInput(randomChar);

    await expect(editUnitPage.vehicleManufacturerDropDown).toBeVisible();

    await editUnitPage.selectFirstVehicleManufacturerOption();

    const selectedOptionText = await editUnitPage.getVehicleManufacturerInputSelectedOptionText();

    await expect(editUnitPage.vehicleManufacturerInputError).not.toBeVisible();
    await expect(editUnitPage.vehicleManufacturerInputCloseIcon).toBeVisible();

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    const activeTabClass = await adminUnitsPage.activesTab.getAttribute('class')

    if(activeTabClass?.includes('AdminUnits_active')) {
        await adminUnitsPage.clickOnAdminShowIcon();
    }else{
        await adminUnitsPage.clickOnAdminWatchUnitIcon();
    }

    await expect(adminUnitReviewPage.manufacturerField).toHaveText(selectedOptionText);
    
    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C532: "Check ""Назва моделі"" input field', async({page}) => {
    const random15CharString = faker.string.alpha({length: 15});
    const random16CharString = faker.string.alpha({length: 16});

    await ownerUnitsPage.clickOnEditUnitBtn();

    await expect(editUnitPage.modelNameInput).toHaveAttribute('placeholder', 'Введіть назву моделі');

    await editUnitPage.fillModelNameInput('<>{};^');

    await expect(editUnitPage.modelNameInput).toHaveValue('');

    await editUnitPage.fillModelNameInput(random16CharString);

    await expect(editUnitPage.modelNameInputError).toBeVisible();
    await expect(editUnitPage.modelNameInputError).toHaveText('У назві моделі може бути не більше 15 символів')

    await editUnitPage.fillModelNameInput(random15CharString);

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    const activeTabClass = await adminUnitsPage.activesTab.getAttribute('class')

    if(activeTabClass?.includes('AdminUnits_active')) {
        await adminUnitsPage.clickOnAdminShowIcon();
    }else{
        await adminUnitsPage.clickOnAdminWatchUnitIcon();
    }

    await expect(adminUnitReviewPage.modelNameField).toHaveText(random15CharString);
    
    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C533: Check ""Технічні характеристики"" input field', async({page}) => {
    const randomDescription = faker.lorem.sentence();

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clearTechnicalCharacteristicsInput();

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.clickOnLookInMyAnnouncementsBtn();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    await ownerUnitsPage.clickOnEditWaitingsUnitBtn();

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillTechnicalCharacteristicsInput('<>&{};^');

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillTechnicalCharacteristicsInput(randomDescription);
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    const activeTabClass = await adminUnitsPage.activesTab.getAttribute('class')

    if(activeTabClass?.includes('AdminUnits_active')) {
        await adminUnitsPage.clickOnAdminShowIcon();
    }else{
        await adminUnitsPage.clickOnAdminWatchUnitIcon();
    }

    await expect(adminUnitReviewPage.technicalCharacteristicsField).toHaveText(randomDescription);

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C534: Check ""Опис"" input field', async({page}) => {
    const randomDescription = faker.lorem.sentence();

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clearDetailDescriptionInput();

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.clickOnLookInMyAnnouncementsBtn();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    await ownerUnitsPage.clickOnEditWaitingsUnitBtn();

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillDetailDescriptionInput('<>&{};^');

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillDetailDescriptionInput(randomDescription);
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    const activeTabClass = await adminUnitsPage.activesTab.getAttribute('class');

    if(activeTabClass?.includes('AdminUnits_active')) {
        await adminUnitsPage.clickOnAdminShowIcon();
    }else{
        await adminUnitsPage.clickOnAdminWatchUnitIcon();
    }

    await expect(adminUnitReviewPage.detailDescriptionField).toHaveText(randomDescription);

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C535: Check ""Місце розташування технічного засобу"" functionality', async({page}) => {

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clickOnSelectOnMapBtn();

    await expect(editUnitPage.mapPopUp).toBeVisible();
    
    let initialZoomValue = await editUnitPage.getMapZoomValue();

    await editUnitPage.clickOnMapPopUpZoomInBtn();

    let zoomInValue = await editUnitPage.getMapZoomValue();

    await expect(initialZoomValue).not.toBe(zoomInValue);

    await editUnitPage.clickOnMapPopUpZoomOutBtn();

    let zoomOutValue = await editUnitPage.getMapZoomValue();

    await expect(zoomInValue).not.toBe(zoomOutValue);

    await editUnitPage.scrollMouseOnMap(100);

    let scrolledZoomOutValue = await editUnitPage.getMapZoomValue();

    await expect(scrolledZoomOutValue).not.toBe(zoomOutValue);

    await editUnitPage.scrollMouseOnMap(-100);

    let scrolledZoomInValue = await editUnitPage.getMapZoomValue();

    await expect(scrolledZoomInValue).not.toBe(scrolledZoomOutValue);

    const initialLocation = await editUnitPage.getMapPopUpLocationText();
    let choosenLocation;

    do{
        await editUnitPage.clickOnMap();
        choosenLocation = await editUnitPage.getMapPopUpLocationText();
    }while(choosenLocation.includes('Ентузіастів'));

    await expect(choosenLocation).not.toBe(initialLocation);

    await editUnitPage.clickOnMapPopUpConfirmChoiseBtn();

    await expect(editUnitPage.page).toHaveURL(/edit-unit/);
    await expect(editUnitPage.mapPopUp).not.toBeVisible();
    await expect(editUnitPage.vehicleLocation).toHaveText(choosenLocation);

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();
})

test('Test case C274: Check image section functionality', async({page}) => {
    await ownerUnitsPage.clickOnEditUnitBtn();

    await editUnitPage.uploadMissingPhotos();
    
    for(let i = 0; i < 4; i ++) {
        let mainImgSrc = await editUnitPage.getImgSrcAttr(1);
        let secondImgSrc = await editUnitPage.getImgSrcAttr(2);

        await expect(mainImgSrc).not.toBe(secondImgSrc);

        await editUnitPage.hoverOnFirstImg();
        
        await expect(editUnitPage.editedUnitDeleteImgIcons.first()).toBeVisible();

        await editUnitPage.editedUnitImageBlocks.first().hover({force: true});
        await editUnitPage.clickOnEditedUnitDeleteImgIcon(0);

        mainImgSrc = await editUnitPage.getImgSrcAttr(1);

        await expect(mainImgSrc).toBe(secondImgSrc);
    }

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.uploadTo12PhotosErrorMsg).toBeVisible();
    await expect(editUnitPage.uploadTo12PhotosErrorMsg).toHaveText('Додайте в оголошення від 1 до 12 фото технічного засобу розміром до 20 МВ у форматі .jpg, .jpeg, .png. Перше фото буде основним.');

    expect(await editUnitPage.getFileChooser).toBeDefined();

    await editUnitPage.fileChooserSetInputFile();
    await page.waitForLoadState('domcontentloaded');

    await expect(await editUnitPage.editedUnitImageBlocks.first().getAttribute('draggable')).toBe('true');
    await expect(editUnitPage.mainImgLable).toBeVisible();

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    await adminUnitsPage.clickOnAdminWatchUnitIcon();

    await expect(page).toHaveURL(/units/);
    await expect(adminUnitReviewPage.unitPhoto).toBeVisible();
})

test('Test case C275: Check services functionality', async({page}) => {
    const over100CharStr = faker.string.alpha({length: 101});
    const randomService = faker.string.alpha({length: 20});

    await ownerUnitsPage.clickOnEditUnitBtn(); 
    await editUnitPage.removeEditedUnitService();

    await expect(editUnitPage.editedUnitService).not.toBeVisible();

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.addServiceErrorMsg).toBeVisible();
    await expect(editUnitPage.addServiceErrorMsg).toHaveText('Додайте в оголошення принаймні 1 послугу');

    await editUnitPage.fillServiceInput('<>{};^');

    await expect(editUnitPage.serviceInput).toHaveText('', {useInnerText: true});
    await expect(editUnitPage.serviceInput).toHaveAttribute('placeholder', 'Наприклад: Рихлення грунту, буріння');

    await editUnitPage.fillServiceInput(over100CharStr)

    const inputValue = await editUnitPage.serviceInput.inputValue();

    await expect(inputValue.length).toBe(100);
    
            
    await editUnitPage.fillServiceInput(randomService);

    await expect(editUnitPage.serviceNotFoundMsg).toBeVisible();
    await expect(editUnitPage.serviceNotFoundMsg).toContainText(`На жаль, послугу “${randomService}“ не знайдено в нашій базі.`);

    await editUnitPage.clickOnCreateServiceBtn();

    await expect(editUnitPage.servicesDropDownItems).toHaveText(randomService);
    await expect(editUnitPage.editedUnitService).toBeVisible();

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    await adminUnitsPage.clickOnAdminWatchUnitIcon();

    await expect(adminUnitReviewPage.unitService).toHaveText(randomService);
})

test('Test case C541: Check ""Спосіб оплати"" menu', async({page}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 

    const paymentMethods = testData['payment methods'];

    for (const paymentMethod of paymentMethods.reverse()) {
        await editUnitPage.clickOnSelectPaymentMethodInput();
    
        await expect(editUnitPage.paymentMethodsDropDown).toBeVisible();
        
        const paymentMethodDropDownItems = await editUnitPage.paymentMethodDropDownItems.allInnerTexts();
    
        await expect(paymentMethodDropDownItems).toContain(paymentMethod);
    
        const paymentMethodElement = await editUnitPage.paymentMethodDropDownItems.locator(`text=${paymentMethod}`);
        await paymentMethodElement.click();
    
        await expect(editUnitPage.selectPaymentMethodInput).toHaveText(paymentMethod);
    
        await editUnitPage.clickOnSaveUnitChangesBtn();
    
        await expect(editUnitPage.successEditUnitMsg).toBeVisible();
        await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
        await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();
    
        await editUnitPage.clickOnLookInMyAnnouncementsBtn();
        await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
        await ownerUnitsPage.unitCards.first().click();
    
        await expect(page).toHaveURL(/unit/);
        await expect(unitDetailsPage.unitsPaymentMethod).toHaveText(paymentMethod);
    
        await unitDetailsPage.clickOnEditUnitBtn();
    
        await expect(page).toHaveURL(/edit-unit/);
    }
})

test('Test case C276: Check ""Вартість мінімального замовлення"" field', async({page}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 
    await editUnitPage.clearMinOrderPriceInput();

    await expect(await editUnitPage.minOrderPriceInput.first().getAttribute('placeholder')).toBe('Наприклад, 1000');

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.unitPriceErrorMsg).toBeVisible();
    await expect(editUnitPage.unitPriceErrorMsg).toHaveText('Це поле обов\’язкове');

    const random10Digits = faker.string.numeric(10);
    const randomSpecialCharsSequence = faker.string.symbol({min: 5, max:20})

    await editUnitPage.fillMinOrderPriceInput(randomSpecialCharsSequence);

    await expect(editUnitPage.minOrderPriceInput.first()).toHaveText('');
    
        
    await editUnitPage.fillMinOrderPriceInput(random10Digits)

    const inputValue = await editUnitPage.minOrderPriceInput.first().inputValue();
    await expect(inputValue.length).toBe(9);


    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    await adminUnitsPage.clickOnAdminWatchUnitIcon();

    await expect(adminUnitReviewPage.minPriceField).toHaveText(random10Digits.slice(0, 9));
})

test('Test case C543:  Check ""Вартість мінімального замовлення"" drop-down menu', async({page}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 
    
    if (await editUnitPage.addPriceBtn.isVisible()) {
        await editUnitPage.clickOnAddPriceBtn();
    }

    const priceOptions = testData['add price options'];
    let additionalPriceItems;

    for (const priceOption of priceOptions) {
        await editUnitPage.clickOnAdditionalPriceSelect();
        await expect(editUnitPage.additionalPriceDropDpwn).toBeVisible();

        additionalPriceItems = await editUnitPage.additionalPriceDropDownItems.allInnerTexts();
        await expect(priceOptions).toContain(priceOption);

        const index = additionalPriceItems.indexOf(priceOption);
        if (index !== -1) {
            await editUnitPage.additionalPriceDropDownItems.nth(index).click();
            const selectedPriceOption = await editUnitPage.additionalPriceSelect.nth(1).innerText();
            await expect(selectedPriceOption.toLowerCase()).toBe(priceOption.toLowerCase());

            if (priceOption === 'Зміна') {
                await expect(editUnitPage.selectTimeInput).toBeVisible();
            }
        }
    }

    await editUnitPage.clickOnAdditionalPriceSelect();
    additionalPriceItems = await editUnitPage.additionalPriceDropDownItems.allInnerTexts();
    const randomAdditionalPriceItemIndex = Math.floor(Math.random() * additionalPriceItems.length);
    const randomAdditionalPriceDropDownOption = additionalPriceItems[randomAdditionalPriceItemIndex];

    await editUnitPage.additionalPriceDropDownItems.nth(randomAdditionalPriceItemIndex).click();
    await page.waitForTimeout(2000);

    await editUnitPage.additionalPriceInput.fill('1000');
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText('Вашe оголошення успішно відредаговане');
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    await adminUnitsPage.clickOnAdminWatchUnitIcon();

    const workTypeMapping: { [key: string]: string } = {
        'метр кв.': 'м2',
        'метр куб.': 'м3',
    };

    const workType = workTypeMapping[randomAdditionalPriceDropDownOption.toLowerCase()] || randomAdditionalPriceDropDownOption.toLowerCase();

    if (workType !== 'кілометр') {
        await expect(adminUnitReviewPage.workTypeField.nth(1)).toHaveText(workType);
    }
});