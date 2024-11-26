import { test, expect } from "../fixtures";
import testData from '../data/test-data.json' assert {type: 'json'}

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const errorMessages = testData["error messages"];
const buttonNames = testData["button names"];
const borderColors = testData["border colors"];
const titleTexts = testData["title texts"];

test.beforeEach(async ({ homepage, createUnitPage }) => {
    await homepage.navigate('/');
    await homepage.closePopUpBtn.click();
    await homepage.createUnitBtn.click();
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();
    await createUnitPage.fillCategory();
    await createUnitPage.fillAnnouncementName();
    await createUnitPage.fillVehicleManufacturer();
    await createUnitPage.fillAddress();
    await createUnitPage.clickOnNextBtn();
});

test('Test case C384: Verify same images uploading', async( {photoTab} ) => {
    await photoTab.uploadTwoSamePhotos();

    await expect(photoTab.invalidPhotoPopUp).toBeVisible();
    await expect(photoTab.invalidPhotoPopUp).toHaveText(errorMessages["uploading the same fotos is not allowed"]);

    await photoTab.closePopUpBtn.click();
    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'true');

    await photoTab.uploadTwoSamePhotos();
    await photoTab.submitPopUpBtn.click();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'true');

    await photoTab.clickOutsidePopUp();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'true');

    await photoTab.deleteUploadedImg(1);
}) 

test('Test case C401: Verify uploading of invalid file type', async( {photoTab} ) => {
    await photoTab.uploadIncorrectFileType();

    await expect(photoTab.invalidPhotoPopUp).toBeVisible();
    await expect(await photoTab.getInvalidPhotoPopUpText()).toContain(errorMessages["incorrect file format"]);

    await photoTab.closePopUpBtn.click();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();

    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileType();

    await expect(photoTab.submitPopUpBtn).toHaveText(buttonNames.understood);

    await photoTab.submitPopUpBtn.click();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileType();
    await photoTab.clickOutsidePopUp();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');
})

test('Test case C405: Verify uploading of invalid size file', async( {photoTab} ) => {
    await photoTab.uploadIncorrectFileSize();

    await expect(photoTab.invalidPhotoPopUp).toBeVisible();
    await expect(await photoTab.getInvalidPhotoPopUpText()).toContain(errorMessages["more 20Mb file"]);

    await photoTab.closePopUpBtn.click();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileSize();

    await expect(photoTab.submitPopUpBtn).toHaveText(buttonNames.understood);

    await photoTab.submitPopUpBtn.click();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileSize();
    await photoTab.clickOutsidePopUp();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');
})

test('Test case 390: Verify "Назад" button', async({ photoTab, createUnitPage }) => {
    await expect(photoTab.prevBtn).toHaveText(buttonNames.previous);

    await photoTab.prevBtn.click();

    await createUnitPage.checkCreateUnitTabsTitles(1);
    await expect(createUnitPage.categoriesDropDown).toBeVisible();
    await expect(createUnitPage.announcementNameInput).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerTitle).toBeVisible();
    await expect(createUnitPage.modelNameInput).toBeVisible();
    await expect(createUnitPage.technicalInfoInput).toBeVisible();
    await expect(createUnitPage.descriptionInfoInput).toBeVisible();
    await expect(createUnitPage.addressSelectionInput).toBeVisible();
})

test('Test case 393: Verify "Далі" button', async({ createUnitPage, photoTab, servicesTab }) => {
    await expect(createUnitPage.nextBtn).toHaveText(buttonNames.next);

    await createUnitPage.clickOnNextBtn();

    await expect(photoTab.uploadPhotoClueLine).toBeVisible();
    await expect(photoTab.uploadPhotoClueLine).toHaveCSS('color', borderColors["error color"]);

    await photoTab.uploadPhoto();
    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.createUnitTitle).toHaveText(titleTexts["create unit"]);
    await createUnitPage.checkCreateUnitTabsTitles(3);
    await expect(servicesTab.servicesTabTitle).toBeVisible();
    await expect(servicesTab.servicesTabInput).toBeVisible();
})

test('Test case C593: Verify image uploading', async( {photoTab}) => {
    await expect(photoTab.photoTabTitle).toBeVisible
    await expect(await photoTab.getPhotoTabTitleText()).toContain(titleTexts["photo tab title"]);
    await expect(await photoTab.getPhotoTabTitleText()).toContain(titleTexts["arrow symbol"]);
    await expect(await photoTab.getUploadPhotoClueLineText()).toContain(errorMessages["upload images"]);
    await photoTab.checkFileChooserIsDisplayed();  

    await photoTab.uploadToTwelvePhotos(1);

    await expect(photoTab.firstImgLable).toBeVisible();
    await expect(photoTab.firstImgLable).toHaveText('Головне'); 

    const imageBlocksItems = await photoTab.imageBlocks.all();

    await photoTab.deleteUploadedImg(imageBlocksItems.length)
})

test('Test case C594: Verify image moving', async({photoTab}) => {
    await photoTab.uploadToTwelvePhotos(2);

    const imageBlockItems = await photoTab.imageBlocks.all();
    const imagesCount = imageBlockItems.length;
    const maxIndex = imagesCount - 1;
    const firstImageAttrBefore = await photoTab.unitImages.first().getAttribute('src');

    for(let i = maxIndex; i > 0; i--) {
        let imgSrcAttr = await photoTab.unitImages.nth(i).getAttribute('src');
        if(imgSrcAttr !== '') {
            await photoTab.imageBlocks.nth(i).dragTo(photoTab.imageBlocks.first());
            await photoTab.page.waitForLoadState('load');

            const firstImageAttrAfter = await photoTab.unitImages.first().getAttribute('src');

            await expect(firstImageAttrBefore).not.toBe(firstImageAttrAfter);
        }
    }

    const imageBlocksItems = await photoTab.imageBlocks.all();

    await photoTab.deleteUploadedImg(imageBlocksItems.length)
})

test('Test case C595: Verify image deleting', async( {page, photoTab}) => {
    await photoTab.uploadToTwelvePhotos(1);

    const imageBlocksItems = await photoTab.imageBlocks.all();
    for(let i = imageBlocksItems.length - 1; i >= 0; i--) {
        let imageBlockAttr = await photoTab.imageBlocks.nth(i).getAttribute('draggable');

        if(imageBlockAttr === 'true') {
            await photoTab.imageBlocks.nth(i).hover();

            await expect(photoTab.deleteImgIcons.nth(i)).toBeVisible();

            await photoTab.deleteImgIcons.nth(i).click();
            await page.waitForLoadState('domcontentloaded');

            imageBlockAttr = await photoTab.imageBlocks.nth(i).getAttribute('draggable');
            
            await expect(imageBlockAttr).toBe('false');
       }
    }
})