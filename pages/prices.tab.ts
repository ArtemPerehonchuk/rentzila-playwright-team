import { Page as PlaywrightPage, expect, Locator } from '@playwright/test';
import Page from './page';
import testData from '../data/test.data.json' assert {type: 'json'};

const addPriceOptions = testData['add price options'];
const hoursDropDownItems = ['8 год', '4 год'];


class PricesTab extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
        } 
    
    paymentMethodTitle: Locator = this.page.locator('[class*="PricesUnitFlow_paragraph"]').first();
    paymentMethodDropDown: Locator = this.page.locator('div[data-testid="div_CustomSelect"]');
    paymentMethodDropDownOptions: Locator = this.page.locator('[data-testid="item-customSelect"]');
    priceOfMinOrderTitle: Locator = this.page.locator('[class*="PricesUnitFlow_paragraph"]').nth(1);
    priceOfMinOrderInput: Locator = this.page.locator('[class*="RowUnitPrice_priceInput"]');
    priceOfMinOrderInputContainer: Locator = this.page.locator('[data-testid="input_wrapper_RowUnitPrice"]').first();
    currencyField: Locator = this.page.locator('[class*="RowUnitPrice_currencyWrapper"] > input');
    servicePriseTitle: Locator = this.page.locator('[data-testid="div_servicePrices_PricesUnitFlow"]');
    servicePriceClue: Locator = this.page.locator('[class*="PricesUnitFlow_description"]');
    addPriceBtn: Locator = this.page.locator('[data-testid="addPriceButton_ServicePrice"]');
    addBtnIcon: Locator = this.page.locator('[data-testid="addPriceButton_ServicePrice"] > svg');
    addPriceInput: Locator = this.page.locator('[data-testid="priceInput_RowUnitPrice"]').nth(2);
    addPriceCurrency: Locator = this.page.locator('[data-testid="priceInput_RowUnitPrice"]').nth(3);
    selectAddPriceOptionDropDown: Locator = this.page.locator('[data-testid="div_CustomSelect"]').nth(1);
    selectAddPriceOptionDropDownArrow : Locator= this.page.locator('[data-testid="arrowImage"]').nth(1);
    addPriceDropDownOptions: Locator = this.page.locator('li[class*="CustomSelect_option"]');
    hoursDropDown: Locator = this.page.locator('[class*="RowUnitPrice_selectTiming"] > [class*="CustomSelect_select"]').nth(1);
    hoursDropDownArrow: Locator = this.page.locator('[data-testid="arrowImage"]').nth(2);
    hoursDropDownOptions: Locator = this.page.locator('[data-testid="listItems-customSelect"] > [data-testid="item-customSelect"]');
    removePriceBtn: Locator = this.page.locator('[data-testid="div_removePrice_RowUnitPrice"]');
    additionalServicePriceSection: Locator = this.page.locator('[class*="RowUnitPrice_wrapper"]').nth(1);
    prevBtn: Locator = this.page.locator('[data-testid="prevButton"]');
    priceOfMinOrderInputError: Locator = this.page.locator('[class*="RowUnitPrice_error"]');
    serviceInAddPriceSection: Locator = this.page.locator('[class*="ServicePrice_service"] > span')

    async getDropDownBgText() {
        return await this.paymentMethodDropDown.innerText();
    }

    async getPaymentMethodTitleText() {
        return await this.paymentMethodTitle.innerText();
    }

    async getPaymentMethodDropDownOptionsText() {
        return await this.paymentMethodDropDownOptions.allInnerTexts()
    }

    async getPaymentMethodDropDownOptions() {
        return await this.paymentMethodDropDownOptions.all();
    }

    async getpriceOfMinOrderTitleText() {
        return await this.priceOfMinOrderTitle.innerText();
    }

    async getpriceOfMinOrderInputBgText() {
        return await this.priceOfMinOrderInput.getAttribute('placeholder');
    }

    async clearInput(inputLocator: Locator) {
        await inputLocator.clear();
    }

    async fillInput(inputLocator: Locator, value: any) {
        await inputLocator.fill(value)
    }

    async getInputValue(inputLocator: Locator) {
        return await inputLocator.inputValue();
    }

    async copyPasteValue(inputLocator: Locator) {
        await inputLocator.waitFor({ state: 'visible' });
        await inputLocator.click();
        await this.page.keyboard.press('Meta+A');
        await this.page.keyboard.press('Meta+C');
        await inputLocator.clear();
        await inputLocator.click();
        await this.page.keyboard.press('Meta+V');
    }

    async getCurrencyFieldText() {
        return await this.currencyField.inputValue();
    }

    async getAddPriceCurrencyFieldText() {
        return await this.addPriceCurrency.inputValue();
    }

    async getServicePriceTitleText() {
        return await this.servicePriseTitle.innerText();
    }

    async getServicePriceClueText() {
        return await this.servicePriceClue.innerText();
    }

    async getAddPriceInputBgText() {
       return await this.addPriceInput.getAttribute('placeholder');
    }

    async getSelectAddPriceOptionDropDownBgText() {
        return this.selectAddPriceOptionDropDown.innerText();
    }

    async checkOptionSelectionInAddPriceDropDown() {
        const count = await this.addPriceDropDownOptions.count();
        for(let i = 0; i < count; i++) {
            await this.selectAddPriceOptionDropDown.click();
            await this.page.waitForLoadState('networkidle');
            const currentOptionText = await this.addPriceDropDownOptions.nth(i).innerText();
            await this.addPriceDropDownOptions.nth(i).click();
            if(currentOptionText === 'Зміна') {
                let hoursDropDownBgText = await this.hoursDropDown.innerText();
                await expect(this.hoursDropDown).toBeVisible();
                await expect(hoursDropDownBgText).toBe('8');
                await expect(this.hoursDropDownArrow).toBeVisible();
    
                for(let i = 0; i < hoursDropDownItems.length; i++) {
                    await this.hoursDropDown.click();

                    const hoursDropDownOptionText = await this.hoursDropDownOptions.nth(i).innerText();

                    await expect(hoursDropDownItems).toContain(hoursDropDownOptionText);
                    await this.hoursDropDownOptions.nth(i).click();
                    hoursDropDownBgText = await this.hoursDropDown.innerText();
                    await expect(hoursDropDownBgText).toBe(hoursDropDownOptionText);
                }
                
            }
            await expect(addPriceOptions).toContain(currentOptionText);
            const currentAddPriceDropDownBgText = await this.addPriceDropDownOptions.innerText();
            await expect(currentAddPriceDropDownBgText).toBe(currentOptionText);
        }
    }

    async checkPrevBtnText(expectedText: string) {
        const currentText = await this.prevBtn.innerText();
        await expect(currentText).toBe(expectedText);
    }

    async getServiceFromAddPriceSection() {
        const service = await this.serviceInAddPriceSection.innerText();
        return service;
    }
}

export default PricesTab;