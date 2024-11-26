import { test, expect } from "../fixtures";
import { faker } from '@faker-js/faker';
import { getStringWithSpaceIncide, getStringWithSpaceInEnd } from '../helpers/random-values';
import testData from '../data/test-data.json' assert {type: 'json'}

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const HOMEPAGE_URL: string = process.env.HOMEPAGE_URL || '';
const titleTexts = testData["title texts"];
const placeholderTexts = testData["input placeholder texts"];
const errorMessages = testData["error messages"];
const borderColors = testData["border colors"];
const buttonNames = testData["button names"];

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
    await expect(createUnitPage.createUnitTitle).toHaveText(titleTexts["create unit"]);
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
    await expect(await createUnitPage.getCategoriesTitleText()).toContain(titleTexts.category);
    await expect(await createUnitPage.getCategoriesTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await createUnitPage.getCategoriesDropDownBgText()).toContain(placeholderTexts["choose category"]);

    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.categoryErrorMessage).toBeVisible();
    await expect(await createUnitPage.getCategoryInputErrorText()).toBe(errorMessages["required field"]);
    await expect(createUnitPage.categoriesDropDown).toHaveCSS('border-color', borderColors["error color"]);

    await createUnitPage.categoriesDropDown.click();

    await expect(createUnitPage.categoriesPopUp).toBeVisible();
    await expect(createUnitPage.categoriesPopUpTitle).toHaveText(titleTexts["categories pop up"]);

    await createUnitPage.clickOnCategoriesPopUpCloseBtn();

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
    await expect(await createUnitPage.getAnnouncementNameTitleText()).toContain(titleTexts["announcement name"]);
    await expect(await createUnitPage.getAnnouncementNameTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await createUnitPage.getAnnouncementNameInputBgText()).toContain(placeholderTexts["announcement name input"]);

    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.announcementNameInputError).toBeVisible();
    await expect(createUnitPage.announcementNameInputError).toHaveText(errorMessages["required field"]);
    await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["error color"]);

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
        await createUnitPage.clearSectionInput(createUnitPage.announcementNameInput)
        await createUnitPage.announcementNameInput.type(value)

        switch(value) {
            case randomToNineCharNumber:
                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(errorMessages["announcement name less 10 symbols"]);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["error color"]);

                await createUnitPage.copyPasteValueInSectionInput(createUnitPage.announcementNameInput);

                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(errorMessages["announcement name less 10 symbols"]);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["error color"]);
                break
            
            case random101CharString:
                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(errorMessages["announcement name more 100 symbols"]);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["error color"]);
                await expect(await createUnitPage.getAnnouncementInputValueCharCount()).toBe(100);

                await createUnitPage.copyPasteValueInSectionInput(createUnitPage.announcementNameInput);
                await createUnitPage.announcementNameInput.type(randomOneCharString);

                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(errorMessages["announcement name more 100 symbols"]);
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["error color"]);
                break
            
            case '<>{};^':
                await expect(createUnitPage.announcementNameInputError).toBeVisible();
                await expect(createUnitPage.announcementNameInputError).toHaveText(errorMessages["announcement name less 10 symbols"]);
                await expect(await createUnitPage.getAnnouncementNameInputValueText()).toBe('');
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["error color"]);
                break
            
            case randomTenCharString:
                await expect(createUnitPage.announcementNameInputError).not.toBeVisible();
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["default grey"]);

                await createUnitPage.copyPasteValueInSectionInput(createUnitPage.announcementNameInput);

                await expect(createUnitPage.announcementNameInputError).not.toBeVisible();
                await expect(createUnitPage.announcementNameInput).toHaveCSS('border-color', borderColors["default grey"]);
                break
        }
    }
})

test('test case C298: Verify vehicle manufacturer section', async( {createUnitPage} ) => {
    await expect(createUnitPage.vehicleManufacturerTitle).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerInput).toBeVisible();
    await expect(await createUnitPage.getVehicleManufacturerTitleText()).toContain(titleTexts["vehicle manufacturer"]);
    await expect(await createUnitPage.getVehicleManufacturerTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await createUnitPage.getVehicleManufacturerInputBgText()).toContain(placeholderTexts["vehicle manufacturer input"]);
   
    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.vehicleManufacturerInputError).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerInputSearchIcon).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerInputError).toHaveText(errorMessages["required field"]);
    await expect(createUnitPage.vehicleManufacturerInputContainer).toHaveCSS('border-color', borderColors["dark blue"]);

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
    await expect(await createUnitPage.getModelNameTitleText()).toContain(titleTexts["model name"]);
    await expect(await createUnitPage.getModelNameInputBgText()).toBe(placeholderTexts["model name input"]);

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
            await expect(createUnitPage.modelNameInputError).toHaveText(errorMessages["model name less 15 symbols"]);
            await expect(createUnitPage.modelNameInput).toHaveCSS('border-color', borderColors["error color"]);

            await createUnitPage.copyPasteValueInSectionInput(createUnitPage.modelNameInput);

            await expect(createUnitPage.modelNameInputError).toBeVisible();
            await expect(createUnitPage.modelNameInputError).toHaveText(errorMessages["model name less 15 symbols"]);
            await expect(createUnitPage.modelNameInput).toHaveCSS('border-color', borderColors["error color"]);

            await createUnitPage.clearSectionInput(createUnitPage.modelNameInput);
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
    await expect(createUnitPage.technicalInfoTitle).toHaveText(titleTexts["technical characteristics"]);
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
    await expect(createUnitPage.descriptionInfoTitle).toHaveText(titleTexts["detail description"]);
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
    await expect(await createUnitPage.getAddressSelectionTitleText()).toContain(titleTexts["vehical address"]);
    await expect(await createUnitPage.getAddressSelectionTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(createUnitPage.addressSelectionInput).toHaveText(placeholderTexts["choose on map"]);

    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.addressSelectionInputError).toBeVisible();
    await expect(createUnitPage.addressSelectionInputError).toHaveText(errorMessages["incorrect choosen address"]);
    await expect(createUnitPage.addressSelectionInput).toHaveCSS('border-color', borderColors["error color"]);

    await createUnitPage.clickOnSelectOnMapBtn();

    await expect(createUnitPage.mapPopUp).toBeVisible();
    await expect(createUnitPage.mapPopUpTitle).toHaveText(titleTexts["vehicles on map"]);
    await expect(await createUnitPage.getMapPopUpAddressLineText()).toBe('Київ, вулиця Володимирська 21/20 Україна, Київська область');
    await expect(createUnitPage.mapPopUpCloseBtn).toBeVisible();

    await createUnitPage.clickOnMapPopUpSubmitBtn();

    await expect(createUnitPage.mapPopUp).not.toBeVisible();
    await expect(await createUnitPage.getAddressLineText()).toBe('Київ, вулиця Володимирська 21/20 Україна, Київська область');

    await createUnitPage.clickOnSelectOnMapBtn();

    const newAddress: string = await createUnitPage.clickOnMapAndGetAddress();

    await createUnitPage.clickOutsidePopup();

    await expect(await createUnitPage.getAddressLineText()).toBe(newAddress);
})

test('test case C326: Verify "Скасувати" button', async( {createUnitPage} ) => {
    await expect(createUnitPage.cancelBtn).toHaveText(buttonNames.cancel);

    await createUnitPage.cancelBtn.click();
    await createUnitPage.acceptAlert();

    await expect(await createUnitPage.getUrl()).toBe(HOMEPAGE_URL);
})

test('test case C329: Verify "Далі" button', async( {createUnitPage} ) => {
    await expect(createUnitPage.nextBtn).toHaveText(buttonNames.next)

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

    await expect(createUnitPage.createUnitTitle).toHaveText(titleTexts["create unit"]);
    await createUnitPage.checkCreateUnitTabsTitles(2);
})