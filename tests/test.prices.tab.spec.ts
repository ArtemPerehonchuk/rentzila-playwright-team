import { test, expect } from "../fixtures";
import { faker } from '@faker-js/faker';
import testData from '../data/test-data.json' assert {type: 'json'};

const incorrectPrices = Object.values(testData['incorrect prices']);

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALIR_PASSWORD: string = process.env.VALID_PASSWORD || '';
const titleTexts = testData["title texts"];
const paymentMetods = testData["payment methods"];
const placeholderTexts = testData["input placeholder texts"];
const buttonNamess = testData["button names"];
const addPriceOptions = testData["add price options"];
const errorMessages = testData["error messages"];
const borderColors = testData["border colors"];

let selectedService: string;

test.beforeEach(async ({ homepage, createUnitPage, photoTab, servicesTab }) => {
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
    await servicesTab.selectService();
    selectedService = await servicesTab.getSelectedService();
    await createUnitPage.clickOnNextBtn();
});

test('Test case C417: Verify "Спосіб оплати" section', async({pricesTab}) => {

    await expect(pricesTab.paymentMethodTitle.first()).toBeVisible();
    await expect(await pricesTab.getPaymentMethodTitleText()).toContain(titleTexts["payment method"]);
    await expect(await pricesTab.getPaymentMethodTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await pricesTab.getDropDownBgText()).toBe(paymentMetods[0]);

    await pricesTab.paymentMethodDropDown.click();

    const paymentMethodDropDownOptionsText = await pricesTab.getPaymentMethodDropDownOptionsText();

    await expect(paymentMethodDropDownOptionsText).toContain(paymentMetods[0]);
    await expect(paymentMethodDropDownOptionsText).toContain(paymentMetods[1]);
    await expect(paymentMethodDropDownOptionsText).toContain(paymentMetods[2]);

    const paymentMethodDropDownOptions = await pricesTab.getPaymentMethodDropDownOptions()

    for(let i = paymentMethodDropDownOptions.length -1; i >= 0; i--) {
        let paymentOptionText = await paymentMethodDropDownOptions[i].innerText();
        await paymentMethodDropDownOptions[i].click();
        let displayedText = await pricesTab.paymentMethodDropDown.innerText();

        await expect(displayedText).toBe(paymentOptionText);

        await pricesTab.paymentMethodDropDown.click()
    }
})

test('Test case C418: Verify "Вартість мінімального замовлення" section', async({pricesTab}) => {
    await expect(pricesTab.priceOfMinOrderTitle).toBeVisible();
    await expect(await pricesTab.getpriceOfMinOrderTitleText()).toContain(titleTexts["min order price"]);
    await expect(await pricesTab.getpriceOfMinOrderTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await pricesTab.getpriceOfMinOrderInputBgText()).toBe(placeholderTexts["min order input"]);

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

test('Test case C482: Verify adding price for service', async({pricesTab}) => {
    await expect(pricesTab.servicePriseTitle).toBeVisible();
    await expect(await pricesTab.getServicePriceTitleText()).toContain(titleTexts["services price"]);
    await expect(await pricesTab.getServicePriceTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await pricesTab.getServicePriceClueText()).toContain('За бажанням Ви можете додати вартість конкретних послуг,');
    await expect(pricesTab.addPriceBtn).toBeVisible();
    await expect(pricesTab.addBtnIcon).toBeVisible();
    await expect(pricesTab.addPriceBtn).toHaveText(buttonNamess["add price"]);

    await pricesTab.addBtnIcon.click();

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
    await expect(await pricesTab.getSelectAddPriceOptionDropDownBgText()).toBe(addPriceOptions[0]);
    await expect(pricesTab.selectAddPriceOptionDropDownArrow).toBeVisible();

    await pricesTab.checkOptionSelectionInAddPriceDropDown();

    await pricesTab.removePriceBtn.click();

    await expect(pricesTab.additionalServicePriceSection).not.toBeVisible();

    await expect(pricesTab.addPriceBtn).toBeVisible();
    await expect(pricesTab.addBtnIcon).toBeVisible();
    await expect(pricesTab.addPriceBtn).toHaveText(buttonNamess["add price"]);
})

test('Test case C488: Verify "Назад" button', async({pricesTab, createUnitPage}) => {
    await pricesTab.checkPrevBtnText('Назад');
    await pricesTab.prevBtn.click();
    await createUnitPage.checkCreateUnitTabsTitles(3);
})

test('Test case C489: Verify "Далі" button', async({createUnitPage, pricesTab}) => {
    await expect(createUnitPage.nextBtn).toBeVisible();
    await expect(createUnitPage.nextBtn).toHaveText('Далі');

    await createUnitPage.clickOnNextBtn();

    await createUnitPage.checkCreateUnitTabsTitles(4);

    await expect(pricesTab.priceOfMinOrderInputError).toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputError).toHaveText(errorMessages["required field"]);
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', borderColors["error color"]);
})

test('Test case C596: Verify adding an invalid price in the "Вартість мінімального замовлення" input', async({pricesTab, createUnitPage}) => {
    await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, '0');

    await expect(await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput)).toBe('');

    await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, '1');

    await expect(await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput)).toBe('1');

    await createUnitPage.clickOnNextBtn();

    await expect(pricesTab.priceOfMinOrderInputError).toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputError).toHaveText(errorMessages["min price less 1000"]);
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', borderColors["error color"]);

    await pricesTab.clearInput(pricesTab.priceOfMinOrderInput);

    await expect(pricesTab.priceOfMinOrderInputError).toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputError).toHaveText(errorMessages["required field"]);
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', borderColors["red color"]);

    await pricesTab.fillInput(pricesTab.priceOfMinOrderInput, '1000');

    await expect(await pricesTab.getInputValue(pricesTab.priceOfMinOrderInput)).toBe('1000');
    await expect(pricesTab.priceOfMinOrderInputError).not.toBeVisible();
    await expect(pricesTab.priceOfMinOrderInputContainer).toHaveCSS('border-color', borderColors["default grey"]);
})

test('Test case C636: Verify the data entry in the "Вартість мінімального замовлення" input', async({pricesTab}) => {
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

test('Test case C637: Verify UI of the "Вартість Ваших послуг" section', async({pricesTab}) => {
    await expect(pricesTab.servicePriseTitle).toBeVisible();
    await expect(await pricesTab.getServicePriceTitleText()).toContain(titleTexts["services price"]);
    await expect(await pricesTab.getServicePriceTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await pricesTab.getServicePriceClueText()).toContain('За бажанням Ви можете додати вартість конкретних послуг,');
    await expect(pricesTab.addPriceBtn).toBeVisible();
    await expect(pricesTab.addBtnIcon).toBeVisible();
    await expect(pricesTab.addPriceBtn).toHaveText(buttonNamess["add price"]);

    await expect(selectedService).toBe(await pricesTab.getServiceFromAddPriceSection());

    await pricesTab.addPriceBtn.click();

    await expect(pricesTab.addPriceBtn).not.toBeVisible();
    await expect(pricesTab.removePriceBtn).toBeVisible();
    await expect(pricesTab.addPriceCurrency).toBeVisible();
    await expect(await pricesTab.getAddPriceInputBgText()).toBe(placeholderTexts["min order input"])
    await expect(await pricesTab.getAddPriceCurrencyFieldText()).toBe('UAH');
    await expect(pricesTab.selectAddPriceOptionDropDown).toBeVisible();
    await expect(await pricesTab.getSelectAddPriceOptionDropDownBgText()).toBe(addPriceOptions[0]);
    await expect(pricesTab.selectAddPriceOptionDropDownArrow).toBeVisible();
})

test('Test case C638: Verify the data entry in the "Вартість Ваших послуг" price input', async({pricesTab}) => {
    await pricesTab.addPriceBtn.click();

    await expect(pricesTab.addPriceBtn).not.toBeVisible();
    await expect(pricesTab.removePriceBtn).toBeVisible();
    await expect(pricesTab.addPriceCurrency).toBeVisible();
    await expect(await pricesTab.getAddPriceInputBgText()).toBe(placeholderTexts["min order input"])
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