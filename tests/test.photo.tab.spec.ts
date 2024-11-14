import { test, expect } from "@playwright/test";
import HomePage from '../pages/home.page';
import CreateUnitPage from '../pages/create.unit.page';
import PhotoTab from '../pages/photo.tab';
import ServicesTab from '../pages/services.tab'

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let createUnitPage: CreateUnitPage;
let homepage: HomePage;
let photoTab: PhotoTab;
let servicesTab: ServicesTab;

test.beforeEach(async ({ page }) => {
    homepage = new HomePage(page);
    createUnitPage = new CreateUnitPage(page);
    photoTab = new PhotoTab(page);
    servicesTab = new ServicesTab(page);

    await homepage.navigate('/');
    await homepage.clickOnClosePopUpBtn();
    await homepage.clickOnCreateUnitBtn();
    await homepage.fillInput('email', VALID_EMAIL);
    await homepage.fillInput('password', VALID_PASSWORD);
    await homepage.clickOnSubmitLoginFormBtn();
    await createUnitPage.fillCategory();
    await createUnitPage.fillAnnouncementName();
    await createUnitPage.fillVehicleManufacturer();
    await createUnitPage.fillAddress();
    await createUnitPage.clickOnNextBtn();
});

test('Test case C384: Verify same images uploading', async( {page} ) => {
    await photoTab.uploadTwoSamePhotos();

    await expect(photoTab.invalidPhotoPopUp).toBeVisible();
    await expect(photoTab.invalidPhotoPopUp).toHaveText('Ви не можете завантажити двічі один файл.');

    await photoTab.clickOnClosePopUpBtn();
    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'true');

    await photoTab.uploadTwoSamePhotos();
    await photoTab.clickOnSubmitPopUpBtn();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'true');

    await photoTab.clickOutsidePopUp();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'true');

    await photoTab.deleteUploadedImg(1);
}) 

test('Test case C401: Verify uploading of invalid file type', async( {page} ) => {
    await photoTab.uploadIncorrectFileType();

    await expect(photoTab.invalidPhotoPopUp).toBeVisible();
    await expect(await photoTab.getInvalidPhotoPopUpText()).toContain('Формат зображення не підтримується');

    await photoTab.clickOnClosePopUpBtn();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();

    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileType();

    await expect(photoTab.submitPopUpBtn).toHaveText('Зрозуміло');

    await photoTab.clickOnSubmitPopUpBtn();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileType();
    await photoTab.clickOutsidePopUp();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');
})

test('Test case C405: Verify uploading of invalid size file', async( {page} ) => {
    await photoTab.uploadIncorrectFileSize();

    await expect(photoTab.invalidPhotoPopUp).toBeVisible();
    await expect(await photoTab.getInvalidPhotoPopUpText()).toContain('Ви не можете завантажити файл більше 20 МВ');

    await photoTab.clickOnClosePopUpBtn();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileSize();

    await expect(photoTab.submitPopUpBtn).toHaveText('Зрозуміло');

    await photoTab.clickOnSubmitPopUpBtn();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');

    await photoTab.uploadIncorrectFileSize();
    await photoTab.clickOutsidePopUp();

    await expect(photoTab.invalidPhotoPopUp).not.toBeVisible();
    await expect(photoTab.imageBlocks.first()).toHaveAttribute('draggable', 'false');
})

test('Test case 390: Verify ""Назад"" button', async({ page }) => {
    await expect(photoTab.prevBtn).toHaveText('Назад');

    await photoTab.clickOnPrevBtn();

    await createUnitPage.checkCreateUnitTabsTitles(1);
    await expect(createUnitPage.categoriesDropDown).toBeVisible();
    await expect(createUnitPage.announcementNameInput).toBeVisible();
    await expect(createUnitPage.vehicleManufacturerTitle).toBeVisible();
    await expect(createUnitPage.modelNameInput).toBeVisible();
    await expect(createUnitPage.technicalInfoInput).toBeVisible();
    await expect(createUnitPage.descriptionInfoInput).toBeVisible();
    await expect(createUnitPage.addressSelectionInput).toBeVisible();
})

test('Test case 393: Verify ""Далі"" button', async({ page }) => {
    await expect(createUnitPage.nextBtn).toHaveText('Далі');

    await createUnitPage.clickOnNextBtn();

    await expect(photoTab.uploadPhotoClueLine).toBeVisible();
    await expect(photoTab.uploadPhotoClueLine).toHaveCSS('color', 'rgb(247, 56, 89)');

    await photoTab.uploadPhoto();
    await createUnitPage.clickOnNextBtn();

    await expect(createUnitPage.createUnitTitle).toHaveText('Створити оголошення');
    await createUnitPage.checkCreateUnitTabsTitles(3);
    await expect(servicesTab.servicesTabTitle).toBeVisible();
    await expect(servicesTab.servicesTabInput).toBeVisible();
})

test('Test case C593: Verify image uploading', async( {page}) => {
    await expect(photoTab.photoTabTitle).toBeVisible
    await expect(await photoTab.getPhotoTabTitleText()).toContain('Фото технічного засобу');
    await expect(await photoTab.getPhotoTabTitleText()).toContain('*');
    await expect(await photoTab.getUploadPhotoClueLineText()).toContain('Додайте в оголошення від 1 до 12 фото технічного засобу розміром до 20 МВ у форматі .jpg, .jpeg, .png. Перше фото буде основним');
    await photoTab.checkFileChooserIsDisplayed();  

    await photoTab.uploadToTwelvePhotos(1);

    await expect(photoTab.firstImgLable).toBeVisible();
    await expect(photoTab.firstImgLable).toHaveText('Головне'); 

    const imageBlocksItems = await photoTab.imageBlocks.all();

    await photoTab.deleteUploadedImg(imageBlocksItems.length)
})

test('Test case C594: Verify image moving', async( {page}) => {
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

test('Test case C595: Verify image deleting', async( {page}) => {
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