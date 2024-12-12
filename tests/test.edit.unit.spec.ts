import { test, expect } from "../fixtures";
import { faker } from "@faker-js/faker";
import testData from '../data/test.data.json' assert {type: 'json'};

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let unitName: string;
let createdUnitId: number;
let activeUnitName: string;
let editedUnitName: string;
let accessUserToken: string;
let accessAdminToken: string;
let response;
let responseData;

test.beforeAll(async ({apiHelper}) => {
    accessUserToken = await apiHelper.createUserAccessToken(); 
    accessAdminToken = await apiHelper.createAdminAccessToken();
});

test.afterAll(async ({apiHelper}) => {
    await apiHelper.deleteAllUnits(accessUserToken)
});

test.beforeEach(async ({ homepage, ownerUnitsPage, apiHelper}) => {
    unitName = faker.string.alpha({length: 15});

    await apiHelper.createUnit(accessUserToken, unitName);

    createdUnitId = await apiHelper.getUnitId(accessUserToken, unitName);

    await apiHelper.uploadUnitPhoto(accessUserToken, createdUnitId);
    await apiHelper.moderateUnit(accessAdminToken, createdUnitId);

    await homepage.navigate('/');
    await homepage.closePopUpBtn.click();
    await homepage.enterBtn.click()
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();
    await homepage.clickOnUserIcon();
    await homepage.clickOnProfileMyAnnouncementsItem();
    
    await expect(ownerUnitsPage.page).toHaveURL(new RegExp(testData.pagesURLPath["owner-unit"]));

    editedUnitName = await ownerUnitsPage.getFirstUnitNameText();
});

test('Test case C182: Edit Unit without changes', async({ ownerUnitsPage, editUnitPage, apiHelper }) => {
    const unitCardsLength = await ownerUnitsPage.getUnitCardsLength();

    if(unitCardsLength === 0) {
        await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    }

    activeUnitName = await ownerUnitsPage.getFirstUnitNameText();

    await expect(unitCardsLength).not.toBe('');
    
    await ownerUnitsPage.clickOnEditUnitBtn();

    await expect(editUnitPage.page).toHaveURL(new RegExp(testData.pagesURLPath["edit-unit"]));

    await editUnitPage.clickOnCancelUnitChangesBtn();

    await expect(ownerUnitsPage.page).toHaveURL(new RegExp(testData.pagesURLPath["owner-unit"]));

    await ownerUnitsPage.clickOnEditUnitBtn();

    do{
        await editUnitPage.clickOnSaveUnitChangesBtn();

        const successMsgIsVisible = await editUnitPage.successEditUnitMsg.isVisible();

        if(successMsgIsVisible){break}
    }while(true)

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.lookInMyAnnouncementsBtn.click();

    if(unitCardsLength === 1) {
        await expect(ownerUnitsPage.activeAnnouncementsTabTitle).toBeVisible();
        await expect(ownerUnitsPage.activeAnnouncementsTabTitle).toHaveText(testData.titleTexts.activeAnnouncementsNotExist);

        response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
        responseData = await response.json()

        await expect(response.status()).toBe(200);
        await expect(responseData.results[0].is_approved).toBe(null);
    }else if(unitCardsLength > 0 && unitCardsLength !== 1) {
        const editedUnitName = await ownerUnitsPage.verifyEditedUnitExludedFromUnitCards(unitName);
        response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
        responseData = await response.json()

        await expect(editedUnitName).toBe('');
        await expect(responseData.results[0].is_approved).not.toBe(null);
    }

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C272: Check "Назва оголошення" input field', async({ page, ownerUnitsPage, editUnitPage, apiHelper}) => {
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

    do{
        await editUnitPage.clickOnSaveUnitChangesBtn();

        const successMsgIsVisible = await editUnitPage.successEditUnitMsg.isVisible();

        if(successMsgIsVisible){break}
    }while(true)

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    response = await apiHelper.searchUnitByName(accessAdminToken, tenCharStr)
    responseData = await response.json();


    await expect(response.status()).toBe(200);
    await expect(responseData.results[0].name).toBe(tenCharStr);
    await expect(responseData.results[0].is_approved).toBe(null);

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C273: Check "Виробник транспортного засобу" input field', async({ ownerUnitsPage, editUnitPage, apiHelper}) => {
    const randomString = faker.string.alpha({length: 15});
    const randomChar = faker.string.alpha({length: 1});

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.vehicleManufacturerInputCloseIcon.click();

    await expect(editUnitPage.vehicleManufacturerInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.vehicleManufacturerInput);

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!(await editUnitPage.successEditUnitMsg.isVisible())) {
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

    response = await apiHelper.searchUnitByName(accessAdminToken, editedUnitName);
    responseData = await response.json()

    const manufacturerId = responseData.results[0].manufacturer
    const manufacturerResponse = await apiHelper.getVehicleManufacturer(accessAdminToken, manufacturerId);
    const manufactureData = await manufacturerResponse.json();

    await expect(response.status()).toBe(200);
    await expect(manufactureData.name).toBe(selectedOptionText)
    await expect(responseData.results[0].is_approved).toBe(null);
    
    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C532: "Check "Назва моделі" input field', async({ ownerUnitsPage, editUnitPage, apiHelper}) => {
    const random15CharString = faker.string.alpha({length: 15});
    const random16CharString = faker.string.alpha({length: 16});

    await ownerUnitsPage.clickOnEditUnitBtn();

    await expect(editUnitPage.modelNameInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.modelNameInput);

    await editUnitPage.modelNameInput.type('<>{};^');

    await expect(editUnitPage.modelNameInput).toHaveValue('');

    await editUnitPage.fillModelNameInput(random16CharString);

    await expect(editUnitPage.modelNameInputError).toBeVisible();
    await expect(editUnitPage.modelNameInputError).toHaveText(testData.errorMessages.modelNameLess15Symbols);

    await editUnitPage.fillModelNameInput(random15CharString);

    do{
        await editUnitPage.clickOnSaveUnitChangesBtn();

        const successMsgIsVisible = await editUnitPage.successEditUnitMsg.isVisible();

        if(await editUnitPage.unitNameInputError.isVisible()) {
            unitName = faker.string.alpha({length: 15})
            await editUnitPage.fillUnitNameInput(unitName)
            await editUnitPage.clickOnSaveUnitChangesBtn()
        }

        if(await editUnitPage.successEditUnitMsg.isVisible()){break}
    }while(true)
    
    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
    responseData = await response.json()

    await expect(response.status()).toBe(200);
    await expect(responseData.results[0].model_name).toBe(random15CharString);
    await expect(responseData.results[0].is_approved).toBe(null);
    
    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C533: Check "Технічні характеристики" input field', async({ownerUnitsPage, editUnitPage, apiHelper}) => {
    const randomDescription = faker.lorem.sentence();

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clearTechnicalCharacteristicsInput();

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!(await editUnitPage.successEditUnitMsg.isVisible())) {
        await editUnitPage.selectAdressOnMap()
        await editUnitPage.clickOnSaveUnitChangesBtn();
    }
    if(await editUnitPage.unitNameInputError.isVisible()) {
        const newUnitName = faker.string.alpha({length: 15})
        await editUnitPage.fillUnitNameInput(newUnitName)
        await editUnitPage.clickOnSaveUnitChangesBtn()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.lookInMyAnnouncementsBtn.click();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    await ownerUnitsPage.clickOnEditWaitingsUnitBtn();

    unitName = await editUnitPage.unitNameInput.inputValue()

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillTechnicalCharacteristicsInput('<>&{};^');

    await expect(editUnitPage.technicalCharacteristicsInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillTechnicalCharacteristicsInput(randomDescription);
    await editUnitPage.clickOnSaveUnitChangesBtn();

    response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
    responseData = await response.json()
    const editedUnitId = responseData.results[0].id
    const unitResponse = await apiHelper.getUnitById(accessUserToken, editedUnitId);
    const unitData = await unitResponse.json();

    await expect(response.status()).toBe(200);
    await expect(unitData.features).toBe(randomDescription);
    await expect(responseData.results[0].is_approved).toBe(null);

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C534: Check "Опис" input field', async({ ownerUnitsPage, editUnitPage, apiHelper}) => {
    const randomDescription = faker.lorem.sentence();

    await ownerUnitsPage.clickOnEditUnitBtn();
    await editUnitPage.clearDetailDescriptionInput();

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.clickOnSaveUnitChangesBtn();

    if(!(await editUnitPage.successEditUnitMsg.isVisible())) {
        await editUnitPage.selectAdressOnMap()
        await editUnitPage.clickOnSaveUnitChangesBtn();
    }
    if(await editUnitPage.unitNameInputError.isVisible()) {
        const newUnitName = faker.string.alpha({length: 15})
        await editUnitPage.fillUnitNameInput(newUnitName)
        await editUnitPage.clickOnSaveUnitChangesBtn()
    }

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    await editUnitPage.lookInMyAnnouncementsBtn.click();
    await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
    await ownerUnitsPage.clickOnEditWaitingsUnitBtn();

    unitName = await editUnitPage.unitNameInput.inputValue()

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillDetailDescriptionInput('<>&{};^');

    await expect(editUnitPage.detailDescriptionInput).toHaveText('', {useInnerText: true});

    await editUnitPage.fillDetailDescriptionInput(randomDescription);
    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
    responseData = await response.json()
    const editedUnitId = responseData.results[0].id
    const unitResponse = await apiHelper.getUnitById(accessUserToken, editedUnitId);
    const unitData = await unitResponse.json();

    await expect(response.status()).toBe(200);
    await expect(unitData.description).toBe(randomDescription);
    await expect(responseData.results[0].is_approved).toBe(null);

    await apiHelper.deleteUnit(accessUserToken, createdUnitId);
})

test('Test case C535: Check "Місце розташування технічного засобу" functionality', async({ ownerUnitsPage, editUnitPage}) => {

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

    await editUnitPage.mapPopUpConfirmChoiseBtn.click();

    await expect(editUnitPage.page).toHaveURL(new RegExp(testData.pagesURLPath["edit-unit"]));
    await expect(editUnitPage.mapPopUp).not.toBeVisible();
    await expect(editUnitPage.vehicleLocation).toHaveText(choosenLocation);

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();
})

test('Test case C274: Check image section functionality', async({page, apiHelper, ownerUnitsPage, editUnitPage}) => {
    await ownerUnitsPage.clickOnEditUnitBtn();

    await page.waitForTimeout(3000)

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
        await page.waitForLoadState('load');
        await page.waitForLoadState('domcontentloaded');

        await expect(await editUnitPage.editedUnitImageBlocks.first().getAttribute('draggable')).toBe('true');
        await expect(editUnitPage.mainImgLable).toBeVisible();

        await editUnitPage.clickOnSaveUnitChangesBtn();

        response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
        responseData = await response.json()
        const editedUnitId = responseData.results[0].id
        const unitResponse = await apiHelper.getUnitById(accessUserToken, editedUnitId);
        const unitData = await unitResponse.json();

        await expect(unitData.declined_invalid_img).toBe(false);
        await expect(unitData.is_approved).toBe(null);


        if(await editUnitPage.successEditUnitMsg.isVisible()) {
            await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
            await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();
        }else return
})

test('Test case C275: Check services functionality', async({apiHelper, ownerUnitsPage, editUnitPage}) => {
    const over100CharStr = faker.string.alpha({length: 101});
    const randomService = faker.string.alpha({length: 20});
    const inputValues = [
        '<>{};^',
        over100CharStr,
        randomService
    ];

    await ownerUnitsPage.clickOnEditUnitBtn(); 
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

    response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
    responseData = await response.json()
    const editedUnitServiceName = responseData.results[0].services[0].name

    await expect(editedUnitServiceName).toBe(randomService)
})

test('Test case C541: Check "Спосіб оплати" menu', async({page, ownerUnitsPage, editUnitPage, unitDetailsPage}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 

    const paymentMethods = testData['payment methods'];

    for(let i = 0; i < paymentMethods.length; i++) {
        await editUnitPage.clickOnSelectPaymentMethodInput();

        await expect(editUnitPage.paymentMethodsDropDown).toBeVisible();
        
        const paymentMethodDropDownItems = await editUnitPage.paymentMethodDropDownItems.allInnerTexts();

        await expect(paymentMethods).toContain(paymentMethodDropDownItems[i]);

        await editUnitPage.paymentMethodDropDownItems.nth(i).click();

        await page.waitForTimeout(3000)

        await expect(editUnitPage.selectPaymentMethodInput).toHaveText(paymentMethodDropDownItems[i]);

        do{
            await editUnitPage.clickOnSaveUnitChangesBtn();

            if(await editUnitPage.unitNameInputError.isVisible()) {
                unitName = faker.string.alpha({length: 15})
                await editUnitPage.fillUnitNameInput(unitName)
                await editUnitPage.clickOnSaveUnitChangesBtn();
            }

            if(await editUnitPage.addressSelectionErrorMsg.isVisible()) {
                await editUnitPage.selectAdressOnMap();
            }
    
            const successMsgIsVisible = await editUnitPage.successEditUnitMsg.isVisible();
    
            if(successMsgIsVisible){break}
        }while(true)

        await expect(editUnitPage.successEditUnitMsg).toBeVisible();
        await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
        await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

        await editUnitPage.lookInMyAnnouncementsBtn.click();
        await ownerUnitsPage.clickOnWaitingsAnnouncementsTab();
        await ownerUnitsPage.firstWaitingsUnit.click();

        await page.waitForURL(new RegExp(testData.pagesURLPath.unit))

        // await page.waitForLoadState('load')
        // await page.waitForLoadState('networkidle')

        await expect(page).toHaveURL(new RegExp(testData.pagesURLPath.unit));
        await expect(unitDetailsPage.unitsPaymentMethod).toHaveText(paymentMethodDropDownItems[i]);

        await unitDetailsPage.clickOnEditUnitBtn();

        await expect(page).toHaveURL(new RegExp(testData.pagesURLPath["edit-unit"]));
    }
})

test('Test case C276: Check "Вартість мінімального замовлення" field', async({page, apiHelper, ownerUnitsPage, editUnitPage}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 

    await editUnitPage.minOrderPriceInput.first().scrollIntoViewIfNeeded();

    await editUnitPage.clearMinOrderPriceInput();
    
    await expect(await editUnitPage.minOrderPriceInput.first().getAttribute('placeholder')).toBe(testData.inputPlaceholderTexts.minOrderInput);

    await editUnitPage.clickOnSaveUnitChangesBtn();
    await editUnitPage.clearMinOrderPriceInput();

    await expect(editUnitPage.unitPriceErrorMsg).toBeVisible();
    await expect(editUnitPage.unitPriceErrorMsg).toHaveText(testData.errorMessages.requiredField);

    const random10Digits = faker.string.numeric({length: 10});
    const inputValues = [
        '<>{};^@!#$%?()|\/`~',
        random10Digits
    ]

    for (const value of inputValues) {
        await editUnitPage.fillMinOrderPriceInput(value);
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

    const minPriceValue = parseInt(await editUnitPage.minOrderPriceInput.first().inputValue());

    do{
        await editUnitPage.clickOnSaveUnitChangesBtn();

        if(await editUnitPage.unitNameInputError.isVisible()) {
            unitName = faker.string.alpha({length: 15})
            await editUnitPage.fillUnitNameInput(unitName)
            await editUnitPage.clickOnSaveUnitChangesBtn();
        }

        if(await editUnitPage.addressSelectionErrorMsg.isVisible()) {
            await editUnitPage.selectAdressOnMap();
        }

        const successMsgIsVisible = await editUnitPage.successEditUnitMsg.isVisible();

        if(successMsgIsVisible){break}
    }while(true)

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
    responseData = await response.json()

    await expect(response.status()).toBe(200);
    await expect(responseData.results[0].minimal_price).toBe(minPriceValue);
    await expect(responseData.results[0].is_approved).toBe(null);
})

test('Test case C543:  Check "Вартість мінімального замовлення" drop-down menu', async({page, apiHelper, ownerUnitsPage, editUnitPage}) => {
    await ownerUnitsPage.clickOnEditUnitBtn(); 
    await editUnitPage.addPriceBtn.click();
    await page.waitForLoadState('domcontentloaded');

    const priceOptions = testData['add price options'];
    let additionalPriceItems;

    for(let i = 1; i < priceOptions.length; i ++) {
        await editUnitPage.additionalPriceSelect.nth(1).click();
        await page.waitForLoadState('domcontentloaded');

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

    await editUnitPage.additionalPriceDropDownItems.nth(randomAdditionalPriceItemIndex).click();
    await page.waitForLoadState('load');

    await editUnitPage.additionalPriceInput.fill('1000');

    await editUnitPage.clickOnSaveUnitChangesBtn();

    await expect(editUnitPage.successEditUnitMsg).toBeVisible();
    await expect(editUnitPage.successEditUnitMsg).toHaveText(testData.successMessages.unitEdited);
    await expect(editUnitPage.lookInMyAnnouncementsBtn).toBeVisible();

    response = await apiHelper.searchUnitByName(accessAdminToken, unitName);
    responseData = await response.json()

    await expect(responseData.results[0].type_of_work).toBe('HOUR');
})