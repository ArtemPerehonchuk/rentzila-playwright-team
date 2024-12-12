import { Page as PlaywrightPage, Locator, expect } from '@playwright/test';
import Page from './page';
import categoryNames from '../data/category.names.json' assert { type: 'json' };
import { faker } from '@faker-js/faker';

class CreateUnitPage extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
    }
    
    createUnitTitle: Locator = this.page.locator('div[class*="CreateEditFlowLayout_title"]');
    createUnitTabs: Locator = this.page.getByRole('tab');
    createUnitTabsText: Locator = this.page.locator('div[class*="CustomLabel_label"] > span[class*="CustomLabel_labelTitle__O2bFl"]');
    tabNumber: Locator = this.page.locator('[data-testid="labelNumber"]');
    categoriesDropDown: Locator = this.page.locator('[data-testid="buttonDiv"]');
    nextBtn: Locator = this.page.locator('[data-testid="nextButton"]');
    categoryErrorMessage: Locator = this.page.locator('[class*="CategorySelect_errorTextVisible"]');
    categoriesPopUp: Locator = this.page.locator('div[data-testid="categoryPopupWrapper"]');
    categoriesPopUpCloseBtn: Locator = this.page.locator('[data-testid="closeIcon"]');
    categoriesDropDownArrowDown: Locator = this.page.locator('div[data-testid="buttonDiv"]>div  img[alt="Arrow-down"]');
    categoriesTitle: Locator = this.page.locator('div[class*="CategorySelect_title"]');
    categoriesPopUpTitle: Locator = this.page.locator('div[class*="CategoryPopup_title"]');
    announcementNameTitle: Locator = this.page.locator('div[class*="CustomInput_title"]').first();
    announcementNameInput: Locator = this.page.locator('input[data-testid="custom-input"]').first();
    announcementNameInputError: Locator = this.page.locator('[data-testid="descriptionError"]').first();
    vehicleManufacturerTitle: Locator = this.page.locator('div[class*="SelectManufacturer_title"]');
    vehicleManufacturerInputContainer: Locator = this.page.locator('div[class*="CustomSelectWithSearch_searchInput"]');
    vehicleManufacturerInput: Locator = this.page.locator('input[data-testid="input-customSelectWithSearch"]');
    vehicleManufacturerInputError: Locator = this.page.locator('div[class*="CustomSelectWithSearch_errorTextVisible"]');
    vehicleManufacturerInputSearchIcon: Locator = this.page.locator('div[class*="CustomSelectWithSearch_searchInput"] > svg');
    vehicleManufacturerSelectedOption: Locator = this.page.locator('[class*="CustomSelectWithSearch_serviceText"]')
    vehicleManifacturerDropDown: Locator = this.page.locator('div[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    vehicleManufacturerDropDownOption: Locator = this.page.locator('div[class*="CustomSelectWithSearch_flexForServices"]').first();
    optionNotFoundMessage: Locator = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    selectedOptionInDropdown: Locator = this.page.locator('[class*="CustomSelectWithSearch_serviceText"]');
    clearVehicleManifacturerDropDownIcon: Locator = this.page.locator('button[class*="CustomSelectWithSearch_serviceBtn"]');
    modelNameTitle: Locator = this.page.locator('div[class*="CustomInput_title"]').getByText('Назва моделі')
    modelNameInput: Locator = this.page.locator('input[data-testid="custom-input"]').nth(1);
    modelNameInputError: Locator = this.page.locator('[data-testid="descriptionError"]');
    technicalInfoTitle: Locator = this.page.locator('div[class*="CustomTextAriaDescription_title"]').first();
    technicalInfoInput: Locator = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').first();
    descriptionInfoTitle: Locator = this.page.locator('div[class*="CustomTextAriaDescription_title"]').nth(1);
    descriptionInfoInput: Locator = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').nth(1);
    addressSelectionTitle: Locator = this.page.locator('[class*="AddressSelectionBlock_title"]');
    addressSelectionInput: Locator = this.page.locator('[data-testid="mapLabel"]');
    addressSelectionInputError: Locator = this.page.locator('[class*="AddressSelectionBlock_errorTextVisible"]');
    selectOnMapBtn: Locator = this.page.locator('[class*="AddressSelectionBlock_locationBtn"]');
    mapPopUp: Locator = this.page.locator('[data-testid="div-mapPopup"]');
    mapPopUpTitle: Locator = this.page.locator('[class*="MapPopup_title"]');
    mapPopUpAddressLine: Locator = this.page.locator('[class*="MapPopup_address"]')
    mapPopUpCloseBtn: Locator = this.page.locator('[class*="MapPopup_title"]');
    addressLine: Locator = this.page.locator('[data-testid="address"]');
    selectedAddress: Locator = this.page.locator('[class*="AddressSelectionBlock_mapLabelChosen"]');
    mapPopUpSubmitBtn: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    mapContainer: Locator = this.page.locator('#map');
    cancelBtn: Locator = this.page.locator('[data-testid="prevButton"]');
    characteristicsTitle: Locator  = this.page.locator('div[class*="Characteristics_title"]');
    vehicleManufacturerList: Locator = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    mapLabel: Locator = this.page.locator('[data-testid="mapLabel"]');

    async checkCreateUnitTabsTitles(activeTabNumber: number) {
        if(await this.createUnitTabs.isVisible) {
            const tabNames = await this.createUnitTabsText.allInnerTexts();
            let activeTabIndex = activeTabNumber - 1;
            for (let i = 0; i < tabNames.length; i++) {
                await expect(this.createUnitTabs.nth(i)).toBeVisible();
                await expect(await this.createUnitTabsText.nth(i).innerText()).toBe(tabNames[i]);
                await expect(await this.tabNumber.nth(i).innerText()).toBe(String(i + 1));

                let tabAttr = await this.createUnitTabs.nth(i).getAttribute('aria-selected');

                if(i === activeTabIndex) {
                    await expect(tabAttr).toBe('true');
                }else {
                    await expect(tabAttr).toBe('false');
                }
            }
            return true
        }else return false
    }

    async getCategoriesTitleText() {
        return await this.categoriesTitle.innerText();
    }

    async getCategoriesDropDownBgText() {
        return await this.categoriesDropDown.innerText();
    }

    async getCategoryInputErrorText() {
        return await this.categoryErrorMessage.innerText();
    }

    async clickOnNextBtn() {
        await this.nextBtn.click({force: true});
        await this.page.waitForTimeout(1000);
    }

    async fillSectionInput(sectionInputLocator: Locator, value: string) {
        await this.clearSectionInput(sectionInputLocator);
        await sectionInputLocator.click();
        await sectionInputLocator.fill(value);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
    }

    async clearSectionInput(sectionInputLocator: Locator) {
        await sectionInputLocator.clear();
    }

    async copyPasteValueInSectionInput(sectionInputLocator: Locator) {
        await sectionInputLocator.click();
        await this.page.keyboard.press('Meta+A');
        await this.page.keyboard.press('Meta+c');
        await this.clearSectionInput(sectionInputLocator);
        await sectionInputLocator.click();
        await this.page.keyboard.press('Meta+V');
    }

    async checkSectionErrorIsDisplayed(sectionInputLocator: Locator, errorMessageLocator: Locator, expectedErrorText: string) {
        const isVisible = await errorMessageLocator.isVisible();
    
        if (isVisible) {
            const borderColor = await sectionInputLocator.evaluate((el: any) => window.getComputedStyle(el).borderColor);
            const errorMessageText = await errorMessageLocator.innerText();

            if (sectionInputLocator === this.vehicleManufacturerInputContainer) {
                await expect(borderColor).toBe('rgb(40, 49, 73)');
            } else {
                await expect(borderColor).toBe('rgb(247, 56, 89)');
            }
    
            await expect(errorMessageText).toBe(expectedErrorText);
            return true;
        }
    
        return false;
    }

    async getAnnouncementNameTitleText() {
        return await this.announcementNameTitle.innerText();
    } 

    async getAnnouncementNameInputBgText() {
        return await this.announcementNameInput.getAttribute('placeholder');
    } 

    async getAnnouncementNameInputValueText() {
        return await this.announcementNameInput.inputValue();
    }

    async getAnnouncementInputValueCharCount() {
        const value = await this.announcementNameInput.inputValue();
        return value.length;
    }

    async getVehicleManufacturerTitleText() {
        return await this.vehicleManufacturerTitle.innerText();
    } 

    async getVehicleManufacturerInputBgText() {
        return await this.vehicleManufacturerInput.getAttribute('placeholder');
    } 

    async getVehicleManufacturerInputValueLength() {
        const currentValue = await this.vehicleManufacturerInput.inputValue();
        return currentValue.length;
    }

    async getVehicleManufacturerDropDownOptionText() {
        return await this.vehicleManufacturerDropDownOption.innerText();
    }

    async getOptionNotFoundErrorText() {
        return await this.optionNotFoundMessage.innerText();
    }

    async getVehicleManufacturerSelectedOptionText() {
        return await this.vehicleManufacturerSelectedOption.innerText();
    }

    async getVehicleManufacturerInputText() {
        return await this.vehicleManufacturerInput.inputValue();
    }

    async clickOnCategoriesPopUpCloseBtn() {
        await this.categoriesPopUpCloseBtn.click();
    }

    async clickOutsidePopup() {
        await this.page.waitForSelector('[class*="NavbarCatalog_wrapper"]', { state: 'visible' });
        await this.page.click('[class*="NavbarCatalog_wrapper"]', { force: true });
        await this.page.waitForLoadState('load');
    }

    async checkOptionsInCategoriesPopUp() {
        const firstCategoryItems = await this.page.locator('[data-testid="firstCategoryLabel"]');
        const firstCategoryItemsNames = await firstCategoryItems.allInnerTexts();
        const validFirstCategoryItemsNames = categoryNames.firstCategoryNames;

        for(let i = 0; i < firstCategoryItemsNames.length; i++ ) {
            await expect(validFirstCategoryItemsNames[i]).toContain(firstCategoryItemsNames[i]);

            await firstCategoryItems.nth(i).click();
            await this.page.waitForLoadState('domcontentloaded');

            const secondCategoryItems = await this.page.locator('[class*="SecondCategory_check_label"]');
            const secondCategoryItemsNames = await secondCategoryItems.allInnerTexts();
            const validSecondCategoryNames = categoryNames.secondCategoryNames;

            for(let j = 0; j < secondCategoryItemsNames.length; j++) {
                await expect(validSecondCategoryNames).toContain(secondCategoryItemsNames[j]);

                await secondCategoryItems.nth(j).click();
                await this.page.waitForLoadState('domcontentloaded');

                const thirdCategoryItems = await this.page.locator('[data-testid="thirdCategoryLabel"]');
                const thirdCategoryItemsNames = await thirdCategoryItems.allInnerTexts();
                const validThirdCategoryNames = categoryNames.thirdCategoryNames;

                for(let k = 0; k < thirdCategoryItemsNames.length; k++) {
                    await expect(validThirdCategoryNames).toContain(thirdCategoryItemsNames[k]);
                    await expect(thirdCategoryItems.nth(k)).toBeEnabled();

                    await thirdCategoryItems.nth(k).click({force: true});
                    await this.page.waitForLoadState('domcontentloaded');

                    await expect(this.categoriesDropDown).toBeEnabled();

                    const categoriesDropDownValue = await this.categoriesDropDown.innerText();

                    await expect(categoriesDropDownValue.toLowerCase()).toBe(thirdCategoryItemsNames[k].toLowerCase());

                    await this.categoriesDropDown.click();
                }
            }
        }
    }

    async getModelNameTitleText() {
        return await this.modelNameTitle.innerText();
    }

    async getModelNameInputBgText() {
        return await this.modelNameInput.getAttribute('placeholder');
    }

    async getModelNameInputText() {
        return await this.modelNameInput.inputValue();
    }

    async getTechnicalInfoInputText() {
        return await this.technicalInfoInput.inputValue();
    }

    async getDescriptionInfoInputText() {
        return await this.descriptionInfoInput.inputValue();
    }

    async getAddressSelectionTitleText() {
        return await this.addressSelectionTitle.innerText();
    }

    async clickOnSelectOnMapBtn() {
        await this.selectOnMapBtn.click();
        await this.page.waitForTimeout(2000)
    }

    async getMapPopUpAddressLineText() {
        return await this.mapPopUpAddressLine.innerText();
    }

    async getAddressLineText() {
        return await this.selectedAddress.innerText();
    }

    async clickOnMapPopUpCloseBtn() {
        await this.mapPopUpCloseBtn.click();
    }
    
    async clickOnMapPopUpSubmitBtn() {
        await this.mapPopUpSubmitBtn.click({force: true});
        await this.page.waitForTimeout(2000)
    }

    async clickOnMapAndGetAddress() {
        const mapContainerSize = await this.mapContainer.boundingBox();
        if (mapContainerSize) {
            const randomX = mapContainerSize.x + Math.random() * mapContainerSize.width;
            const randomY = mapContainerSize.y + Math.random() * mapContainerSize.height;
    
            await this.page.mouse.click(randomX, randomY);
            await this.page.waitForLoadState('load');
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForLoadState('networkidle');
            const address = await this.addressLine.innerText();
            return address
        }
        return '';
    }
    
    async acceptAlert() {
        await this.page.on('dialog', async(dialog) => {
            await dialog.accept();
        })
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillCategory() {
        const firstCategoryItem = await this.page.locator('[data-testid="firstCategoryLabel"]').first();
        const secondCategoryItem = await this.page.locator('[class*="SecondCategory_check_label"]').first();
        const thirdCategoryItem = await this.page.locator('[data-testid="thirdCategoryLabel"]').first();

        await this.categoriesDropDown.click();
        await firstCategoryItem.click();
        await secondCategoryItem.click();
        await thirdCategoryItem.click();
    }

    async fillAnnouncementName() {
        const inputValue = faker.lorem.sentence()
        await this.announcementNameInput.fill(inputValue);
    }

    async fillVehicleManufacturer() {
        const inputValue = faker.string.alpha({length: 1});

        await this.vehicleManufacturerInput.fill(inputValue);
        await this.vehicleManufacturerDropDownOption.first().click();
    }

    async fillAddress() {
        await this.selectOnMapBtn.click();
        await this.clickOnMapAndGetAddress();
        await this.clickOnMapPopUpSubmitBtn();
    }
}

export default CreateUnitPage;