import { test, expect } from "@playwright/test";
import HomePage from '../pages/home.page';
import CreateUnitPage from '../pages/create.unit.page';
import PhotoTab from '../pages/photo.tab';
import ServicesTab from '../pages/services.tab';
import PricesTab from '../pages/prices.tab';
import { faker } from '@faker-js/faker';
import testData from '../data/test_data.json' assert {type: 'json'};

const incorrectPrices = Object.values(testData['incorrect prices']);

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALIR_PASSWORD: string = process.env.VALID_PASSWORD || '';

let selectedService: string;

let createUnitPage: CreateUnitPage;
let homepage: HomePage;
let photoTab: PhotoTab;
let servicesTab: ServicesTab;
let pricesTab: PricesTab;

test.beforeEach(async ({ page }) => {
    homepage = new HomePage(page);
    createUnitPage = new CreateUnitPage(page);
    photoTab = new PhotoTab(page);
    servicesTab = new ServicesTab(page);
    pricesTab = new PricesTab(page);

    await homepage.navigate('/');
    await homepage.clickOnClosePopUpBtn();
    await homepage.clickOnCreateUnitBtn();
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
    await servicesTab.selectService();
    selectedService = await servicesTab.getSelectedService();
    await createUnitPage.clickOnNextBtn();
});

test('Test case C417: Verify ""Спосіб оплати"" section', async({page}) => {

    await expect(pricesTab.paymentMethodTitle.first()).toBeVisible();
    await expect(await pricesTab.getPaymentMethodTitleText()).toContain('Спосіб оплати');
    await expect(await pricesTab.getPaymentMethodTitleText()).toContain('*');
    await expect(await pricesTab.getDropDownBgText()).toBe('Готівкою / на картку');

    await pricesTab.clickOnPaymentMethodDropDown();

    const paymentMethodDropDownOptionsText = await pricesTab.getPaymentMethodDropDownOptionsText();

    await expect(paymentMethodDropDownOptionsText).toContain('Готівкою / на картку');
    await expect(paymentMethodDropDownOptionsText).toContain('Безготівковий розрахунок (без ПДВ)');
    await expect(paymentMethodDropDownOptionsText).toContain('Безготівковий розрахунок (з ПДВ)');

    const paymentMethodDropDownOptions = await pricesTab.getPaymentMethodDropDownOptions()

    for(let i = paymentMethodDropDownOptions.length -1; i >= 0; i--) {
        let paymentOptionText = await paymentMethodDropDownOptions[i].innerText();
        await paymentMethodDropDownOptions[i].click();
        let displayedText = await pricesTab.paymentMethodDropDown.innerText();

        await expect(displayedText).toBe(paymentOptionText);

        await pricesTab.paymentMethodDropDown.click()
    }
})

test('Test case C418: Verify ""Вартість мінімального замовлення"" section', async({page}) => {
    await expect(pricesTab.priceOfMinOrderTitle).toBeVisible();
    await expect(await pricesTab.getpriceOfMinOrderTitleText()).toContain('Вартість мінімального замовлення');
    await expect(await pricesTab.getpriceOfMinOrderTitleText()).toContain('*');
    await expect(await pricesTab.getpriceOfMinOrderInputBgText()).toBe('Наприклад, 1000');

    const tenDigitNumber = (faker.number.int({ min: 1000000000, max: 9999999999 })).toString();

    await pricesTab.priceOfMinOrderInput.fill(tenDigitNumber);
    let currentInputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(tenDigitNumber.slice(0, tenDigitNumber.length -1));

    await pricesTab.copyPasteValue(pricesTab.priceOfMinOrderInput);

    currentInputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(tenDigitNumber.slice(0, tenDigitNumber.length -1));

    for(const incorrectPrice of incorrectPrices) {
        await pricesTab.clearInput(pricesTab.priceOfMinOrderInput)
        await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, incorrectPrice)
        const inputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }

        await pricesTab.copyPasteValue(pricesTab.priceOfMinOrderInput)

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }
    }

    const nineDigitNumber = (faker.number.int({ min: 100000000, max: 999999999 })).toString();

    await pricesTab.priceOfMinOrderInput.fill(nineDigitNumber);

    currentInputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(nineDigitNumber);

    await pricesTab.copyPasteValue(pricesTab.priceOfMinOrderInput);

    currentInputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(nineDigitNumber);

    await expect(pricesTab.currencyField).toBeVisible();
    await expect(await pricesTab.getCurrencyFieldText()).toBe('UAH');
})

test('Test case C482: Verify adding price for service', async({page}) => {
    await expect(pricesTab.servicePriseTitle).toBeVisible();
    await expect(await pricesTab.getServicePriceTitleText()).toContain('Вартість Ваших послуг');
    await expect(await pricesTab.getServicePriceTitleText()).toContain('*');
    await expect(await pricesTab.getServicePriceClueText()).toContain('За бажанням Ви можете додати вартість конкретних послуг,');
    await expect(pricesTab.addPriceBtn).toBeVisible();
    await expect(pricesTab.addBtnIcon).toBeVisible();
    await expect(pricesTab.addPriceBtn).toHaveText('Додати вартість');

    await pricesTab.clickOnAddPriceBtn();

    await expect(pricesTab.addPriceBtn).not.toBeVisible()
    await expect(pricesTab.addPriceInput).toBeVisible();
    await expect(pricesTab.addPriceCurrency).toBeVisible();
    await expect(pricesTab.selectAddPriceOptionDropDown).toBeVisible();

    const tenDigitNumber = (faker.number.int({ min: 1000000000, max: 9999999999 })).toString();

    await pricesTab.fillInput(pricesTab.addPriceInput, tenDigitNumber)

    let currentInputValue = await pricesTab.getInputValue(pricesTab.addPriceInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(tenDigitNumber.slice(0, tenDigitNumber.length -1));

    await pricesTab.copyPasteValue(pricesTab.addPriceInput);

    currentInputValue = await pricesTab.getInputValue(pricesTab.addPriceInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(tenDigitNumber.slice(0, tenDigitNumber.length -1));
    
    for(const incorrectPrice of incorrectPrices) {
        await pricesTab.clearInput(pricesTab.addPriceInput);
        await pricesTab.fillInput(pricesTab.addPriceInput, incorrectPrice);

        const inputValue = await pricesTab.getInputValue(pricesTab.addPriceInput);

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }

        await pricesTab.copyPasteValue(pricesTab.addPriceInput)

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }
    }

    const nineDigitNumber = (faker.number.int({ min: 100000000, max: 999999999 })).toString();

    await pricesTab.fillInput(pricesTab.addPriceInput, nineDigitNumber);

    currentInputValue = await pricesTab.getInputValue(pricesTab.addPriceInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(nineDigitNumber);

    await pricesTab.copyPasteValue(pricesTab.addPriceInput);

    currentInputValue = await pricesTab.addPriceInput.inputValue();

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(nineDigitNumber);

    await expect(pricesTab.addPriceCurrency).toBeVisible();
    await expect(await pricesTab.getAddPriceCurrencyFieldText()).toBe('UAH');

    await expect(pricesTab.selectAddPriceOptionDropDown).toBeVisible();
    await expect(await pricesTab.getSelectAddPriceOptionDropDownBgText()).toBe('Година');
    await expect(pricesTab.selectAddPriceOptionDropDownArrow).toBeVisible();

    await pricesTab.checkOptionSelectionInAddPriceDropDown();

    await pricesTab.clickOnRemovePriceBtn();

    await expect(pricesTab.additionalServicePriceSection).not.toBeVisible();

    await expect(pricesTab.addPriceBtn).toBeVisible();
    await expect(pricesTab.addBtnIcon).toBeVisible();
    await expect(pricesTab.addPriceBtn).toHaveText('Додати вартість');
})

test('Test case C488: Verify ""Назад"" button', async({page}) => {
    await pricesTab.checkPrevBtnText('Назад');
    await pricesTab.clickOnPrevBtn();
    await createUnitPage.checkCreateUnitTabsTitles(3);
})

test('Test case C489: Verify ""Далі"" button', async({page}) => {
    await expect(createUnitPage.nextBtn).toBeVisible();
    await expect(createUnitPage.nextBtn).toHaveText('Далі');

    await createUnitPage.clickOnNextBtn();

    await createUnitPage.checkCreateUnitTabsTitles(4);

    await expect(pricesTab.priceOfMinOrderInputError).toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputError).toHaveText('Це поле обов’язкове');
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', 'rgb(247, 56, 89)');
})

test('Test case C596: Verify adding an invalid price in the "Вартість мінімального замовлення *" input', async({page}) => {
    await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, '0');

    await expect(await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput)).toBe('');

    await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, '1');

    await expect(await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput)).toBe('1');

    await createUnitPage.clickOnNextBtn();

    await expect(pricesTab.priceOfMinOrderInputError).toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputError).toHaveText('Мінімальна вартiсть має бути не менше 1000 грн');
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', 'rgb(247, 56, 89)');

    await pricesTab.clearInput(pricesTab.priceOfMinOrderInput);

    await expect(pricesTab.priceOfMinOrderInputError).toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputError).toHaveText('Це поле обов’язкове');
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', 'rgb(247, 56, 89)');

    await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, '1000');

    await expect(await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput)).toBe('1000');
    await expect(pricesTab.priceOfMinOrderInputError).not.toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', 'rgb(229, 229, 229)');
})

test('Test case C636: Verify the data entry in the "Вартість мінімального замовлення *" input', async({page}) => {
    const tenDigitNumber = (faker.number.int({ min: 1000000000, max: 9999999999 })).toString();

    await pricesTab.priceOfMinOrderInput.fill(tenDigitNumber);
    let currentInputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(tenDigitNumber.slice(0, tenDigitNumber.length -1));

    await pricesTab.copyPasteValue(pricesTab.priceOfMinOrderInput);

    currentInputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(tenDigitNumber.slice(0, tenDigitNumber.length -1));

    for(const incorrectPrice of incorrectPrices) {
        await pricesTab.clearInput(pricesTab.priceOfMinOrderInput)
        await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, incorrectPrice)
        const inputValue = await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput);

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }

        await pricesTab.copyPasteValue(pricesTab.priceOfMinOrderInput)

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }
    }
})

test('Test case C637: Verify UI of the "Вартість Ваших послуг *" section', async({page}) => {
    await expect(pricesTab.servicePriseTitle).toBeVisible();
    await expect(await pricesTab.getServicePriceTitleText()).toContain('Вартість Ваших послуг');
    await expect(await pricesTab.getServicePriceTitleText()).toContain('*');
    await expect(await pricesTab.getServicePriceClueText()).toContain('За бажанням Ви можете додати вартість конкретних послуг,');
    await expect(pricesTab.addPriceBtn).toBeVisible();
    await expect(pricesTab.addBtnIcon).toBeVisible();
    await expect(pricesTab.addPriceBtn).toHaveText('Додати вартість');

    await expect(selectedService).toBe(await pricesTab.getServiceFromAddPriceSection());

    await pricesTab.clickOnAddPriceBtn();

    await expect(pricesTab.addPriceBtn).not.toBeVisible();
    await expect(pricesTab.removePriceBtn).toBeVisible();
    await expect(pricesTab.addPriceCurrency).toBeVisible();
    await expect(await pricesTab.getAddPriceInputBgText()).toBe('Наприклад, 1000')
    await expect(await pricesTab.getAddPriceCurrencyFieldText()).toBe('UAH');
    await expect(pricesTab.selectAddPriceOptionDropDown).toBeVisible();
    await expect(await pricesTab.getSelectAddPriceOptionDropDownBgText()).toBe('Година');
    await expect(pricesTab.selectAddPriceOptionDropDownArrow).toBeVisible();
})

test('Test case C638: Verify the data entry in the "Вартість Ваших послуг *" price input', async({page}) => {
    await pricesTab.clickOnAddPriceBtn();

    await expect(pricesTab.addPriceBtn).not.toBeVisible();
    await expect(pricesTab.removePriceBtn).toBeVisible();
    await expect(pricesTab.addPriceCurrency).toBeVisible();
    await expect(await pricesTab.getAddPriceInputBgText()).toBe('Наприклад, 1000')
    await expect(await pricesTab.getAddPriceCurrencyFieldText()).toBe('UAH');
    await expect(pricesTab.selectAddPriceOptionDropDown).toBeVisible();

    for(const incorrectPrice of incorrectPrices) {
        await pricesTab.clearInput(pricesTab.addPriceInput);
        await pricesTab.fillInput(pricesTab.addPriceInput, incorrectPrice);

        const inputValue = await pricesTab.getInputValue(pricesTab.addPriceInput);

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }

        await pricesTab.copyPasteValue(pricesTab.addPriceInput)

        if(incorrectPrice.includes('1')) {
            await expect(inputValue).toBe(incorrectPrice.split(' ').join(''));
        }else {
            await expect(inputValue).toBe('');
        }
    }

    const nineDigitNumber = (faker.number.int({ min: 100000000, max: 999999999 })).toString();

    await pricesTab.fillInput(pricesTab.addPriceInput, nineDigitNumber);

    let currentInputValue = await pricesTab.getInputValue(pricesTab.addPriceInput);

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(nineDigitNumber);

    await pricesTab.copyPasteValue(pricesTab.addPriceInput);

    currentInputValue = await pricesTab.addPriceInput.inputValue();

    await expect(currentInputValue.length).toBe(9);
    await expect(currentInputValue).toBe(nineDigitNumber);
})