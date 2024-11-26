import { test, expect } from "../fixtures";
import { faker } from "@faker-js/faker";
import testData from '../data/test-data.json' assert {type: 'json'}

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALIR_PASSWORD: string = process.env.VALID_PASSWORD || '';
const buttonNames = testData["button names"];
const borderColors = testData["border colors"];
const titleTexts = testData["title texts"];
const placeholderTexts = testData["input placeholder texts"];

test.beforeEach(async ({ homepage, createUnitPage, photoTab }) => {
    await homepage.navigate('/');
    await homepage.closePopUpBtn.click();
    await homepage.createUnitBtn.click();
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALIR_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();
    await createUnitPage.fillCategory();
    await createUnitPage.fillAnnouncementName();
    await createUnitPage.fillVehicleManufacturer();
    await createUnitPage.fillAddress();
    await createUnitPage.clickOnNextBtn();
    await photoTab.uploadPhoto();
    await createUnitPage.clickOnNextBtn();
});

test('Text case: 410: Verify creating new service', async ( {servicesTab} ) => {
    const notExistingService = faker.string.alpha({length: 15});

    await servicesTab.fillServicesTabInput(notExistingService);

    await expect(servicesTab.serviceNotFoundMessage).toBeVisible();
    await expect(servicesTab.createServiceBtn).toBeVisible();
    await expect(await servicesTab.getServiceNotFoundMessageText()).toContain(`На жаль, послугу “${notExistingService}“ не знайдено в нашій базі.`);
    await expect(servicesTab.createServiceBtn).toHaveText(buttonNames["create service"]);

    await servicesTab.createServiceBtn.click();

    await expect(servicesTab.serviceChoosenItem).toBeVisible();
    await expect(servicesTab.serviceChoosenMark).toBeVisible();
});

test('Text case: 411: Verify choosing multiple services', async ( {servicesTab} ) => {
    const randomLetter = faker.string.alpha({length: 1});

    await servicesTab.fillServicesTabInput(randomLetter);

    const serviceSerchItemsTexts = await servicesTab.getServiceSearchItemTexts();
    const serviceSearchItems = await servicesTab.servicesOptions.all();
    const randomNumber = Math.floor(Math.random() * serviceSearchItems.length);

    for(const itemText of serviceSerchItemsTexts) {
        await expect(itemText.toLowerCase()).toContain(randomLetter.toLowerCase());
    }

    for(let i = 0; i <= randomNumber; i++) {
        await servicesTab.servicesOptions.nth(i).click();

        const currentText = await servicesTab.serviceChoosenItem.nth(i).innerText();

        await expect(servicesTab.servicesOptions.nth(i)).toBeVisible();
        await expect(currentText.toLowerCase()).toBe(serviceSerchItemsTexts[i].toLowerCase());
        await expect(servicesTab.serviceChoosenMark.nth(i)).toBeVisible();
        await expect(servicesTab.removeChoosenItemIcon.nth(i)).toBeVisible();
    }
});

test('Text case: 412: Verify removing variants from choosed list', async ( {servicesTab} ) => {
    const randomLetter = faker.string.alpha({length: 1});
    const randomNumber = 2 + Math.floor(Math.random() * 4)

    await servicesTab.fillServicesTabInput(randomLetter);

    for(let i = randomNumber - 1; i >= 0; i--) {
        await servicesTab.servicesOptions.nth(1).click();
    }
    
    const choosenItemsLength = (await servicesTab.getChoosenItems()).length;

    for(let i = choosenItemsLength - 1; i >= 0; i--) {
        await servicesTab.clickOnRemoveChoosenItemIcon(i);
        await expect(servicesTab.serviceChoosenItem).not.toBeVisible();
        if(i === 0) {
            await expect(servicesTab.chosenServicesTitle).not.toBeVisible();
            await expect(servicesTab.choosenServicesContainer).not.toBeVisible();
        }
    }
});

test('Text case: 413: Verify "Назад" button', async ( {photoTab, createUnitPage} ) => {
    await expect(photoTab.prevBtn).toHaveText(buttonNames.previous);

    await photoTab.prevBtn.click();

    await createUnitPage.checkCreateUnitTabsTitles(2);
});

test('Text case: 414: Verify "Далі" button', async ( {createUnitPage, servicesTab} ) => {
    await expect(createUnitPage.nextBtn).toHaveText(buttonNames.next);

    await createUnitPage.clickOnNextBtn();

    await expect(servicesTab.addServiceClueMsg).toBeVisible();
    await expect(servicesTab.addServiceClueMsg).toHaveCSS('border-color', borderColors["error color"]);

    await servicesTab.selectService();
    await createUnitPage.clickOnNextBtn();

    await createUnitPage.checkCreateUnitTabsTitles(4);
});

test('Text case: 591: Verify "Послуги" input with invalid data', async ( {servicesTab} ) => {
    await servicesTab.fillServicesTabInput('<>{};^');

    await expect(await servicesTab.getServicesTabInputValue()).toBe('');

    await servicesTab.typeValueInServicesTabInput('<>{};^');

    await expect(await servicesTab.getServicesTabInputValue()).toBe('');
});

test('Text case: 592: Verify "Послуги" input choosin of existing service', async ( {page, servicesTab} ) => {
    await expect(servicesTab.servicesTabTitle).toHaveText(titleTexts.services);
    await expect(await servicesTab.getServicesParagraphTitleText()).toContain(titleTexts["services paragraph"]);
    await expect(await servicesTab.getServicesParagraphTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(servicesTab.addServiceClueMsg).toBeVisible();
    await expect(servicesTab.addServiceClueMsg).toHaveText('Додайте в оголошення принаймні 1 послугу');
    await expect(servicesTab.searchServiceIcon).toBeVisible();
    await expect(await servicesTab.getServiceTabInputBgText()).toBe(placeholderTexts["services input"]);

    let randomChar = faker.string.alpha({length: 1});

    await servicesTab.fillServicesTabInput(randomChar);

    await expect(servicesTab.servicesOptionsDropDown).toBeVisible();

    await servicesTab.clearServicesTabInput()
    await servicesTab.fillServicesTabInput('буріння');

    await expect(await servicesTab.getSelectedService()).toBe('Буріння');

    await servicesTab.fillServicesTabInput('БУРІННЯ');

    await expect(await servicesTab.getSelectedService()).toBe('Буріння');

    randomChar = faker.string.alpha({length: 1});

    await servicesTab.fillServicesTabInput(randomChar);
    
    const selectedService = await servicesTab.getSelectedService();

    await servicesTab.servicesOptions.first().click();

    await expect(servicesTab.serviceChoosenMark.first()).toHaveAttribute('viewBox', '0 0 15 12');
    await expect(servicesTab.serviceChoosenItem).toBeVisible();
    await expect(servicesTab.removeChoosenItemIcon).toBeVisible();
    await expect(selectedService).toBe(await servicesTab.getChosenItemText());
    await expect(servicesTab.chosenServicesTitle).toBeVisible();
    await expect(await servicesTab.getChoosenItemTitleText()).toContain(titleTexts["choosen services"])
});

test('Text case: 632: Verify entering spesial characters in the "Послуги" input', async ( {servicesTab} ) => {
    await servicesTab.fillServicesTabInput('<>{};^');

    await expect(await servicesTab.getServicesTabInputValue()).toBe('');

    await servicesTab.fillServicesTabInput('Буріння<>{};^');

    await expect(await servicesTab.getServicesTabInputValue()).toBe('Буріння');
    await expect(servicesTab.servicesOptionsDropDown).toBeVisible();

    await servicesTab.clearServicesTabInput();
    await servicesTab.typeValueInServicesTabInput('<>{};^');

    await expect(await servicesTab.getServicesTabInputValue()).toBe('');
});

test('Text case: 633: Verify data length for "Послуги" input field', async ( {servicesTab} ) => {
    const randomChar = faker.string.alpha();
    const random101Char = faker.string.alpha({length: 101});

    await servicesTab.fillServicesTabInput(randomChar);

    const serviceSerchItemsTexts = await servicesTab.getServiceSearchItemTexts();

    await expect(servicesTab.servicesOptionsDropDown).toBeVisible();

    for(const option of serviceSerchItemsTexts) {
        await expect(option.toLowerCase()).toContain(randomChar.toLowerCase());
    }

    await servicesTab.clearServicesTabInput();

    await expect(await servicesTab.getServicesTabInputValue()).toBe('');

    await servicesTab.fillServicesTabInput(random101Char);

    const inputValueLength = await servicesTab.getServicesInputValueLength();
    const currentInputValue = await servicesTab.getServicesTabInputValue();

    await expect(inputValueLength).toBe(100);
    await expect(currentInputValue.toLowerCase()).toBe(random101Char.slice(0, -1).toLowerCase());
});

test('Text case: 634: Verify the search function is not sensitive to upper or lower case', async ( {servicesTab} ) => {
    await servicesTab.fillServicesTabInput('риття');

    await expect(servicesTab.servicesOptionsDropDown).toBeVisible();

    let serviceSerchItemsTexts = await servicesTab.getServiceSearchItemTexts();
    
    for(const text of serviceSerchItemsTexts) {
        await expect(text).toContain('Риття');
    }

    await servicesTab.fillServicesTabInput('РИТТЯ');

    await expect(servicesTab.servicesOptionsDropDown).toBeVisible();

    serviceSerchItemsTexts = await servicesTab.getServiceSearchItemTexts();
    
    for(const text of serviceSerchItemsTexts) {
        await expect(text).toContain('Риття');
    }
});