import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';
import path from 'path';
import testData from '../data/test_data.json' assert {type: 'json'};

const photoFileNames = testData['photo file names'];

class PhotoTab extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
        } 
    
    imageBlocks =  this.page.locator('[data-testid="imageBlock"]');
    uploadFileInput = this.page.locator('[data-testid="input_ImagesUnitFlow"]');
    invalidPhotoPopUp = this.page.locator('[data-testid="errorPopup"]');
    closePopUpBtn = this.page.locator('[data-testid="closeIcon"]');
    submitPopUpBtn = this.page.locator('[class*="ItemButtons_darkBlueBtn"]');
    elementOutsidePopUp = this.page.locator('[class*="NavbarCatalog_wrapper"]');
    prevBtn = this.page.locator('[data-testid="prevButton"]');
    uploadPhotoClueLine = this.page.locator('div[data-testid="description"]');
    photoTabTitle = this.page.locator('div[class="ImagesUnitFlow_paragraph__gQRyS"]');
    firstImgLable = this.page.locator('[data-testid="mainImageLabel"]');
    deleteImgIcons = this.page.locator('[data-testid="deleteImage"]');
    unitImages = this.page.locator('[data-testid="unitImage"]');


    async uploadPhoto() {
        await this.imageBlocks.nth(0).focus();
        await this.uploadFileInput.setInputFiles(path.resolve('data/photo/pexels-mikebirdy-170811.jpg'));
    }

    async uploadTwoSamePhotos() {
        for(let i = 0; i < 2; i++) {
            await this.imageBlocks.nth(i).focus();
            await this.uploadFileInput.setInputFiles(path.resolve('data/photo/pexels-mikebirdy-170811.jpg'));
        }
    }

    async getInvalidPhotoPopUpText() {
        return await this.invalidPhotoPopUp.innerText();
    }

    async clickOnClosePopUpBtn() {
        await this.closePopUpBtn.click();
    }

    async clickOnSubmitPopUpBtn() {
        await this.submitPopUpBtn.click();
    }

    async clickOutsidePopUp() {
        await this.elementOutsidePopUp.click({force: true});
    }

    async uploadIncorrectFileType() {
            await this.imageBlocks.nth(0).focus();
            await this.uploadFileInput.setInputFiles(path.resolve('data/test.txt'));
    }

    async uploadIncorrectFileSize() {
        await this.imageBlocks.nth(0).focus();
        await this.uploadFileInput.setInputFiles(path.resolve('data/photo/21mb.jpg'));
    }
    
    async clickOnPrevBtn() {
        await this.prevBtn.click();
    }

    async getPhotoTabTitleText() {
        return await this.photoTabTitle.innerText();
    }

    async getUploadPhotoClueLineText() {
       return await this.uploadPhotoClueLine.innerText();
    }

    async clickOnImageBlock() {
        await this.imageBlocks.first().click();
    }

    async checkFileChooserIsDisplayed() {
        const imageBlockItems = await this.imageBlocks.all();
        for(let i = 0; i < imageBlockItems.length; i++) {
            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                this.imageBlocks.nth(i).click()
            ])
            expect(fileChooser).toBeDefined();
        }
    }

    async uploadToTwelvePhotos(minPhotoCount: number) {
        const randomNumber = Math.floor(Math.random() * (13 - minPhotoCount)) + minPhotoCount;
        for(let i = 1; i <= randomNumber; i++) {
            await this.imageBlocks.nth(i - 1).focus();
            await this.uploadFileInput.setInputFiles(path.resolve(`data/photo/${photoFileNames[i - 1]}.jpg`));
            await this.page.waitForLoadState('networkidle')
        }
    }

    async deleteUploadedImg(itemsLength: number) {
        for(let i =0; i < itemsLength; i++) {
            const imageBlockAttr = await this.imageBlocks.nth(i).getAttribute('dragable');
            if(imageBlockAttr === 'true') {
                await this.imageBlocks.nth(i).hover();
                await this.deleteImgIcons.nth(i).click();
            }
        }
    }
 }

export default PhotoTab;