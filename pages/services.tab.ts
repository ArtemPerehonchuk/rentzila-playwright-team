import { Page as PlaywrightPage } from '@playwright/test';
import Page from './page';
import { getRandomLetter } from '../helpers/random_values';

class ServicesTab extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
        } 

    servicesTabTitle = this.page.locator('[class*="ServicesUnitFlow_title"]');
    servicesTabInput = this.page.locator('div[class*="ServicesUnitFlow_searchInput"] > input');
    servicesOptionsDropDown = this.page.locator('[data-testid="searchResult"]')
    servicesOptions = this.page.locator('[data-testid="searchItem-servicesUnitFlow"]');
    serviceNotFoundMessage = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    createServiceBtn = this.page.locator('[data-testid="btn-addNewItem"]');
    createServiceBtnPlusIcon = this.page.locator('[data-testid="svg-plus-addNewItem"]');
    serviceChoosenItem = this.page.locator('[data-testid="item-servicesUnitFlow"]');
    serviceChoosenMark = this.page.locator('[data-testid="unitServicesButton"] > svg');
    removeChoosenItemIcon = this.page.locator('[data-testid="remove-servicesUnitFlow"]');
    chosenServicesTitle = this.page.locator('[class*="ServicesUnitFlow_paragraph"]').nth(1);
    choosenServicesContainer = this.page.locator('[class*="ServicesUnitFlow_servicesWrapper"]');
    addServiceClueMsg = this.page.locator('[data-testid="add-info"]');
    servicesParagraphTitle = this.page.locator('[class*="ServicesUnitFlow_paragraph"]').first();
    searchServiceIcon = this.page.locator('[data-testid="searchResult"] > div > svg');

    async selectService() {
        await this.servicesTabInput.fill(getRandomLetter());
        await this.servicesOptions.first().click();
    }

    async getSelectedService() {
       const selectedService =  await this.servicesOptions.first().innerText();
       return selectedService;
    }

    async clickOnServicesOption() {
        await this.servicesOptions.first().click();
    }

    async fillServicesTabInput(value: string) {
        await this.servicesTabInput.fill(value);
    }

    async getServiceNotFoundMessageText() {
        return await this.serviceNotFoundMessage.innerText();    
    }

    async clickOnCreateServiceBtn() {
        await this.createServiceBtn.click();
    }

    async getServiceSearchItemTexts() {
        return await this.servicesOptions.allInnerTexts();
    }

    async getChoosenItems() {
        return await this.serviceChoosenItem.all()
    }

    async clickOnRemoveChoosenItemIcon(index: number) {
        await this.removeChoosenItemIcon.nth(index).click();
    }

    async getServicesTabInputValue() {
        return await this.servicesTabInput.inputValue();
    }

    async typeValueInServicesTabInput(value: string) {
        await this.servicesTabInput.type(value);
    }

    async getServicesParagraphTitleText() {
        return await this.servicesParagraphTitle.innerText();
    }

    async getServiceTabInputBgText() {
        return await this.servicesTabInput.getAttribute('placeholder');
    }

    async clearServicesTabInput() {
        await this.servicesTabInput.clear();
    }

    async getChosenItemText() {
        return await this.serviceChoosenItem.innerText();
    }

    async getChoosenItemTitleText() {
        return await this.chosenServicesTitle.innerText();
    }

    async getServicesInputValueLength() {
        return (await this.getServicesTabInputValue()).length
    }
}

export default ServicesTab;