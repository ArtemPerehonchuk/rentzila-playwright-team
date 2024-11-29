import { test, expect } from '../fixtures';
import testData from '../data/test.data.json' assert {type: 'json'};
import {faker} from '@faker-js/faker';

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let accessUserToken: string;
let accessAdminToken: string;

test.beforeAll(async ({apiHelper}) => {
    accessUserToken = await apiHelper.createUserAccessToken(); 
    accessAdminToken = await apiHelper.createAdminAccessToken();
});

test.beforeEach(async ({homepage, ownerTendersPage}) => {
    await homepage.loginUser(VALID_EMAIL, VALID_PASSWORD);
    await homepage.clickOnUserIcon();
    await homepage.clickOnProfileTendersItem();
    await ownerTendersPage.createTenderBtn.click();
})

test('Test Case: C777 Verify body and tabs titles', async ({createTenderPage }) => {
    await expect(createTenderPage.createTenderPageTitle).toBeVisible();
    await expect(createTenderPage.createTenderPageTitle).toHaveText(testData.titleTexts.createTender);

    await expect(await createTenderPage.checkCreateTenderTabsTitles(1, testData['create tender tabs names'])).toBeTruthy();
});

test('Test Case: C778 Verify tender\'s name section', async ({createTenderPage }) => {
    await expect(createTenderPage.tenderNameTitle).toBeVisible();
    await expect(await createTenderPage.tenderNameTitle.innerText()).toContain(testData.titleTexts.tenderName);
    await expect(await createTenderPage.tenderNameTitle.innerText()).toContain(testData.titleTexts.arrowSymbol);
    await expect(createTenderPage.tenderNameInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.tenderNameInput);

    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.tenderNameInput).toHaveCSS('border-color', testData.borderColors.errorColor);
    await expect(createTenderPage.tenderNameInputErrorMsg).toBeVisible();
    await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(testData.errorMessages.tenderNameLess10Symbols);
    await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', testData.borderColors.errorColor);

    const random10Char = faker.string.alpha({length: 10});
    const randomLetter = faker.string.alpha({length: 1});
    const random9Char = faker.string.alpha({length: 9});
    const random71Char = faker.string.alpha({length: 71});
    const inputValues = [
        random9Char,
        random71Char,
        '{}<>;^',
        random10Char
    ]

    for(const inputValue of inputValues) {
        await createTenderPage.clearCreateTenderInput(createTenderPage.tenderNameInput)
        await createTenderPage.fillCreateTenderInput(createTenderPage.tenderNameInput, inputValue);
        await createTenderPage.nextBtn.click();

        switch(inputValue) {

            case random9Char:
                await expect(createTenderPage.tenderNameInputErrorMsg).toBeVisible();
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(testData.errorMessages.tenderNameLess10Symbols);
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', testData.borderColors.errorColor);

                await createTenderPage.copyPasteValue(createTenderPage.tenderNameInput);

                await expect(createTenderPage.tenderNameInputErrorMsg).toBeVisible();
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(testData.errorMessages.tenderNameLess10Symbols);
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', testData.borderColors.errorColor);
                break
            
            case random71Char:
                const filledValue = await createTenderPage.tenderNameInput.inputValue();

                await expect(filledValue.length).toBe(70);

                await createTenderPage.copyPasteValue(createTenderPage.tenderNameInput);
                await createTenderPage.fillCreateTenderInput(createTenderPage.tenderNameInput, randomLetter)

                await expect(filledValue.length).toBe(70);
                break

            case '{}<>;^':
                await expect(createTenderPage.tenderNameInputErrorMsg).toBeVisible();
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(testData.errorMessages.tenderNameLess10Symbols);
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', testData.borderColors.errorColor);
                await expect(createTenderPage.tenderNameInput).toHaveValue('');
                break 

            case random10Char:
                await expect(createTenderPage.tenderNameInputErrorMsg).not.toBeVisible();
                await expect(createTenderPage.tenderNameInput).toHaveCSS('border-color', testData.borderColors.defaultGrey);
                break 
        }
    }
});

test('Test Case: C779 Verify service section', async ({ createTenderPage }) => {
    await expect(createTenderPage.tenderServiceTitle).toBeVisible();
    await expect(await createTenderPage.tenderServiceTitle.innerText()).toContain(testData.titleTexts.tenderService);
    await expect(await createTenderPage.tenderServiceTitle.innerText()).toContain(testData.titleTexts.arrowSymbol);
    await expect(createTenderPage.tenderServiceInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.tenderServiceInput);

    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.tenderServiceContainer).toHaveCSS('border-color', testData.borderColors.errorColor);
    await expect(createTenderPage.tenderServiceInputErrorMsg).toBeVisible();
    await expect(createTenderPage.tenderServiceInputErrorMsg).toHaveText(testData.errorMessages.requiredField);
    await expect(createTenderPage.tenderServiceInputErrorMsg).toHaveCSS('color', testData.borderColors.errorColor);

    const randomLetter = faker.string.alpha({length: 1});
    const random101Char = faker.string.alpha({length: 101});
    const inputValues = [
        randomLetter,
        random101Char,
        '{}<>;^',
    ]

    for(const inputValue of inputValues) {
        await createTenderPage.fillCreateTenderInput(createTenderPage.tenderServiceInput, inputValue);

        switch(inputValue) {
            
            case random101Char:
                const filledValue = await createTenderPage.tenderServiceInput.inputValue();

                await expect(filledValue.length).toBe(100);
                await expect(await createTenderPage.serviceNotFoundMsg.innerText()).toContain(`На жаль, послугу “${random101Char.charAt(0).toUpperCase() + random101Char.slice(1, -1)}“ не знайдено в нашій базі.`)
                break

            case '{}<>;^':
                await expect(createTenderPage.tenderServiceInput).toHaveValue('');
                break 

            case randomLetter:
                const dropDownOptions = await createTenderPage.seviceDropDownOptions.allInnerTexts();
                await expect(createTenderPage.servicesDropDown).toBeVisible();
                
                for(const option of dropDownOptions) {
                    await expect(option.toLowerCase()).toContain(randomLetter.toLowerCase());
                }
                
                const firstOption = await createTenderPage.seviceDropDownOptions.first().innerText();

                await createTenderPage.seviceDropDownOptions.first().click();

                await expect(createTenderPage.serviceSelectedOption).toHaveText(firstOption);
                await expect(createTenderPage.tenderCategory).toBeVisible();

                await createTenderPage.removeSelectedServiceicon.click();
                break 
        }
    }
});

test('Test Case: C780 Verify tenders duration section', async ({ createTenderPage }) => {
    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.endDateErrorMsg).toBeVisible();
    await expect(createTenderPage.endDateErrorMsg).toHaveText(testData.errorMessages.requiredField);

    const startDate  = await createTenderPage.startDateInput.inputValue();
    const currentDate = new Date;
    const formatedStartDate = startDate.split(',')[0];
    const formatedCurrentDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth()+1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;
    const dateBeforToday = currentDate.getDate() - 1;
    const correctDate = await createTenderPage.getEndDate()

    await expect(formatedStartDate).toBe(formatedCurrentDate);

    await createTenderPage.endDateInput.click();
    await createTenderPage.selectDateAndTime(0, '00:00')

    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.incorrectEndDateErrorMsg).toBeVisible();
    await expect(createTenderPage.incorrectEndDateErrorMsg).toHaveText(testData.errorMessages.incorrectEndDate);
    
    await createTenderPage.startDateInput.click()
    
    await expect(createTenderPage.DateCalendar).toBeVisible()
    await expect((await createTenderPage.getPreviousStartDate(dateBeforToday)).last()).toHaveAttribute('aria-disabled', 'true');

    await createTenderPage.endDateInput.click();
    await createTenderPage.selectDateAndTime(1, '23:00');

    const selectedEndDate = await createTenderPage.endDateInput.inputValue();

    await expect(createTenderPage.incorrectEndDateErrorMsg).not.toBeVisible();
    await expect(selectedEndDate.split('.')[0]).toBe(correctDate.padStart(2, '0'));
    await expect(createTenderPage.workPeriodTitle).toBeVisible();

    await createTenderPage.workPeriodInput.click();

    const workPeriodStartDay = await createTenderPage.workPeriodStartDate.innerText();
    const difference = parseInt(workPeriodStartDay) - parseInt(selectedEndDate);

    await expect(difference).not.toBe(0);
    await expect(createTenderPage.DateCalendar).toBeVisible();

    await createTenderPage.selectDateAndTime(0); 

    const selectedWorkPeriodDate = await createTenderPage.workPeriodInput.inputValue();

    await expect(selectedWorkPeriodDate.split('.')[0]).toBe(workPeriodStartDay.padStart(2, '0'))
});

test('Test Case: C781 Verify announced price section', async ({ createTenderPage }) => {
    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.budgetInput).toHaveValue('');
    await expect(createTenderPage.budgetInput).toHaveAttribute('placeholder', testData.inputPlaceholderTexts.tenderBudgetInput);
    await expect(createTenderPage.budgetInputErrorMsg).toBeVisible();
    await expect(createTenderPage.budgetInputErrorMsg).toHaveText(testData.errorMessages.requiredField);

    await createTenderPage.fillCreateTenderInput(createTenderPage.budgetInput, 'a"`{}<>;^');

    await expect(createTenderPage.budgetInput).toHaveValue('');

    const random10CharNumber = faker.number.int({min: 1000000000, max: 9999999999});

    await createTenderPage.fillCreateTenderInput(createTenderPage.budgetInput, random10CharNumber.toString());
    

    await expect((await createTenderPage.budgetInput.inputValue()).length).toBe(9);
    await expect((await createTenderPage.budgetInput.inputValue())).toBe(random10CharNumber.toString().slice(0, -1))
});

test('Test Case: C783 Verify additional info section', async ({ page, createTenderPage }) => {
    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.descriptionInputErrorMsg).toBeVisible();
    await expect(createTenderPage.descriptionInputErrorMsg).toContainText(testData.errorMessages.tenderDescriptionLess40Symbols);

    const random39Char = faker.string.alpha({length: 39});

    await createTenderPage.fillCreateTenderInput(createTenderPage.descriptionInput, random39Char);

    await expect(createTenderPage.descriptionInputErrorMsg).toBeVisible();
    await expect(createTenderPage.descriptionInputErrorMsg).toContainText(testData.errorMessages.tenderDescriptionLess40Symbols);
    
    await createTenderPage.fillCreateTenderInput(createTenderPage.descriptionInput, '<>{};^');
    
    await expect(createTenderPage.descriptionInput).toHaveText('');

    const random40Char = faker.string.alpha({length: 40});

    await createTenderPage.fillCreateTenderInput(createTenderPage.descriptionInput, random40Char);

    await expect(createTenderPage.descriptionInputErrorMsg).not.toBeVisible();
    await expect(createTenderPage.descriptionInput).toHaveText(random40Char);
});

test('Test Case: C784 Verify "Скасувати" button', async ({ page, createTenderPage }) => {
    await expect(createTenderPage.cancelBtn).toHaveText(testData.buttonNames.cancel);

    let dialogAppeared = false; 

    page.on('dialog', async (dialog) => {
        await expect(dialog.type()).toBe('confirm')
            dialogAppeared = true;
            await dialog.accept(); 
    });
    await createTenderPage.clickOnCancelBtn();

    await expect(dialogAppeared).toBe(true);
    await expect(page).toHaveURL(new RegExp(testData.pagesURLPath['owner-tender']));
});

test('Test Case: C785 Verify "Далі" button', async ({ createTenderPage }) => {
    const tenderName = faker.string.alpha({length: 10});
    const letter = faker.string.alpha({length: 1});
    const budget = faker.string.numeric(5);
    const description = faker.string.alpha({length: 40});

    await createTenderPage.fillRequiredFields(tenderName, letter, budget, description);
    await createTenderPage.nextBtn.click();

    while(await createTenderPage.maininfoTitle.isVisible()) {
        await createTenderPage.selectAdress();
        await createTenderPage.nextBtn.click();
    }
    
    await expect(createTenderPage.createTenderPageTabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(createTenderPage.uploadDocsSection).toBeVisible();
});

test('Test case C786 Verify documents uploading', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();

    await expect(createTenderPage.docsTitle.first()).toBeVisible();
    await expect(createTenderPage.docsTitle.first()).toContainText(testData.titleTexts.tenderDocsTitle);
    await expect(createTenderPage.docsTitle.first()).toContainText(testData.titleTexts.arrowSymbol);
    await expect(createTenderPage.docsClue1).toHaveText(testData.clueTexts.tenderDocsClue1);
    await expect(createTenderPage.docsClue2).toHaveText(testData.clueTexts.tenderDocsClue2);
    await expect(createTenderPage.getFileChooser()).toBeDefined();

    for(const fileName of testData.fileNames) {
        await createTenderPage.uploadFile(fileName);

        await expect(createTenderPage.uploadedFile).toBeVisible();
        await expect(createTenderPage.uploadedFile).toHaveText(fileName)

        await createTenderPage.deleteUploadedFileIcon.click();
    }
})

test('Test case C787 Verify same documents uploading', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();

    await expect(createTenderPage.getFileChooser()).toBeDefined();

    await createTenderPage.uploadFile(testData.fileNames[0]);

    await expect(createTenderPage.uploadedFile).toBeVisible();
    await expect(createTenderPage.uploadedFile).toHaveText(testData.fileNames[0])

    await createTenderPage.uploadFile(testData.fileNames[0]);

    await expect(createTenderPage.notValidFilePopUp).toBeVisible();
})

test('Test case C788 Verify uploading of invalid file type', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();

    await createTenderPage.uploadFile(testData.invalidFileNames.invalidFormat);

    await expect(createTenderPage.notValidFilePopUp).toBeVisible();
})

test('Test case C789 Verify uploading of invalid file size', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();

    await createTenderPage.uploadFile(testData.invalidFileNames.invalidSize);

    await expect(createTenderPage.notValidFilePopUp).toBeVisible();
})

test('Test case C790 Verify docs deleting', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();

    await expect(createTenderPage.getFileChooser()).toBeDefined();

    const validFileIndex = Math.floor(Math.random() * testData.fileNames.length)

    await createTenderPage.uploadFile(testData.fileNames[validFileIndex]);

    await expect(createTenderPage.uploadedFile).toBeVisible();
    await expect(createTenderPage.uploadedFile).toHaveText(testData.fileNames[validFileIndex]);

    await createTenderPage.deleteUploadedFileIcon.click();

    await expect(createTenderPage.uploadedFile).not.toBeVisible();
})

test('Test case C791 Verify "Назад" button', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();

    await createTenderPage.previousBtn.click();

    await createTenderPage.checkCreateTenderTabsTitles(1, testData['create tender tabs names']);
})

test('Test case C792 Verify "Далі" button', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();
    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.addFileErrorMsg).toBeVisible();
    await expect(createTenderPage.addFileErrorMsg).toHaveText(testData.errorMessages.addMin1File);

    const validFileIndex = Math.floor(Math.random() * testData.fileNames.length)

    await createTenderPage.uploadFile(testData.fileNames[validFileIndex]);
    await createTenderPage.nextBtn.click();
    await createTenderPage.checkCreateTenderTabsTitles(3, testData['create tender tabs names'])
})

test('Test case C827 Verify more then allowed number of docs', async({createTenderPage}) => {
    await createTenderPage.docsTab.click();
    
    await expect(createTenderPage.getFileChooser()).toBeDefined();

    for(let i = 0; i < 6; i++){
        await createTenderPage.uploadFile(testData.fileNames[i]);
    }

    await expect(createTenderPage.notValidFilePopUp).toBeVisible();

    await createTenderPage.understoodPopUpBtn.click();

    const uploadedFiles = await createTenderPage.uploadedFile.all();

    for(let i = 0; i < uploadedFiles.length; i++){
        await expect(createTenderPage.uploadedFile.nth(i)).toBeVisible()
    }

    await expect(uploadedFiles.length).toBe(5)
})