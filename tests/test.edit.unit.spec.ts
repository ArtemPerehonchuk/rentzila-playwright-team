import { test, expect } from "../fixtures";
import { faker } from "@faker-js/faker";
import testData from '../data/test.data.json' assert {type: 'json'};

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || '';

let unitName: string;
let createdUnitId: number;
let activeUnitName: string;
let editedUnitName: string;
let accessUserToken: string;
let accessAdminToken: string;

test.beforeAll(async ({apiHelper}) => {
    accessUserToken = await apiHelper.createUserAccessToken(); 
    accessAdminToken = await apiHelper.createAdminAccessToken();
});

test.afterAll(async ({apiHelper}) => {
    await apiHelper.deleteAllUnits(accessUserToken)
});

test.beforeEach(async ({ homepage, ownerUnitsPage, adminMainPage, apiHelper}) => {
    await homepage.navigate('/');
    await homepage.closePopUpBtn.click();
    await homepage.enterBtn.click()
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();

    unitName = faker.string.alpha({length: 15});

    await homepage.clickOnUserIcon();
    await homepage.clickOnProfileMyAnnouncementsItem();
    
    await expect(ownerUnitsPage.page).toHaveURL(new RegExp(testData.pagesURLPath.ownerUnit));

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

test('Test case C182: Edit Unit without changes', async({ page, ownerUnitsPage, editUnitPage, adminUnitsPage, apiHelper }) => {
    const unitCardsLength = await ownerUnitsPage.getUnitCardsLength();

    if(unitCardsLength === 0) {
        await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    }

    activeUnitName = await ownerUnitsPage.getFirstUnitNameText();

    await expect(unitCardsLength).not.toBe('');
    
    await ownerUnitsPage.clickOnEditUnitBtn();

    await expect(editUnitPage.page).toHaveURL(new RegExp(testData.pagesURLPath.editUnit));

    await editUnitPage.clickOnCancelUnitChangesBtn();

    await expect(ownerUnitsPage.page).toHaveURL(new RegExp(testData.pagesURLPath.ownerUnit));

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!(await editUnitPage.successEditUnitMsg.isVisible())) {
        await editUnitPage.selectAdressOnMap()
        await editUnitPage.uploadPhotos(1);
        await editUnitPage.clickOnSaveUnitChangesBtn();
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.lookInMyAnnouncementsBtn.click();

    if(unitCardsLength === 1) {
        await expect(ownerUnitsPage.activeAnnouncementsTabTitle).toBeVisible();
        await expect(ownerUnitsPage.activeAnnouncementsTabTitle).toHaveText(testData.titleTexts.activeAnnouncementsNotExist);
        await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', activeUnitName);
    }else if(unitCardsLength > 0 && unitCardsLength !== 1) {
        const editedUnitName = await ownerUnitsPage.verifyEditedUnitExludedFromUnitCards(unitName);

        await expect(editedUnitName).toBe('');
        await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('actives', activeUnitName)
    }

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C272: Check "Назва оголошення" input field', async({ ownerUnitsPage, editUnitPage, adminUnitsPage, apiHelper}) => {
    const nineCharStr = faker.string.alpha({length: 9});
    const over100CharStr = faker.string.alpha({length: 101});
    const tenCharStr = faker.string.alpha({length: 10});
    const inputValues = [
        '<>{};^',
        nineCharStr,
        over100CharStr
    ];

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.uploadPhotos(1);
    await editUnitPage.clearUnitNameInput();
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.unitNameInputError).toBeVisible();
    await expect(editUnitPage.unitNameInputError).toHaveText(testData.errorMessages.requiredField);

    for(const inputValue of inputValues) {
        await editUnitPage.fillUnitNameInput(inputValue);
        await editUnitPage.clickOnSaveUnitChangesBtn();

        switch(inputValue) {
            case '<>{};^':
                await expect(editUnitPage.unitNameInput).toHaveText('', {useInnerText: true});
                await expect(editUnitPage.unitNameInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.announcementNameInput);
                break

            case nineCharStr:
                await expect(editUnitPage.unitNameInputError).toBeVisible();
                await expect(editUnitPage.unitNameInputError).toHaveText(testData.errorMessages.announcementNameLess10Symbols);
                break

            case over100CharStr:
                await expect(editUnitPage.unitNameInputError).toBeVisible();
                await expect(editUnitPage.unitNameInputError).toHaveText(testData.errorMessages.announcementNameMore100Symbols);
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

test('Test case C273: Check "Виробник транспортного засобу" input field', async({ ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage, apiHelper}) => {
    const randomString = faker.string.alpha({length: 15});
    const randomChar = faker.string.alpha({length: 1});

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.uploadPhotos(1);
    await editUnitPage.vehicleManufacturerInputCloseIcon.click();

    await expect(editUnitPage.vehicleManufacturerInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.vehicleManufacturerInput);

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.vehicleManufacturerInputError).toBeVisible();
    await expect(editUnitPage.vehicleManufacturerInputError).toHaveText(testData.errorMessages.requiredField);

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

test('Test case C532: "Check "Назва моделі" input field', async({ ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage, apiHelper}) => {
    const random15CharString = faker.string.alpha({length: 15});
    const random16CharString = faker.string.alpha({length: 16});

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.uploadPhotos(1);

    await expect(editUnitPage.modelNameInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.modelNameInput);

    await editUnitPage.fillModelNameInput('<>{};^');

    await expect(editUnitPage.modelNameInput).toHaveValue('');

    await editUnitPage.fillModelNameInput(random16CharString);

    await expect(editUnitPage.modelNameInputError).toBeVisible();
    await expect(editUnitPage.modelNameInputError).toHaveText(testData.errorMessages.modelNameLess15Symbols);

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

test('Test case C533: Check "Технічні характеристики" input field', async({ ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage, apiHelper}) => {
    const randomDescription = faker.lorem.sentence();

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.uploadPhotos(1);
    await editUnitPage.clearTechnicalCharacteristicsInput();

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.lookInMyAnnouncementsBtn.click();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    await ownerUnitsPage.clickOnEditWaitingsUnitBtn();

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillTechnicalCharacteristicsInput('<>&{};^');

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillTechnicalCharacteristicsInput(randomDescription);
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
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

test('Test case C534: Check "Опис" input field', async({ ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage, apiHelper}) => {
    const randomDescription = faker.lorem.sentence();

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.uploadPhotos(1);
    await editUnitPage.clearDetailDescriptionInput();

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!await editUnitPage.successEditUnitMsg.isVisible()) {
        await editUnitPage.selectAdressOnMap()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.lookInMyAnnouncementsBtn.click();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    await ownerUnitsPage.clickOnEditWaitingsUnitBtn();

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillDetailDescriptionInput('<>&{};^');

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillDetailDescriptionInput(randomDescription);
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
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

test('Test case C535: Check "Місце розташування технічного засобу" functionality', async({ ownerUnitsPage, editUnitPage}) => {

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.uploadPhotos(1);
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

    await editUnitPage.mapPopUpConfirmChoiseBtn.click();

    await expect(editUnitPage.page).toHaveURL(new RegExp(testData.pagesURLPath.editUnit));
    await expect(editUnitPage.mapPopUp).not.toBeVisible();
    await expect(editUnitPage.vehicleLocation).toHaveText(choosenLocation);

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();
})

test('Test case C274: Check image section functionality', async({page, ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage}) => {
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
        await expect(editUnitPage.uploadTo12PhotosErrorMsg).toHaveText(testData.errorMessages.uploadImages);

        expect(await editUnitPage.getFileChooser).toBeDefined();

        await editUnitPage.fileChooserSetInputFile();
        await page.waitForLoadState('domcontentloaded');

        await expect(await editUnitPage.editedUnitImageBlocks.first().getAttribute('draggable')).toBe('true');
        await expect(editUnitPage.mainImgLable).toBeVisible();

        await editUnitPage.clickOnSaveUnitChangesBtn();

        if(await editUnitPage.successEditUnitMsg.isVisible()) {
            await expect(editUnitPage.successEditUnitMsg).toBeVisible();
            await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
            await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

            await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

            await adminUnitsPage.clickOnAdminWatchUnitIcon();

            await expect(page).toHaveURL(new RegExp(testData.pagesURLPath.unit));
            await expect(adminUnitReviewPage.unitPhoto).toBeVisible();
        }else return
})

test('Test case C275: Check services functionality', async({ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage}) => {
    const over100CharStr = faker.string.alpha({length: 101});
    const randomService = faker.string.alpha({length: 20});
    const inputValues = [
        '<>{};^',
        over100CharStr,
        randomService
    ];

    await ownerUnitsPage.clickOnEditUnitBtn(); 
    await editUnitPage.uploadPhotos(1);
    await editUnitPage.removeEditedUnitService();

    await expect(editUnitPage.editedUnitService).not.toBeVisible();

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.addServiceErrorMsg).toBeVisible();
    await expect(editUnitPage.addServiceErrorMsg).toHaveText(testData.errorMessages.addMin1Service);

    for(const inputValue of inputValues) {
        await editUnitPage.fillServiceInput(inputValue);

        switch(inputValue) {
            case '<>{};^':
                await expect(editUnitPage.serviceInput).toHaveText('', {useInnerText: true});
                await expect(editUnitPage.serviceInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.editUnitService);
                break

            case over100CharStr:
                const inputValue = await editUnitPage.serviceInput.inputValue();
                await expect(inputValue.length).toBe(100);
                break
            
            case randomService:
                await expect(editUnitPage.serviceNotFoundMsg).toBeVisible();
                await expect(editUnitPage.serviceNotFoundMsg).toContainText(`На жаль, послугу “${randomService}“ не знайдено в нашій базі.`)
                break
        }
    }  
    
    await editUnitPage.createServiceBth.click();

    await expect(editUnitPage.servicesDropDownItems).toHaveText(randomService);
    await expect(editUnitPage.editedUnitService).toBeVisible();

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    await adminUnitsPage.clickOnAdminWatchUnitIcon();

    await expect(adminUnitReviewPage.unitService).toHaveText(randomService);
})

test('Test case C541: Check "Спосіб оплати" menu', async({page, ownerUnitsPage, editUnitPage, unitDetailsPage}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 
    await editUnitPage.uploadPhotos(1);

    const paymentMethods = testData.paymentMethods;

    for(let i = paymentMethods.length - 1; i >= 0; i--) {
        await editUnitPage.clickOnSelectPaymentMethodInput();

        await expect(editUnitPage.paymentMethodsDropDown).toBeVisible();
        
        const paymentMethodDropDownItems = await editUnitPage.paymentMethodDropDownItems.allInnerTexts();

        await expect(paymentMethods).toContain(paymentMethodDropDownItems[i]);

        await editUnitPage.paymentMethodDropDownItems.nth(i).click();

        await expect(editUnitPage.selectPaymentMethodInput).toHaveText(paymentMethodDropDownItems[i]);

        await editUnitPage.clickOnSaveUnitChangesBtn();

        await expect(editUnitPage.successEditUnitMsg).toBeVisible();
        await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
        await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

        await editUnitPage.lookInMyAnnouncementsBtn.click();
        await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
        await ownerUnitsPage.firstWaitingsUnit.click();

        await expect(page).toHaveURL(new RegExp(testData.pagesURLPath.unit));
        await expect(unitDetailsPage.unitsPaymentMethod).toHaveText(paymentMethodDropDownItems[i]);

        await unitDetailsPage.clickOnEditUnitBtn();

        await expect(page).toHaveURL(new RegExp(testData.pagesURLPath.editUnit));
    }
})

test('Test case C276: Check "Вартість мінімального замовлення" field', async({ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 
    await editUnitPage.uploadPhotos(1);
    await editUnitPage.clearMinOrderPriceInput();

    await expect(await editUnitPage.minOrderPriceInput.first().getAttribute('placeholder')).toBe(testData.inputPlaceholderTexts.minOrderInput);

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.unitPriceErrorMsg).toBeVisible();
    await expect(editUnitPage.unitPriceErrorMsg).toHaveText(testData.errorMessages.requiredField);

    const random10Digits = (faker.number.int({ min: 1000000000, max: 9999999999 })).toString()
    const inputValues = [
        '<>{};^@!#$%?()|\/`~',
        random10Digits
    ]

    for (const value of inputValues) {
        await editUnitPage.fillMinOrderPriceInput(value)
        switch(value) {
            case '<>{};^@!#$%?()|\/`~':
                await expect(editUnitPage.minOrderPriceInput.first()).toHaveText('');
                break
            
            case random10Digits: 
                const inputValue = await editUnitPage.minOrderPriceInput.first().inputValue();
                await expect(inputValue.length).toBe(9);
                break
        }
    }

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    await adminUnitsPage.clickOnAdminWatchUnitIcon();

    await expect(adminUnitReviewPage.minPriceField).toHaveText(random10Digits.slice(0, 9));
})

test('Test case C543:  Check "Вартість мінімального замовлення" drop-down menu', async({page, ownerUnitsPage, editUnitPage, adminUnitsPage, adminUnitReviewPage}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 
    await editUnitPage.uploadPhotos(1);
    if(await editUnitPage.addPriceBtn.isVisible()) {
        await editUnitPage.addPriceBtn.click();
    }

    const priceOptions = testData.addPriceOptions;
    let additionalPriceItems;

    for(let i = 1; i < priceOptions.length; i ++) {
        await editUnitPage.additionalPriceSelect.nth(1).click();

        await expect(editUnitPage.additionalPriceDropDpwn).toBeVisible();

        additionalPriceItems = await editUnitPage.additionalPriceDropDownItems.allInnerTexts();
 
        await expect(priceOptions).toContain(additionalPriceItems[i]);

        await editUnitPage.additionalPriceDropDownItems.nth(i).click();

        const additionalPriceDropDownItem = await editUnitPage.additionalPriceSelect.nth(1).innerText()

        await expect(additionalPriceDropDownItem.toLowerCase()).toBe(additionalPriceItems[i].toLowerCase());

        if(additionalPriceItems[i] === 'Зміна') {
            await expect(editUnitPage.selectTimeInput).toBeVisible();
        }
    }

    await editUnitPage.additionalPriceSelect.nth(1).click();

    additionalPriceItems = await editUnitPage.additionalPriceDropDownItems.allInnerTexts();
    const randomAdditionalPriceItemIndex = Math.floor(Math.random() * additionalPriceItems.length);
    const randomAdditionalPriceDropDownOption = additionalPriceItems[randomAdditionalPriceItemIndex];

    await editUnitPage.additionalPriceDropDownItems.nth(randomAdditionalPriceItemIndex).click();
    await page.waitForTimeout(2000);

    await editUnitPage.additionalPriceInput.fill('1000');

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await adminUnitsPage.verifyEditedUnitPresentsInWaitingsTab('waitings', editedUnitName);

    await adminUnitsPage.clickOnAdminWatchUnitIcon();

    if(randomAdditionalPriceDropDownOption.toLowerCase() === 'метр кв.') {
        await expect(adminUnitReviewPage.workTypeField.nth(1)).toHaveText('м2');
    }else if(randomAdditionalPriceDropDownOption.toLowerCase() === 'метр куб.') {
        await expect(adminUnitReviewPage.workTypeField.nth(1)).toHaveText('м3');
    }else if(randomAdditionalPriceDropDownOption.toLowerCase() === 'кілометр') {
        return
    }
    else {
        await expect(adminUnitReviewPage.workTypeField.nth(1)).toHaveText(randomAdditionalPriceDropDownOption.toLowerCase());
    }
})