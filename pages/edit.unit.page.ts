import { Page as PlaywrightPage } from '@playwright/test';
import Page from './page';
import path from 'path';
import testData from '../data/test_data.json' assert {type: 'json'};

const photoFileNames = testData['photo file names']

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
    editedUnitImageBlocks = this.page.locator('[data-testid="imageBlock"]');
    editedUnitImages = this.page.locator('[data-testid="unitImage"]')
    editedUnitDeleteImgIcons = this.page.locator('[data-testid="deleteImage"]');
    editedUnitUploadFileInput = this.page.locator('[data-testid="input_ImagesUnitFlow"]');
    uploadPhotoErrorPopUp = this.page.locator('[data-testid="content"] > [class*="PopupLayout_header"]');
    uploadPhotoErrorPopUpCloseButton = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    uploadTo12PhotosErrorMsg = this.page.locator('[data-testid="description"]');
    uploadPhotoPlusIcon = this.page.locator('[data-testid="clickImage"]');
    mainImgLable = this.page.locator('[data-testid="mainImageLabel"]');
    editedUnitService = this.page.locator('[class*="ServicesUnitFlow_serviceText"]');
    editedUnitServiceCloseIcon = this.page.locator('[data-testid="remove-servicesUnitFlow"]');
    addServiceErrorMsg = this.page.locator('[data-testid="add-info"]');
    serviceInput = this.page.locator('[class*="ServicesUnitFlow_searchInput"] > input');
    serviceNotFoundMsg = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    createServiceBth = this.page.locator('[data-testid="btn-addNewItem"]');
    servicesDropDownItems = this.page.locator('[class*="ServicesUnitFlow_searchListItem"]');
    selectPaymentMethodInput = this.page.locator('[data-testid="div_CustomSelect"]');
    paymentMethodsDropDown = this.page.locator('[data-testid="listItems-customSelect"]');
    paymentMethodDropDownItems = this.page.locator('[data-testid="item-customSelect"]');
    minOrderPriceInput = this.page.locator('[data-testid="priceInput_RowUnitPrice"]');
    unitPriceErrorMsg = this.page.locator('[data-testid="div_required_RowUnitPrice"]');
    addPriceBtn = this.page.locator('[data-testid="addPriceButton_ServicePrice"]');
    additionalPriceSelect = this.page.locator('[data-testid="div_CustomSelect"]');
    additionalPriceDropDpwn = this.page.locator('[data-testid="listItems-customSelect"]');
    additionalPriceDropDownItems = this.page.locator('[data-testid="item-customSelect"]');
    selectTimeInput = this.page.locator('[data-testid="div_CustomSelect"]').nth(1);
    additionalPriceInput = this.page.locator('[data-testid="priceInput_RowUnitPrice"]').nth(2);

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
        await this.page.waitForTimeout(2000);
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

    async clickOnEditedUnitDeleteImgIcon(index: number) {
        await this.editedUnitDeleteImgIcons.nth(index).click();
    }

    async getEditedUnitUploadedPhotosCount() {
        let uploadedImagesCount = 0;
        const unitImageBlocks = await this.editedUnitImageBlocks.all();

        for(let i = 0; i < unitImageBlocks.length; i++) {
            const isDraggable = await unitImageBlocks[i].getAttribute('draggable');
            if(isDraggable === 'true') {
                uploadedImagesCount++;
            }
        }

        return uploadedImagesCount;
    }

    async getEditedUnitName() {
        return await this.unitNameInput.inputValue();
    }

    async uploadPhotos(numberOfPhotos: number) {   
        for(let i = 0; i < numberOfPhotos; i++) {
            let photoFileNameIndex = Math.floor(Math.random() * 15)
            await this.editedUnitImageBlocks.nth(i).focus();
            await this.editedUnitUploadFileInput.setInputFiles(path.resolve(`data/photo/${photoFileNames[photoFileNameIndex]}.jpg`));
            await this.page.waitForLoadState('load');
        }
    }

    async uploadMissingPhotos() {
        let retryCount = 0;
    
        while (retryCount < 3) {
            let uploadedImages = await this.getEditedUnitUploadedPhotosCount();
            if (uploadedImages === 1) {
                await this.uploadPhotos(3);
            } else if (uploadedImages === 2) {
                await this.uploadPhotos(1);
            } else if (uploadedImages === 3) {
                await this.uploadPhotos(1);
            } else {
                return; 
            }

            if (await this.uploadPhotoErrorPopUp.isVisible()) {
                if (await this.uploadPhotoErrorPopUpCloseButton.isVisible()) {
                    await this.uploadPhotoErrorPopUpCloseButton.click();
                }
                retryCount++; 
            } else {
                return; 
            }
        }
    }

    async getImgSrcAttr(numberOfImage: number) {
        return await this.editedUnitImages.nth(numberOfImage - 1).getAttribute('src');
    }

    async hoverOnFirstImg() {
        await this.editedUnitImageBlocks.first().hover({force: true});
        await this.page.waitForSelector('[data-testid="deleteImage"]')
    }

    async clickOnUploadPhotoPlusIcon() {
        await this.uploadPhotoPlusIcon.first().click();
    }

    async getFileChooser(timeout = 500) {
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser', { timeout }),
            this.clickOnUploadPhotoPlusIcon()
        ]);
        return fileChooser;
    }

    async fileChooserSetInputFile() {
        const fileChooser = await this.getFileChooser();
        const photoFileNameIndex = Math.floor(Math.random() * 15)
        await fileChooser.setFiles(`data/photo/${photoFileNames[photoFileNameIndex]}.jpg`);
    }

    async removeEditedUnitService() {
        await this.editedUnitServiceCloseIcon.click();
    }

    async fillServiceInput(value: string) {
        await this.serviceInput.fill(value);
    }

    async clickOnCreateServiceBtn() {
        await this.createServiceBth.click();
    }

    async clickOnSelectPaymentMethodInput() {
        await this.selectPaymentMethodInput.click({force: true});
        await this.page.waitForTimeout(2000);
    }

    async clearMinOrderPriceInput() {
        await this.minOrderPriceInput.first().clear();
    }

    async fillMinOrderPriceInput(value: any) {
        await this.minOrderPriceInput.first().type(value)
    }

    async clickOnAddPriceBtn() {
        await this.addPriceBtn.click();
    }

    async clickOnAdditionalPriceSelect() {
        await this.additionalPriceSelect.nth(1).click();
    }
}

export default EditUnitPage;