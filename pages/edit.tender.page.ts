import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';
import path from 'path';

class EditTenderPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    tenderNameInput: Locator = this.page.locator('input[data-testid="custom-input"]').first();
    saveTenderChangesBtn: Locator = this.page.locator('[data-testid="nextButton"]');
    tenderNameInputError: Locator = this.page.locator('[data-testid="descriptionError"]');
    removeTenderServiceBtn: Locator = this.page.locator('[data-testid="closeButton"]');
    tenderServiceInput: Locator = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    tenderServiceInputError: Locator = this.page.locator('[class*="CustomSelectWithSearch_errorTextVisible"]');
    tenderServicesDropDown: Locator = this.page.locator('[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    tenderServicesDropDownOptions: Locator = this.page.locator('[data-testid="item-customSelectWithSearch"]');
    selectedTenderService: Locator = this.page.locator('[class*="CustomSelectWithSearch_serviceText"]');
    tenderBudgetInput: Locator = this.page.locator('[data-testid="custom-input"]').nth(1);
    tenderBudgetInputError: Locator = this.page.locator('[data-testid="descriptionError"]')
    tenderDescriptionInput: Locator = this.page.locator('[data-testid="textAreaInput"]');
    tenderDescriptionInputError: Locator = this.page.locator('[data-testid="textAreaError"]');
    removeDocBtn: Locator = this.page.locator('[data-testid="deleteFile"]');
    tenderDocsErrorMsg: Locator = this.page.locator('[data-testid="getFileDiv"]');
    operatorCheckbox: Locator = this.page.locator('[data-testid="operatorCheckbox"]');
    lastNameInput: Locator = this.page.locator('[data-testid="customValidInput"]').first();
    firstNameInput: Locator = this.page.locator('[data-testid="customValidInput"]').nth(1);
    phoneInput: Locator = this.page.locator('[data-testid="phone"]');
    lastNameInputErrorMsg: Locator = this.page.locator('[data-testid="errorDescr"]').first();
    firstNameInputErrorMsg: Locator = this.page.locator('[data-testid="errorDescr"]').nth(1);
    phoneInputErrorMsg: Locator = this.page.locator('p[data-testid="errorMessage"]');
    tenderSuccessfullyEditedMsg: Locator = this.page.locator('[class*="SuccessfullyCreatedPage_finishTitle"]');
    lookInMyTendersBtn: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    uploadDocsInput: Locator = this.page.locator('input[type="file"]');
    uploadDocsBlock: Locator = this.page.locator('[data-testid="dropDiv"]');

    async uploadDoc(pathToDoc: string) {   
        await this.uploadDocsBlock.focus();
        await this.uploadDocsInput.setInputFiles(path.resolve(pathToDoc));
        await this.page.waitForLoadState('load');
    }
}


export default EditTenderPage;