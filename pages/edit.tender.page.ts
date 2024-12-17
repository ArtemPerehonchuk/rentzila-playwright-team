import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

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
    tenderDescriptionInput: Locator = this.page.locator('[data-testid="textAreaDiv"]');
    tenderDescriptionInputError: Locator = this.page.locator('[data-testid="textAreaError"]');
}

export default EditTenderPage;