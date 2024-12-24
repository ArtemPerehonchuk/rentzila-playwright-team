import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';
import path from 'path';
import testData from '../data/test.data.json' assert {type: 'json'};

const photoFileNames = testData['photo file names']

class EditUnitPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    readonly cancelUnitChangesBtn: Locator = this.page.locator('[data-testid="prevButton"]');
    readonly saveUnitChangesBtn: Locator = this.page.locator('[data-testid="nextButton"]');
    readonly successEditUnitMsg: Locator = this.page.locator('[class*="SuccessfullyCreatedPage_finishTitle"]');
    readonly lookInMyAnnouncementsBtn: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    readonly unitNameInput: Locator = this.page.locator('[data-testid="custom-input"]').first();
    readonly unitNameInputError: Locator = this.page.locator('[data-testid="descriptionError"]').first();
    readonly vehicleManufacturerInputCloseIcon: Locator = this.page.locator('[data-testid="closeButton"]');
    readonly vehicleManufacturerInput: Locator = this.page.locator('[data-testid="input-customSelectWithSearch"]');
    readonly vehicleManufacturerInputSelectedOption: Locator = this.page.locator('[data-testid="div-service-customSelectWithSearch"]');
    readonly vehicleManufacturerInputError: Locator = this.page.locator('[class*="CustomSelectWithSearch_errorTextVisible"]');
    readonly vehicleManufacturerNotFoundMsg: Locator = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    readonly vehicleManufacturerDropDown: Locator = this.page.locator('[class*="CustomSelectWithSearch_searchedServicesCat_wrapper"]');
    readonly vehivleManufacturerFirstOption: Locator = this.page.locator('[data-testid="item-customSelectWithSearch"]').first();
    readonly modelNameInput: Locator = this.page.locator('[data-testid="custom-input"]').nth(1);
    readonly modelNameInputError: Locator = this.page.locator('[data-testid="descriptionError"]');
    readonly technicalCharacteristicsInput: Locator = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').first();
    readonly detailDescriptionInput: Locator = this.page.locator('[data-testid="textarea-customTextAriaDescription"]').nth(1);
    readonly selectOnMapBtn: Locator = this.page.locator('[class*="AddressSelectionBlock_locationBtn"]');
    readonly mapPopUp: Locator = this.page.locator('[data-testid="div-mapPopup"]');
    readonly mapPopUpZoomInBtn: Locator = this.page.locator('[aria-label="Zoom in"]');
    readonly mapPopUpZoomOutBtn: Locator = this.page.locator('[aria-label="Zoom out"]');
    readonly mapContainer: Locator = this.page.locator('[id="map"]');
    readonly mapPopUpLocation: Locator = this.page.locator('[data-testid="address"]');
    readonly mapPopUpConfirmChoiseBtn: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    readonly vehicleLocation: Locator = this.page.locator('[data-testid="mapLabel"]');
    readonly editedUnitImageBlocks: Locator = this.page.locator('[data-testid="imageBlock"]');
    readonly editedUnitImages: Locator = this.page.locator('[data-testid="unitImage"]')
    readonly editedUnitDeleteImgIcons: Locator = this.page.locator('[data-testid="deleteImage"]');
    readonly editedUnitUploadFileInput: Locator = this.page.locator('[data-testid="input_ImagesUnitFlow"]');
    readonly uploadPhotoErrorPopUp: Locator = this.page.locator('[data-testid="content"] > [class*="PopupLayout_header"]');
    readonly uploadPhotoErrorPopUpCloseButton: Locator = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    readonly uploadTo12PhotosErrorMsg: Locator = this.page.locator('[data-testid="description"]');
    readonly uploadPhotoPlusIcon: Locator = this.page.locator('[data-testid="clickImage"]');
    readonly mainImgLable: Locator = this.page.locator('[data-testid="mainImageLabel"]');
    readonly editedUnitService: Locator = this.page.locator('[class*="ServicesUnitFlow_serviceText"]');
    readonly editedUnitServiceCloseIcon: Locator = this.page.locator('[data-testid="remove-servicesUnitFlow"]');
    readonly addServiceErrorMsg: Locator = this.page.locator('[data-testid="add-info"]');
    readonly serviceInput: Locator = this.page.locator('[class*="ServicesUnitFlow_searchInput"] > input');
    readonly serviceNotFoundMsg: Locator = this.page.locator('[data-testid="p2-notFound-addNewItem"]');
    readonly createServiceBth: Locator = this.page.locator('[data-testid="btn-addNewItem"]');
    readonly servicesDropDownItems: Locator = this.page.locator('[class*="ServicesUnitFlow_searchListItem"]');
    readonly selectPaymentMethodInput: Locator = this.page.locator('[data-testid="div_CustomSelect"]');
    readonly paymentMethodsDropDown: Locator = this.page.locator('[data-testid="listItems-customSelect"]');
    readonly paymentMethodDropDownItems: Locator = this.page.locator('[data-testid="item-customSelect"]');
    readonly minOrderPriceInput: Locator = this.page.locator('[data-testid="priceInput_RowUnitPrice"]');
    readonly unitPriceErrorMsg: Locator = this.page.locator('[data-testid="div_required_RowUnitPrice"]');
    readonly addPriceBtn: Locator = this.page.locator('[data-testid="addPriceButton_ServicePrice"]');
    readonly additionalPriceSelect: Locator = this.page.locator('[data-testid="div_CustomSelect"]');
    readonly additionalPriceDropDpwn: Locator = this.page.locator('[data-testid="listItems-customSelect"]');
    readonly additionalPriceDropDownItems: Locator = this.page.locator('[data-testid="item-customSelect"]');
    readonly selectTimeInput: Locator = this.page.locator('[data-testid="div_CustomSelect"]').nth(1);
    readonly additionalPriceInput: Locator = this.page.locator('[data-testid="priceInput_RowUnitPrice"]').nth(2);

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
        await this.page.waitForLoadState('load');
    }

    async clearUnitNameInput() {
        await this.unitNameInput.first().clear();
    }

    async fillUnitNameInput(value: string) {
        await this.unitNameInput.first().fill(value);
        await this.page.waitForLoadState('load')
    }
    
    async fillVehicleManufacturerInput(value: string) {
        await this.vehicleManufacturerInput.fill(value);
    }

    async getVehicleManufacturerInputText(): Promise<string> {
        return await this.vehicleManufacturerInput.inputValue();
    }

    async getVehicleManufacturerInputSelectedOptionText(): Promise<string> {
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
        await this.page.waitForLoadState('load');
    }

    async getDetailDescriptionInputText(): Promise<string> {
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

    async getMapPopUpLocationText(): Promise<string> {
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

    async selectAdressOnMap() {
        await this.clickOnSelectOnMapBtn();
        await this.clickOnMap();
        await this.mapPopUpConfirmChoiseBtn.click()
        await this.clickOnSaveUnitChangesBtn();
    }

    async clickOnEditedUnitDeleteImgIcon(index: number) {
        await this.editedUnitDeleteImgIcons.nth(index).click();
    }

    async getEditedUnitUploadedPhotosCount(): Promise<number> {
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

    async getEditedUnitName(): Promise<string> {
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

    async getImgSrcAttr(numberOfImage: number): Promise<string | null> {
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
}

export default EditUnitPage;