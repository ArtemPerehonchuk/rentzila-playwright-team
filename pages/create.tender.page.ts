import { Page as PlaywrightPage, expect, Locator } from '@playwright/test';
import Page from './page';

class CreateTenderPage extends Page {
    constructor(page: PlaywrightPage) {
        super(page)
    }

    createTenderPageTitle = this.page.locator('[class*="CreateEditFlowLayout_title"]');
    createTenderPageTabs = this.page.locator('button[id*="mui-p"]');
    createTenderPageTabsContainer = this.page.getByRole('tablist');
    tabNumber = this.page.locator('[data-testid="labelNumber"]');
    maininfoTitle = this.page.locator('[class*="CreateTenderInfo_title"]');
    nextBtn = this.page.locator('[data-testid="nextButton"]');
    tenderNameTitle = this.page.locator('[class*="CustomInput_title"]').first();
    tenderNameInput = this.page.locator('[data-testid="custom-input"]').first();
    tenderNameInputErrorMsg = this.page.locator('[placeholder="Введіть назву тендера"] + [data-testid="descriptionError"]');
    tenderServiceContainer = this.page.locator('[class*="CustomSelectWithSearch_searchResult"]');
    tenderServiceTitle = this.page.locator('[class*="CreateTenderInfo_serviceParagraph"]');
    tenderServiceInput = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    tenderServiceInputErrorMsg = this.page.locator('[class*="CustomSelectWithSearch_errorTextVisible"]');
    serviceNotFoundMsg = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    servicesDropDown = this.page.locator('[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    seviceDropDownOptions = this.page.locator('[data-testid="item-customSelectWithSearch"]');
    serviceSelectedOption = this.page.locator('[data-testid="div-service-customSelectWithSearch"]');
    tenderCategory = this.page.locator('[data-testid="categoryWrapper"]');
    removeSelectedServiceicon = this.page.locator('[data-testid="closeButton"]');
    endDateErrorMsg =this.page.locator('[class*="DateContainer_container"] > [data-testid="errorMessage"][class*="DateContainer_errorTextVisible"]');
    startDateInput = this.page.locator('[class*="react-datepicker__input-container"] > input').first();
    endDateInput = this.page.locator('[class*="react-datepicker__input-container"] > input').nth(1);
    incorrectEndDateErrorMsg = this.page.locator('[class*="PeriodOfProposals_errorTextVisible"]');
    DateCalendar = this.page.locator('[class="react-datepicker__month-container"]');
    workPeriodTitle = this.page.locator('[class*="DateContainer_title"]').nth(2);
    workPeriodInput = this.page.locator('[tabindex="999"]');
    workPeriodStartDate = this.page.locator('[aria-disabled="false"]').first();
    budgetInput = this.page.locator('[data-testid="custom-input"]').nth(1);
    budgetInputErrorMsg = this.page.locator('[data-testid="custom-input"]+[data-testid="descriptionError"]').nth(1);
    descriptionInputErrorMsg = this.page.locator('[data-testid="textAreaError"]');
    descriptionInput = this.page.locator('[data-testid="textAreaInput"]');
    cancelBtn = this.page.locator('[data-testid="prevButton"]');
    selectOnMapBtn = this.page.locator('[class*="AddressSelectionBlock_locationBtn"]');
    mapPopUpConfirmBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    uploadDocsSection = this.page.locator('[data-testid="dropDiv"]');

    async checkCreateTenderTabsTitles(activeTabNumber: number, createTenderTabsNames: string[]) {
        if(await this.createTenderPageTabsContainer.isVisible) {
            const tabNames = await this.createTenderPageTabs.allInnerTexts();
            let activeTabIndex = activeTabNumber - 1;
            for (let i = 0; i < tabNames.length; i++) {
                await expect(this.createTenderPageTabs.nth(i)).toBeVisible();

                const tabNameRaw = await this.createTenderPageTabs.nth(i).innerText();
                const tabName = tabNameRaw.replace(/^\d+\s*/, '').trim();

                await expect(createTenderTabsNames).toContain(tabName)
                await expect(await this.tabNumber.nth(i).innerText()).toBe(String(i + 1));

                let tabAttr = await this.createTenderPageTabs.nth(i).getAttribute('aria-selected');

                if(i === activeTabIndex) {
                    await expect(tabAttr).toBe('true');
                }else {
                    await expect(tabAttr).toBe('false');
                }
            }
            return true
        }else return false
    }

    async clickOnNextBtn() {
        await this.nextBtn.click();
    }

    async fillCreateTenderInput(inputLocator: Locator, inputValue: string) {
        await inputLocator.fill(inputValue);
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

    async clearCreateTenderInput(inputLocator: Locator) {
        await inputLocator.clear();
    }

    async clickOnRemoveSelectedServiceIcon() {
        await this.removeSelectedServiceicon.click();
    }

    async clickOnEndDateInput() {
        await this.endDateInput.click();
    }

    async selectDateAndTime(day: string, time?: string) {
        await this.page.locator('[class*="react-datepicker__day"]').getByText(day).click();
  
        if (time) {
            await this.page.locator('[class*="react-datepicker__time-list-item"]').getByText(time).click();
        }
    }

    async clickOnStartDateInput() {
        await this.startDateInput.click();
    }

    async getPreviousStartDate(day: number) {
        return this.page.locator('[class*="react-datepicker__day"]').getByText(day.toString());
    }

    async clickOnWorkPeriodInput() {
        await this.workPeriodInput.click();
    }

    async clickOnCancelBtn() {
        await this.cancelBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectAdress() {
        await this.selectOnMapBtn.click();
        await this.mapPopUpConfirmBtn.click();
    }

    async fillRequiredFields(tenderName: string, letter: string, endDate: string, workPeriodStartDate: string, workPeriodEndDate: string,  budget: string, description: string) {
        await this.fillCreateTenderInput(this.tenderNameInput, tenderName);
        await this.fillCreateTenderInput(this.tenderServiceInput, letter);
        await this.seviceDropDownOptions.first().click();
        await this.clickOnEndDateInput();
        await this.selectDateAndTime(endDate, '00:00');
        await this.clickOnWorkPeriodInput();
        await this.selectDateAndTime(workPeriodStartDate);
        await this.selectDateAndTime(workPeriodEndDate);
        await this.fillCreateTenderInput(this.budgetInput, budget);
        await this.selectAdress()
        await this.page.waitForLoadState('load');
        await this.fillCreateTenderInput(this.descriptionInput, description);
    }
}

export default CreateTenderPage;