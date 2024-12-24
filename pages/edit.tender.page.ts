import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';
import path from 'path';

class EditTenderPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly tenderNameInput: Locator = this.page.locator('input[data-testid="custom-input"]').first();
    readonly saveTenderChangesBtn: Locator = this.page.locator('[data-testid="nextButton"]');
    readonly tenderNameInputError: Locator = this.page.locator('[data-testid="descriptionError"]');
    readonly removeTenderServiceBtn: Locator = this.page.locator('[data-testid="closeButton"]');
    readonly tenderServiceInput: Locator = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    readonly tenderServiceInputError: Locator = this.page.locator('[class*="CustomSelectWithSearch_errorTextVisible"]');
    readonly tenderServicesDropDown: Locator = this.page.locator('[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    readonly tenderServicesDropDownOptions: Locator = this.page.locator('[data-testid="item-customSelectWithSearch"]');
    readonly selectedTenderService: Locator = this.page.locator('[class*="CustomSelectWithSearch_serviceText"]');
    readonly tenderBudgetInput: Locator = this.page.locator('[data-testid="custom-input"]').nth(1);
    readonly tenderBudgetInputError: Locator = this.page.locator('[data-testid="descriptionError"]')
    readonly tenderDescriptionInput: Locator = this.page.locator('[data-testid="textAreaInput"]');
    readonly tenderDescriptionInputError: Locator = this.page.locator('[data-testid="textAreaError"]');
    readonly removeDocBtn: Locator = this.page.locator('[data-testid="deleteFile"]');
    readonly tenderDocsErrorMsg: Locator = this.page.locator('[data-testid="getFileDiv"]');
    readonly operatorCheckbox: Locator = this.page.locator('[data-testid="operatorCheckbox"]');
    readonly lastNameInput: Locator = this.page.locator('[data-testid="customValidInput"]').first();
    readonly firstNameInput: Locator = this.page.locator('[data-testid="customValidInput"]').nth(1);
    readonly phoneInput: Locator = this.page.locator('[data-testid="phone"]');
    readonly lastNameInputErrorMsg: Locator = this.page.locator('[data-testid="errorDescr"]').first();
    readonly firstNameInputErrorMsg: Locator = this.page.locator('[data-testid="errorDescr"]').nth(1);
    readonly phoneInputErrorMsg: Locator = this.page.locator('p[data-testid="errorMessage"]');
    readonly tenderSuccessfullyEditedMsg: Locator = this.page.locator('[class*="SuccessfullyCreatedPage_finishTitle"]');
    readonly lookInMyTendersBtn: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    readonly uploadDocsInput: Locator = this.page.locator('input[type="file"]');
    readonly uploadDocsBlock: Locator = this.page.locator('[data-testid="dropDiv"]');

    async uploadDoc(pathToDoc: string) {   
        await this.uploadDocsBlock.focus();
        await this.uploadDocsInput.setInputFiles(path.resolve(pathToDoc));
        await this.page.waitForLoadState('load');
    }
}


export default EditTenderPage;