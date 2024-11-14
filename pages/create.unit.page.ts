import { Page as PlaywrightPage, Locator, expect } from '@playwright/test';
import Page from './page';
import categoryNames from '../data/category_names.json' assert { type: 'json' };
import { faker } from '@faker-js/faker';

class CreateUnitPage extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
    }
    
    createUnitTitle = this.page.locator('div[class*="CreateEditFlowLayout_title"]');
    createUnitTabs = this.page.getByRole('tab');
    createUnitTabsText = this.page.locator('div[class*="CustomLabel_label"] > span[class*="CustomLabel_labelTitle__O2bFl"]');
    tabNumber = this.page.locator('[data-testid="labelNumber"]');
    categoriesDropDown = this.page.locator('[data-testid="buttonDiv"]');
    nextBtn = this.page.locator('[data-testid="nextButton"]');
    categoryErrorMessage = this.page.locator('[class*="CategorySelect_errorTextVisible"]');
    categoriesPopUp = this.page.locator('div[data-testid="categoryPopupWrapper"]');
    categoriesPopUpCloseBtn = this.page.locator('[data-testid="closeIcon"]');
    categoriesDropDownArrowDown = this.page.locator('div[data-testid="buttonDiv"]>div  img[alt="Arrow-down"]');
    categoriesTitle = this.page.locator('div[class*="CategorySelect_title"]');
    categoriesPopUpTitle = this.page.locator('div[class*="CategoryPopup_title"]');
    announcementNameTitle = this.page.locator('div[class*="CustomInput_title"]').first();
    announcementNameInput = this.page.locator('input[data-testid="custom-input"]').first();
    announcementNameInputError = this.page.locator('[data-testid="descriptionError"]').first();
    vehicleManufacturerTitle = this.page.locator('div[class*="SelectManufacturer_title"]');
    vehicleManufacturerInputContainer = this.page.locator('div[class*="CustomSelectWithSearch_searchInput"]');
    vehicleManufacturerInput = this.page.locator('input[data-testid="input-customSelectWithSearch"]');
    vehicleManufacturerInputError = this.page.locator('div[class*="CustomSelectWithSearch_errorTextVisible"]');
    vehicleManufacturerInputSearchIcon = this.page.locator('div[class*="CustomSelectWithSearch_searchInput"] > svg');
    vehicleManufacturerSelectedOption = this.page.locator('[class*="CustomSelectWithSearch_serviceText"]')
    vehicleManifacturerDropDown = this.page.locator('div[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    vehicleManufacturerDropDownOption = this.page.locator('div[class*="CustomSelectWithSearch_flexForServices"]').first();
    optionNotFoundMessage = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    selectedOptionInDropdown = this.page.locator('[class*="CustomSelectWithSearch_serviceText"]');
    clearVehicleManifacturerDropDownIcon = this.page.locator('button[class*="CustomSelectWithSearch_serviceBtn"]');
    modelNameTitle = this.page.locator('div[class*="CustomInput_title"]').getByText('Назва моделі')
    modelNameInput = this.page.locator('input[data-testid="custom-input"]').nth(1);
    modelNameInputError = this.page.locator('[data-testid="descriptionError"]');
    technicalInfoTitle = this.page.locator('div[class*="CustomTextAriaDescription_title"]').first();
    technicalInfoInput = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').first();
    descriptionInfoTitle = this.page.locator('div[class*="CustomTextAriaDescription_title"]').nth(1);
    descriptionInfoInput = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').nth(1);
    addressSelectionTitle = this.page.locator('[class*="AddressSelectionBlock_title"]');
    addressSelectionInput = this.page.locator('[data-testid="mapLabel"]');
    addressSelectionInputError = this.page.locator('[class*="AddressSelectionBlock_errorTextVisible"]');
    selectOnMapBtn = this.page.locator('[class*="AddressSelectionBlock_locationBtn"]');
    mapPopUp = this.page.locator('[data-testid="div-mapPopup"]');
    mapPopUpTitle = this.page.locator('[class*="MapPopup_title"]');
    mapPopUpAddressLine = this.page.locator('[class*="MapPopup_address"]')
    mapPopUpCloseBtn = this.page.locator('[class*="MapPopup_title"]');
    addressLine = this.page.locator('[data-testid="address"]');
    selectedAddress = this.page.locator('[class*="AddressSelectionBlock_mapLabelChosen"]');
    mapPopUpSubmitBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    mapContainer = this.page.locator('#map');
    cancelBtn = this.page.locator('[data-testid="prevButton"]');
    characteristicsTitle  = this.page.locator('div[class*="Characteristics_title"]');
    vehicleManufacturerList = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    mapLabel = this.page.locator('[data-testid="mapLabel"]');

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

    async clickOnCategoriesDropDown() {
        await this.categoriesDropDown.click();
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

    async clickOnOptionInVehicleManufacturerDropDown() {
        await this.vehicleManufacturerDropDownOption.click();
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

                    await this.clickOnCategoriesDropDown();
                }
            }
        }
    }

    async clickOnClearIcon() {
        await this.clearVehicleManifacturerDropDownIcon.click({force: true});
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
        await this.page.waitForTimeout(1000)
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
            const address = await this.addressLine.innerText();
            return address
        }
        return '';
    }

    async clickOnCancelBtn() {
        await this.cancelBtn.click();
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