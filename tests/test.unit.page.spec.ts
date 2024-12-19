import { test, expect } from "../fixtures";
import { faker } from '@faker-js/faker';
import { getStringWithSpaceIncide, getStringWithSpaceInEnd } from '../helpers/random.values';
import testData from '../data/test.data.json' assert {type: 'json'}

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';

test.beforeEach(async ({ homepage }) => {
    await homepage.navigate('/');
    await homepage.closePopUpBtn.click();
    await homepage.createUnitBtn.click();
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();
});

test('test case C294: Verify body title and tab titles', async( {createUnitPage} ) => {
    await expect(createUnitPage.createUnitTitle).toBeVisible();
    await expect(createUnitPage.createUnitTitle).toHaveText(testData.titleTexts.createUnit);
    await expect(await createUnitPage.checkCreateUnitTabsTitles(1)).toBe(true);

    const tabNames = await createUnitPage.createUnitTabsText.allInnerTexts();

    for(let i = 0; i < tabNames.length; i++) {
        await createUnitPage.createUnitTabs.nth(i).click();
        if(tabNames[i] === 'Основна інформація') {

            await expect(createUnitPage.characteristicsTitle).toBeVisible();
            await expect(createUnitPage.categoriesDropDown).toBeVisible();
            await expect(createUnitPage.announcementNameInput).toBeVisible();
            await expect(createUnitPage.vehicleManufacturerList).toBeVisible();
            await expect(createUnitPage.modelNameInput).toBeVisible();
            await expect(createUnitPage.technicalInfoInput).toBeVisible();
            await expect(createUnitPage.descriptionInfoInput).toBeVisible();
            await expect(createUnitPage.mapLabel).toBeVisible();
        }
        else if(tabNames[i] === 'Фотографії') {
            const photoTitle  = createUnitPage.page.locator('div[class*="ImagesUnitFlow_title"]');
            const imageContainer = createUnitPage.page.locator('div[class*="ImagesUnitFlow_imageContainer"]');

            await expect(photoTitle).toBeVisible();
            await expect(imageContainer).toBeVisible();
        }
        else if(tabNames[i] === 'Послуги') {
            const customServicesTitle  = createUnitPage.page.locator('div[class*="ServicesUnitFlow_title"]');
            const customServicesSearchInput = createUnitPage.page.locator('div[class*="ServicesUnitFlow_searchInput"]');

            await expect(customServicesTitle).toBeVisible();
            await expect(customServicesSearchInput).toBeVisible();
        }
        else if(tabNames[i] === 'Вартість') {
            const customPricesTitle  = createUnitPage.page.locator('div[class*="PricesUnitFlow_title"]');
            const paymentTypeSelect = createUnitPage.page.locator('div[data-testid="div_CustomSelect"]');
            const customUnitPrice = createUnitPage.page.locator('div[data-testid="input_wrapper_RowUnitPrice"]').first();

            await expect(customPricesTitle).toBeVisible();
            await expect(paymentTypeSelect).toBeVisible();
            await expect(customUnitPrice).toBeVisible();
        }
        else if(tabNames[i] === 'Контакти') {
            const contactsTitle  = createUnitPage.page.locator('div[class*="AuthContactCard_title"]');
            const contactsCard = createUnitPage.page.locator('div[class*="AuthContactCard_infoWrapper"]');

            await expect(contactsTitle).toBeVisible();
            await expect(contactsCard).toBeVisible();
        }
    }
})

test('test case C296: Verify category (Категорія) section', async( {createUnitPage} ) => {
    test.setTimeout(150000);

    await expect(createUnitPage.categoriesTitle).toBeVisible();
    await expect(createUnitPage.categoriesDropDown).toBeVisible();
    await expect(createUnitPage.categoriesDropDownArrowDown).toBeVisible();
    await expect(await createUnitPage.getCategoriesTitleText()).toContain(testData.titleTexts.category);
    await expect(await createUnitPage.getCategoriesTitleText()).toContain(testData.titleTexts.arrowSymbol);
    await expect(await createUnitPage.getCategoriesDropDownBgText()).toContain(testData.inputPlaceholderTexts.chooseCategory);

    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.categoryErrorMessage).toBeVisible();
    await expect(await createUnitPage.getCategoryInputErrorText()).toBe(testData.errorMessages.requiredField);
    await expect(createUnitPage.categoriesDropDown).toHaveCSS('border-color', testData.borderColors.errorColor);

    await createUnitPage.categoriesDropDown.click();

    await expect(createUnitPage.categoriesPopUp).toBeVisible();
    await expect(createUnitPage.categoriesPopUpTitle).toHaveText(testData.titleTexts.categoriesPopUp);

    await createUnitPage.categoriesPopUpCloseBtn.click();

    await expect(createUnitPage.categoriesPopUp).not.toBeVisible();

    await createUnitPage.categoriesDropDown.click();
    await createUnitPage.clickOutsidePopup();

    await expect(createUnitPage.categoriesPopUp).not.toBeVisible();

    await createUnitPage.categoriesDropDown.click();
    await createUnitPage.checkOptionsInCategoriesPopUp();
})

test('test case C297: Verify unit name section', async( {createUnitPage} ) => {
    await expect(createUnitPage.announcementNameTitle).toBeVisible();
    await expect(createUnitPage.announcementNameInput).toBeVisible();
    await expect(await createUnitPage.getAnnouncementNameTitleText()).toContain(testData.titleTexts.announcementName);
    await expect(await createUnitPage.getAnnouncementNameTitleText()).toContain(testData.titleTexts.arrowSymbol);
    await expect(await createUnitPage.getAnnouncementNameInputBgText()).toContain(testData.inputPlaceholderTexts.announcementNameInput);

    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.announcementNameInputError).toBeVisible();
    await expect(createUnitPage.announcementNameInputError).toHaveText(testData.errorMessages.requiredField);
    await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);

    const randomToNineCharNumber = String(faker.number.int({min: 1, max: 999999999}));
    const random101CharString = faker.string.alpha({ length: 101 });
    const randomTenCharString = faker.string.alpha({ length: 10 });
    const randomOneCharString = faker.string.alpha({ length: 1 });
    const inputValues = [
        randomToNineCharNumber, 
        random101CharString,
        '<>{};^',
        randomTenCharString
    ]

    for (const value of inputValues) {
        await createUnitPage.announcementNameInput.clear();
        await createUnitPage.announcementNameInput.type(value)

        switch(value) {
            case randomToNineCharNumber:
                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(testData.errorMessages.announcementNameLess10Symbols);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);

                await createUnitPage.copyPasteValueInSectionInput(createUnitPage.announcementNameInput);

                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(testData.errorMessages.announcementNameLess10Symbols);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);
                break
            
            case random101CharString:
                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(testData.errorMessages.announcementNameMore100Symbols);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);
                await expect(await createUnitPage.getAnnouncementInputValueCharCount()).toBe(100);

                await createUnitPage.copyPasteValueInSectionInput(createUnitPage.announcementNameInput);
                await createUnitPage.announcementNameInput.type(randomOneCharString);

                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(testData.errorMessages.announcementNameMore100Symbols);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);
                break
            
            case '<>{};^':
                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(testData.errorMessages.announcementNameLess10Symbols);
                await expect(await createUnitPage.getAnnouncementNameInputValueText()).toBe('');
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);
                break
            
            case randomTenCharString:
                await expect(createUnitPage.announcementNameInputError).not.toBeVisible();
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.defaultGrey);

                await createUnitPage.copyPasteValueInSectionInput(createUnitPage.announcementNameInput);

                await expect(createUnitPage.announcementNameInputError).not.toBeVisible();
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', testData.borderColors.defaultGrey);
                break
        }
    }
})

test('test case C298: Verify vehicle manufacturer section', async( {createUnitPage} ) => {
    await expect(createUnitPage.vehicleManufacturerTitle).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerInput).toBeVisible();
    await expect(await createUnitPage.getVehicleManufacturerTitleText()).toContain(testData.titleTexts.vehicleManufacturer);
    await expect(await createUnitPage.getVehicleManufacturerTitleText()).toContain(testData.titleTexts.arrowSymbol);
    await expect(await createUnitPage.getVehicleManufacturerInputBgText()).toContain(testData.inputPlaceholderTexts.vehicleManufacturerInput);
   
    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.vehicleManufacturerInputError).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerInputSearchIcon).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerInputError).toHaveText(testData.errorMessages.requiredField);
    await expect(createUnitPage.vehicleManufacturerInputContainer).toHaveCSS('border-color', testData.borderColors.darkBlue);

    const random101CharString = faker.string.alpha({ length: 101 });
    const randomOneCharString = faker.string.alpha({ length: 1 });
    const InputValues = [
        'АТЭК',
        ' ',
        '<>{};^',
        '123456789',
    ]

    await createUnitPage.fillSectionInput(createUnitPage.vehicleManufacturerInput, randomOneCharString);

    await expect(createUnitPage.vehicleManifacturerDropDown).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerDropDownOption).toBeVisible();

    await createUnitPage.copyPasteValueInSectionInput(createUnitPage.vehicleManufacturerInput);

    await expect(createUnitPage.vehicleManifacturerDropDown).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerDropDownOption).toBeVisible();

    for(const value of InputValues) {
        await createUnitPage.fillSectionInput(createUnitPage.vehicleManufacturerInput, value);

        switch(value) {
            case 'АТЭК':
                await expect(createUnitPage.vehicleManifacturerDropDown).toBeVisible();
                await expect(createUnitPage.vehicleManufacturerDropDownOption).toBeVisible();
                await expect(await createUnitPage.getVehicleManufacturerDropDownOptionText()).toBe('АТЭК');

                await createUnitPage.fillSectionInput(createUnitPage.vehicleManufacturerInput, value.toLowerCase());

                await expect(await createUnitPage.getVehicleManufacturerDropDownOptionText()).toBe('АТЭК');
                break

            case ' ':
                await expect(createUnitPage.vehicleManifacturerDropDown).not.toBeVisible();
                await expect(createUnitPage.vehicleManufacturerDropDownOption).not.toBeVisible();
                break

            case '<>{};^':
                await expect(createUnitPage.vehicleManifacturerDropDown).not.toBeVisible();
                await expect(createUnitPage.vehicleManufacturerDropDownOption).not.toBeVisible();
                break

            case '123456789':
                await expect(await createUnitPage.getOptionNotFoundErrorText()).toContain(value);
                await expect(await createUnitPage.getVehicleManufacturerInputValueLength()).toBe(value.length);
                break
        }
    }

    await createUnitPage.fillSectionInput(createUnitPage.vehicleManufacturerInput, random101CharString);
    
    await expect(await createUnitPage.getVehicleManufacturerInputValueLength()).toBe(100);

    await createUnitPage.fillSectionInput(createUnitPage.vehicleManufacturerInput, randomOneCharString);
    const optionText = await createUnitPage.getVehicleManufacturerDropDownOptionText();
    await createUnitPage.vehicleManufacturerDropDownOption.click();

    await expect(await createUnitPage.getVehicleManufacturerSelectedOptionText()).toBe(optionText);

    await createUnitPage.clearVehicleManifacturerDropDownIcon.click({force: true});

    await expect(await createUnitPage.getVehicleManufacturerInputText()).toBe('');
})

test('test case C299: Verify model name input field', async( {createUnitPage} ) => {
    await expect(createUnitPage.modelNameTitle).toBeVisible();
    await expect(createUnitPage.modelNameInput).toBeVisible();
    await expect(await createUnitPage.getModelNameTitleText()).toContain(testData.titleTexts.modelName);
    await expect(await createUnitPage.getModelNameInputBgText()).toBe(testData.inputPlaceholderTexts.modelNameInput);

    const random16CharStr = faker.string.alpha({ length: 16 });
    const random10To15CharStr = faker.string.alpha({ length: {min: 10, max: 15} });
    const randomStrWithSpaceInEnd = getStringWithSpaceInEnd();
    const randomStrWithSpaceIncide = getStringWithSpaceIncide();
    const InputValues = [
        random16CharStr,
        randomStrWithSpaceInEnd,
        randomStrWithSpaceIncide,
        ' ',
        '<>{};^',
        random10To15CharStr
    ]

    for(const input of InputValues) {
        await createUnitPage.fillSectionInput(createUnitPage.modelNameInput, input);

        if(input === random16CharStr || input === randomStrWithSpaceInEnd || input === randomStrWithSpaceIncide) {
            await expect(createUnitPage.modelNameInputError).toBeVisible();
            await expect(createUnitPage.modelNameInputError).toHaveText(testData.errorMessages.modelNameLess15Symbols);
            await expect(createUnitPage.modelNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);

            await createUnitPage.copyPasteValueInSectionInput(createUnitPage.modelNameInput);

            await expect(createUnitPage.modelNameInputError).toBeVisible();
            await expect(createUnitPage.modelNameInputError).toHaveText(testData.errorMessages.modelNameLess15Symbols);
            await expect(createUnitPage.modelNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);

            await createUnitPage.modelNameInput.clear();
        }
        else if(input === ' ' || input === '<>{};^') {
            await expect(await createUnitPage.getModelNameInputText()).toBe('');
        }
        else if(input === random10To15CharStr){
            await expect(createUnitPage.modelNameInputError).not.toBeVisible()
        };
    }
})

test('test case C317: Verify technical characteristics section', async( {createUnitPage} ) => {
    await expect(createUnitPage.technicalInfoTitle).toBeVisible();
    await expect(createUnitPage.technicalInfoInput).toBeVisible();
    await expect(createUnitPage.technicalInfoTitle).toHaveText(testData.titleTexts.technicalCharacteristics);
    await expect(createUnitPage.technicalInfoInput).toBeEnabled();
    await expect(await createUnitPage.getTechnicalInfoInputText()).toBe('');

    const random9000CharStr = faker.string.alpha({ length: 9000});
    const randomOneCharStr = faker.string.alpha({ length: 1});
    const inputValues = [
        '<>{};^',
        random9000CharStr
    ]

    for(const input of inputValues) {
        await createUnitPage.fillSectionInput(createUnitPage.technicalInfoInput, input) 
            switch(input) {
                case '<>{};^':
                    await expect(await createUnitPage.getTechnicalInfoInputText()).toBe('');
                    break
                case random9000CharStr:
                    await createUnitPage.technicalInfoInput.type(randomOneCharStr);
                    await expect((await createUnitPage.getTechnicalInfoInputText()).length).toBe(9000);
                    break
        }
    }
})

test('test case C318: Verify description section', async( {createUnitPage} ) => {
    await expect(createUnitPage.descriptionInfoTitle).toBeVisible();
    await expect(createUnitPage.descriptionInfoInput).toBeVisible();
    await expect(createUnitPage.descriptionInfoTitle).toHaveText(testData.titleTexts.detailDescription);
    await expect(createUnitPage.descriptionInfoInput).toBeEnabled();
    await expect(await createUnitPage.getTechnicalInfoInputText()).toBe('');

    const random9000CharStr = faker.string.alpha({ length: 9000});
    const randomOneCharStr = faker.string.alpha({ length: 1});
    const inputValues = [
        '<>{};^',
        random9000CharStr
    ]

    for(const input of inputValues) {
        await createUnitPage.fillSectionInput(createUnitPage.descriptionInfoInput, input) 
            switch(input) {
                case '<>{};^':
                    await expect(await createUnitPage.getDescriptionInfoInputText()).toBe('');
                    break
                case random9000CharStr:
                    await createUnitPage.descriptionInfoInput.type(randomOneCharStr);

                    await expect((await createUnitPage.getDescriptionInfoInputText()).length).toBe(9000);
                    break
        }
    }
})

test('test case C319: Verify vehicle location division', async( {createUnitPage} ) => {
    await expect(createUnitPage.addressSelectionTitle).toBeVisible();
    await expect(createUnitPage.addressSelectionInput).toBeVisible();
    await expect(await createUnitPage.getAddressSelectionTitleText()).toContain(testData.titleTexts.vehicalAddress);
    await expect(await createUnitPage.getAddressSelectionTitleText()).toContain(testData.titleTexts.arrowSymbol);
    await expect(createUnitPage.addressSelectionInput).toHaveText(testData.inputPlaceholderTexts.chooseOnMap);

    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.addressSelectionInputError).toBeVisible();
    await expect(createUnitPage.addressSelectionInputError).toHaveText(testData.errorMessages.incorrectChoosenAddress);
    await expect(createUnitPage.addressSelectionInput).toHaveCSS('border-color', testData.borderColors.errorColor);

    await createUnitPage.clickOnSelectOnMapBtn();

    await expect(createUnitPage.mapPopUp).toBeVisible();
    await expect(createUnitPage.mapPopUpTitle).toHaveText(testData.titleTexts.vehiclesOnMap);
    await expect(await createUnitPage.getMapPopUpAddressLineText()).toContain('Київ');
    await expect(createUnitPage.mapPopUpCloseBtn).toBeVisible();

    await createUnitPage.clickOnMapPopUpSubmitBtn();

    await expect(createUnitPage.mapPopUp).not.toBeVisible();
    await expect(await createUnitPage.getAddressLineText()).toContain('Київ');

    await createUnitPage.clickOnSelectOnMapBtn();

    const newAddress: string = await createUnitPage.clickOnMapAndGetAddress();

    await createUnitPage.clickOutsidePopup();

    await expect(await createUnitPage.getAddressLineText()).toBe(newAddress);
})

test('test case C326: Verify "Скасувати" button', async( {createUnitPage} ) => {
    await expect(createUnitPage.cancelBtn).toHaveText(testData.buttonNames.cancel);

    await createUnitPage.cancelBtn.click();
    await createUnitPage.acceptAlert();

    await expect(await createUnitPage.getUrl()).toBe(HOMEPAGE_URL);
})

test('test case C329: Verify "Далі" button', async( {createUnitPage} ) => {
    await expect(createUnitPage.nextBtn).toHaveText(testData.buttonNames.next)

    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.categoryErrorMessage).toBeVisible();
    await expect(createUnitPage.announcementNameInputError).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerInputError).toBeVisible();
    await expect(createUnitPage.addressSelectionInputError).toBeVisible();

    await createUnitPage.fillCategory();
    await createUnitPage.fillAnnouncementName();
    await createUnitPage.fillVehicleManufacturer();
    await createUnitPage.fillAddress();
    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.createUnitTitle).toHaveText(testData.titleTexts.createUnit);
    await createUnitPage.checkCreateUnitTabsTitles(2);
})