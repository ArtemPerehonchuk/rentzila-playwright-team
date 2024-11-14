import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class EditUnitPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    cancelUnitChangesBtn = this.page.locator('[data-testid="prevButton"]');
    saveUnitChangesBtn = this.page.locator('[data-testid="nextButton"]');
    successEditUnitMsg = this.page.locator('[class*="SuccessfullyCreatedPage_finishTitle"]');
    lookInMyAnnouncementsBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    unitNameInput = this.page.locator('[data-testid="custom-input"]').first();
    unitNameInputError = this.page.locator('[data-testid="descriptionError"]').first();
    vehicleManufacturerInputCloseIcon = this.page.locator('[data-testid="closeButton"]');
    vehicleManufacturerInput = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    vehicleManufacturerInputSelectedOption = this.page.locator('[data-testid="div-service-customSelectWithSearch"]');
    vehicleManufacturerInputError = this.page.locator('[class*="CustomSelectWithSearch_errorTextVisible"]');
    vehicleManufacturerNotFoundMsg = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    vehicleManufacturerDropDown = this.page.locator('[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    vehivleManufacturerFirstOption = this.page.locator('[data-testid="item-customSelectWithSearch"]').first();
    modelNameInput = this.page.locator('[data-testid="custom-input"]').nth(1);
    modelNameInputError = this.page.locator('[data-testid="descriptionError"]');
    technicalCharacteristicsInput = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').first();
    detailDescriptionInput = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').nth(1);
    selectOnMapBtn = this.page.locator('[class*="AddressSelectionBlock_locationBtn"]');
    mapPopUp = this.page.locator('[data-testid="div-mapPopup"]');
    mapPopUpZoomInBtn = this.page.locator('[aria-label="Zoom in"]');
    mapPopUpZoomOutBtn = this.page.locator('[aria-label="Zoom out"]');
    mapContainer = this.page.locator('[id="map"]');
    mapPopUpLocation = this.page.locator('[data-testid="address"]');
    mapPopUpConfirmChoiseBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    vehicleLocation = this.page.locator('[data-testid="mapLabel"]');

    async clickOnCancelUnitChangesBtn() {
        await this.cancelUnitChangesBtn.click({force: true});
        await this.page.on('dialog', async(dialog) => {
            await dialog.accept();
        })
        await this.cancelUnitChangesBtn.click();
        await this.page.waitForLoadState('load');
    }

    async clickOnSaveUnitChangesBtn() {
        await this.page.waitForLoadState('load');
        await this.saveUnitChangesBtn.scrollIntoViewIfNeeded();
        await this.saveUnitChangesBtn.click({force: true});
        await this.page.waitForTimeout(1500);
    }

    async clickOnLookInMyAnnouncementsBtn() {
        await this.lookInMyAnnouncementsBtn.click();
    }

    async clearUnitNameInput() {
        await this.unitNameInput.first().clear();
    }

    async fillUnitNameInput(value: string) {
        await this.unitNameInput.first().fill(value);
        await this.page.waitForLoadState('load')
    }

    async clickOnVehicleManufacturerInputCloseIcon() {
        await this.vehicleManufacturerInputCloseIcon.click();
    }
    
    async fillVehicleManufacturerInput(value: string) {
        await this.vehicleManufacturerInput.fill(value);
    }

    async getVehicleManufacturerInputText() {
        return await this.vehicleManufacturerInput.inputValue();
    }

    async getVehicleManufacturerInputSelectedOptionText() {
        return await this.vehicleManufacturerInputSelectedOption.innerText();
    }

    async clearVehicleManufacturerInput() {
        await this.vehicleManufacturerInput.clear();
    }

    async selectFirstVehicleManufacturerOption() {
        await this.vehivleManufacturerFirstOption.click();
        await this.page.waitForLoadState('load');
    }

    async fillModelNameInput(value: string) {
        await this.modelNameInput.fill(value)
    }

    async clearModelNameInput() {
        await this.modelNameInput.clear();
    }

    async clearTechnicalCharacteristicsInput() {
        await this.technicalCharacteristicsInput.clear();
    }

    async fillTechnicalCharacteristicsInput(value: string) {
        await this.clearTechnicalCharacteristicsInput();
        await this.technicalCharacteristicsInput.click();
        await this.technicalCharacteristicsInput.type(value);
        await this.page.waitForTimeout(1000);
    }

    async getDetailDescriptionInputText() {
        return await this.detailDescriptionInput.innerText(); 
    }

    async fillDetailDescriptionInput(value: string) {
        await this.clearDetailDescriptionInput();
        await this.detailDescriptionInput.click();
        await this.detailDescriptionInput.type(value);
    }

    async clearDetailDescriptionInput() {
        await this.detailDescriptionInput.clear();
    }

    async clickOnSelectOnMapBtn() {
        await this.selectOnMapBtn.click();
    }

    async getMapZoomValue() {
        const initialTransform = await this.page.$eval('.leaflet-proxy', (div) => div.style.transform);
        const initialScale = initialTransform.split(' ').find(part => part.startsWith('scale('))?.replace('scale(', '').replace(')', '');
        return initialScale
    }

    async clickOnMapPopUpZoomInBtn() {
        await this.mapPopUpZoomInBtn.click();
        await this.page.waitForTimeout(500);
    }

    async clickOnMapPopUpZoomOutBtn() {
        await this.mapPopUpZoomOutBtn.click();
        await this.page.waitForTimeout(500);
    }

    async scrollMouseOnMap(yValue: number) {
        await this.mapContainer.hover();
        await this.page.mouse.wheel(0, yValue);
        await this.page.waitForTimeout(500);
    }

    async getMapPopUpLocationText() {
        return await this.mapPopUpLocation.innerText();
    } 
    
    async clickOnMap() {
        const mapContainerSize = await this.mapContainer.boundingBox();

        if (mapContainerSize) {
            const randomX = mapContainerSize.x + Math.random() * mapContainerSize.width;
            const randomY = mapContainerSize.y + Math.random() * mapContainerSize.height;
    
            await this.page.mouse.click(randomX, randomY);
            await this.page.waitForTimeout(3000);
        }
    }

    async clickOnMapPopUpConfirmChoiseBtn() {
        await this.mapPopUpConfirmChoiseBtn.click();
    }

    async selectAdressOnMap() {
        await this.clickOnSelectOnMapBtn();
        await this.clickOnMap();
        await this.clickOnMapPopUpConfirmChoiseBtn()
        await this.clickOnSaveUnitChangesBtn();
    }
}

export default EditUnitPage;