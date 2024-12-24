import { Page as PlaywrightPage,Locator } from '@playwright/test';
import Page from './page';
import { getRandomLetter } from '../helpers/random.values';

class ServicesTab extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
        } 

    readonly servicesTabTitle: Locator = this.page.locator('[class*="ServicesUnitFlow_title"]');
    readonly servicesTabInput: Locator = this.page.locator('div[class*="ServicesUnitFlow_searchInput"] > input');
    readonly servicesOptionsDropDown: Locator = this.page.locator('[data-testid="searchResult"]')
    readonly servicesOptions: Locator = this.page.locator('[data-testid="searchItem-servicesUnitFlow"]');
    readonly serviceNotFoundMessage: Locator = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    readonly createServiceBtn: Locator = this.page.locator('[data-testid="btn-addNewItem"]');
    readonly createServiceBtnPlusIcon: Locator = this.page.locator('[data-testid="svg-plus-addNewItem"]');
    readonly serviceChoosenItem: Locator = this.page.locator('[data-testid="item-servicesUnitFlow"]');
    readonly serviceChoosenMark: Locator = this.page.locator('[data-testid="unitServicesButton"] > svg');
    readonly removeChoosenItemIcon: Locator = this.page.locator('[data-testid="remove-servicesUnitFlow"]');
    readonly chosenServicesTitle: Locator = this.page.locator('[class*="ServicesUnitFlow_paragraph"]').nth(1);
    readonly choosenServicesContainer: Locator = this.page.locator('[class*="ServicesUnitFlow_servicesWrapper"]');
    readonly addServiceClueMsg: Locator = this.page.locator('[data-testid="add-info"]');
    readonly servicesParagraphTitle: Locator = this.page.locator('[class*="ServicesUnitFlow_paragraph"]').first();
    readonly searchServiceIcon: Locator = this.page.locator('[data-testid="searchResult"] > div > svg');

    async selectService() {
        await this.servicesTabInput.fill(getRandomLetter());
        await this.servicesOptions.first().click();
    }

    async getSelectedService() {
       const selectedService =  await this.servicesOptions.first().innerText();
       return selectedService;
    }

    async fillServicesTabInput(value: string) {
        await this.servicesTabInput.fill(value);
    }

    async getServiceNotFoundMessageText(): Promise<string> {
        return await this.serviceNotFoundMessage.innerText();    
    }

    async getServiceSearchItemTexts(): Promise<string[]> {
        return await this.servicesOptions.allInnerTexts();
    }

    async getChoosenItems(): Promise<Locator[]> {
        return await this.serviceChoosenItem.all()
    }

    async clickOnRemoveChoosenItemIcon(index: number) {
        await this.removeChoosenItemIcon.nth(index).click();
    }

    async getServicesTabInputValue(): Promise<string> {
        return await this.servicesTabInput.inputValue();
    }

    async typeValueInServicesTabInput(value: string) {
        await this.servicesTabInput.type(value);
    }

    async getServicesParagraphTitleText(): Promise<string> {
        return await this.servicesParagraphTitle.innerText();
    }

    async getServiceTabInputBgText(): Promise<string | null> {
        return await this.servicesTabInput.getAttribute('placeholder');
    }

    async clearServicesTabInput() {
        await this.servicesTabInput.clear();
    }

    async getChosenItemText(): Promise<string> {
        return await this.serviceChoosenItem.innerText();
    }

    async getChoosenItemTitleText(): Promise<string> {
        return await this.chosenServicesTitle.innerText();
    }

    async getServicesInputValueLength(): Promise<number> {
        return (await this.getServicesTabInputValue()).length
    }
}

export default ServicesTab;