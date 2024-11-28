import { Page as PlaywrightPage, expect, Locator } from '@playwright/test';
import Page from './page';

class CreateTenderPage extends Page {
    constructor(page: PlaywrightPage) {
        super(page)
    }

    createTenderPageTitle: Locator = this.page.locator('[class*="CreateEditFlowLayout_title"]');
    createTenderPageTabs: Locator = this.page.locator('button[id*="mui-p"]');
    createTenderPageTabsContainer: Locator = this.page.getByRole('tablist');
    tabNumber: Locator = this.page.locator('[data-testid="labelNumber"]');
    maininfoTitle: Locator = this.page.locator('[class*="CreateTenderInfo_title"]');
    nextBtn: Locator = this.page.locator('[data-testid="nextButton"]');
    tenderNameTitle: Locator = this.page.locator('[class*="CustomInput_title"]').first();
    tenderNameInput: Locator = this.page.locator('[data-testid="custom-input"]').first();
    tenderNameInputErrorMsg: Locator = this.page.locator('[placeholder="Введіть назву тендера"] + [data-testid="descriptionError"]');
    tenderServiceContainer: Locator = this.page.locator('[class*="CustomSelectWithSearch_searchResult"]');
    tenderServiceTitle: Locator = this.page.locator('[class*="CreateTenderInfo_serviceParagraph"]');
    tenderServiceInput: Locator = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    tenderServiceInputErrorMsg: Locator = this.page.locator('[class*="CustomSelectWithSearch_errorTextVisible"]');
    serviceNotFoundMsg: Locator = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    servicesDropDown: Locator = this.page.locator('[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    seviceDropDownOptions: Locator = this.page.locator('[data-testid="item-customSelectWithSearch"]');
    serviceSelectedOption: Locator = this.page.locator('[data-testid="div-service-customSelectWithSearch"]');
    tenderCategory: Locator = this.page.locator('[data-testid="categoryWrapper"]');
    removeSelectedServiceicon: Locator = this.page.locator('[data-testid="closeButton"]');
    endDateErrorMsg: Locator =this.page.locator('[class*="DateContainer_container"] > [data-testid="errorMessage"][class*="DateContainer_errorTextVisible"]');
    startDateInput: Locator = this.page.locator('[class*="react-datepicker__input-container"] > input').first();
    endDateInput: Locator = this.page.locator('[class*="react-datepicker__input-container"] > input').nth(1);
    incorrectEndDateErrorMsg: Locator = this.page.locator('[class*="PeriodOfProposals_errorTextVisible"]');
    DateCalendar: Locator = this.page.locator('[class="react-datepicker__month-container"]');
    workPeriodTitle: Locator = this.page.locator('[class*="DateContainer_title"]').nth(2);
    workPeriodInput: Locator = this.page.locator('[tabindex="999"]');
    workPeriodStartDate: Locator = this.page.locator('[aria-disabled="false"]').first();
    budgetInput: Locator = this.page.locator('[data-testid="custom-input"]').nth(1);
    budgetInputErrorMsg: Locator = this.page.locator('[data-testid="custom-input"]+[data-testid="descriptionError"]').nth(1);
    descriptionInputErrorMsg: Locator = this.page.locator('[data-testid="textAreaError"]');
    descriptionInput: Locator = this.page.locator('[data-testid="textAreaInput"]');
    cancelBtn: Locator = this.page.locator('[data-testid="prevButton"]');
    selectOnMapBtn: Locator = this.page.locator('[class*="AddressSelectionBlock_locationBtn"]');
    mapPopUpConfirmBtn: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    uploadDocsSection: Locator = this.page.locator('[data-testid="dropDiv"]');
    availableDays: Locator = this.page.locator('[aria-disabled="false"]');

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

    // async selectDateAndTime(day: string, time?: string) {
    //     await this.page.locator('[class*="react-datepicker__day"][aria-disabled="false"]').getByText(day).click();
  
    //     if (time) {
    //         await this.page.locator('[class*="react-datepicker__time-list-item"]').getByText(time).first().click();
    //     }
    // }

    async selectDateAndTime(dayIndex: number, time?: string) {
        await this.availableDays.nth(dayIndex).click();
  
        if (time) {
            await this.page.locator('[class*="react-datepicker__time-list-item"]').getByText(time).first().click();
        }
    }

    async getEndDate() {
        await this.endDateInput.click();
        const availableEndDays = await this.page.locator('[aria-disabled="false"]').allInnerTexts();

        const endDate = availableEndDays[1];

        return endDate
    }

    async getWorkPeriodStartAndEndDate(dayIndex: number, time?: string) {
        await this.selectDateAndTime(dayIndex, time)
        await this.workPeriodInput.click();
        const availableWorkPeriodDays = await this.page.locator('[aria-disabled="false"]').allInnerTexts();
        const availableWorkPeriodDaysLocators = await this.page.locator('[aria-disabled="false"]').all();

        console.log(availableWorkPeriodDays)
        console.log(availableWorkPeriodDaysLocators)

        const workPeriodStartDate = availableWorkPeriodDays[0];

        const workPeriodEndDate = availableWorkPeriodDays[1];

        return {workPeriodStartDate, workPeriodEndDate}
    }

    async getPreviousStartDate(day: number) {
        return this.page.locator('[class*="react-datepicker__day"]').getByText(day.toString());
    }

    async clickOnCancelBtn() {
        await this.cancelBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectAdress() {
        await this.selectOnMapBtn.click();
        await this.mapPopUpConfirmBtn.click();
    }

    async fillRequiredFields(tenderName: string, letter: string, budget: string, description: string) {
        await this.fillCreateTenderInput(this.tenderNameInput, tenderName);
        await this.fillCreateTenderInput(this.tenderServiceInput, letter);
        await this.seviceDropDownOptions.first().click();
        await this.endDateInput.click();
        await this.selectDateAndTime(1, '00:00');
        await this.workPeriodInput.click();
        await this.selectDateAndTime(0);
        await this.selectDateAndTime(1);
        await this.fillCreateTenderInput(this.budgetInput, budget);
        await this.selectAdress()
        await this.page.waitForLoadState('load');
        await this.fillCreateTenderInput(this.descriptionInput, description);
    }
}

export default CreateTenderPage;