import { test, expect } from '../fixtures';
import testData from '../data/test-data.json' assert {type: 'json'};
import {faker} from '@faker-js/faker';

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';
const createTenderTabsNames = testData['create tender tabs names'];
const errorMessages = testData['error messages'];
const placeholderTexts = testData['input placeholder texts'];
const titleTexts = testData['title texts'];
const borderColors = testData['border colors'];
const buttonNames = testData['button names'];
const pagesUrl = testData['pages URL path'];

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
    await expect(createTenderPage.createTenderPageTitle).toHaveText(titleTexts['create tender']);

    await expect(await createTenderPage.checkCreateTenderTabsTitles(1, createTenderTabsNames)).toBeTruthy();
});

test('Test Case: C778 Verify tender\'s name section', async ({createTenderPage }) => {
    await expect(createTenderPage.tenderNameTitle).toBeVisible();
    await expect(await createTenderPage.tenderNameTitle.innerText()).toContain(titleTexts['tender name']);
    await expect(await createTenderPage.tenderNameTitle.innerText()).toContain(titleTexts['arrow symbol']);
    await expect(createTenderPage.tenderNameInput).toHaveAttribute('placeholder', placeholderTexts['tender name input']);

    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.tenderNameInput).toHaveCSS('border-color', borderColors['error color']);
    await expect(createTenderPage.tenderNameInputErrorMsg).toBeVisible();
    await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(errorMessages['tender name less 10 symbols']);
    await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', borderColors['error color']);

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
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(errorMessages['tender name less 10 symbols']);
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', borderColors['error color']);

                await createTenderPage.copyPasteValue(createTenderPage.tenderNameInput);

                await expect(createTenderPage.tenderNameInputErrorMsg).toBeVisible();
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(errorMessages['tender name less 10 symbols']);
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', borderColors['error color']);
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
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveText(errorMessages['tender name less 10 symbols']);
                await expect(createTenderPage.tenderNameInputErrorMsg).toHaveCSS('color', borderColors['error color']);
                await expect(createTenderPage.tenderNameInput).toHaveValue('');
                break 

            case random10Char:
                await expect(createTenderPage.tenderNameInputErrorMsg).not.toBeVisible();
                await expect(createTenderPage.tenderNameInput).toHaveCSS('border-color', borderColors['default grey']);
                break 
        }
    }
});

test('Test Case: C779 Verify service section', async ({ createTenderPage }) => {
    await expect(createTenderPage.tenderServiceTitle).toBeVisible();
    await expect(await createTenderPage.tenderServiceTitle.innerText()).toContain(titleTexts['tender service']);
    await expect(await createTenderPage.tenderServiceTitle.innerText()).toContain(titleTexts['arrow symbol']);
    await expect(createTenderPage.tenderServiceInput).toHaveAttribute('placeholder', placeholderTexts['tender service input']);

    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.tenderServiceContainer).toHaveCSS('border-color', borderColors['error color']);
    await expect(createTenderPage.tenderServiceInputErrorMsg).toBeVisible();
    await expect(createTenderPage.tenderServiceInputErrorMsg).toHaveText(errorMessages['required field']);
    await expect(createTenderPage.tenderServiceInputErrorMsg).toHaveCSS('color', borderColors['error color']);

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
    await expect(createTenderPage.endDateErrorMsg).toHaveText(errorMessages['required field']);

    const startDate  = await createTenderPage.startDateInput.inputValue();
    const currentDate = new Date;
    const formatedStartDate = startDate.split(',')[0];
    const formatedCurrentDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth()+1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;
    const less24HourEndDate = currentDate.getDate() + 1;
    const dateBeforToday = currentDate.getDate() - 1;
    const correctDate = currentDate.getDate() + 2;

    await expect(formatedStartDate).toBe(formatedCurrentDate);

    await createTenderPage.endDateInput.click();
    await createTenderPage.selectDateAndTime(less24HourEndDate.toString(), '00:00')

    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.incorrectEndDateErrorMsg).toBeVisible();
    await expect(createTenderPage.incorrectEndDateErrorMsg).toHaveText(errorMessages['incorrect end date']);
    
    await createTenderPage.startDateInput.click()
    
    await expect(createTenderPage.DateCalendar).toBeVisible()
    await expect(await createTenderPage.getPreviousStartDate(dateBeforToday)).toHaveAttribute('aria-disabled', 'true');

    await createTenderPage.endDateInput.click();
    await createTenderPage.selectDateAndTime(correctDate.toString(), '00:00');

    const selectedEndDate = await createTenderPage.endDateInput.inputValue();

    await expect(createTenderPage.incorrectEndDateErrorMsg).not.toBeVisible();
    await expect(selectedEndDate.split('.')[0]).toBe(correctDate.toString());
    await expect(createTenderPage.workPeriodTitle).toBeVisible();

    await createTenderPage.workPeriodInput.click();

    const workPeriodStartDay = await createTenderPage.workPeriodStartDate.innerText();
    const difference = parseInt(workPeriodStartDay) - parseInt(selectedEndDate);

    await expect(difference).toBe(1);
    await expect(createTenderPage.DateCalendar).toBeVisible();

    await createTenderPage.selectDateAndTime(workPeriodStartDay); 

    const selectedWorkPeriodDate = await createTenderPage.workPeriodInput.inputValue();

    await expect(selectedWorkPeriodDate.split('.')[0]).toBe(workPeriodStartDay)
});

test('Test Case: C781 Verify announced price section', async ({ createTenderPage }) => {
    await createTenderPage.nextBtn.click();

    await expect(createTenderPage.budgetInput).toHaveValue('');
    await expect(createTenderPage.budgetInput).toHaveAttribute('placeholder', placeholderTexts['tender budget input']);
    await expect(createTenderPage.budgetInputErrorMsg).toBeVisible();
    await expect(createTenderPage.budgetInputErrorMsg).toHaveText(errorMessages['required field']);

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
    await expect(createTenderPage.descriptionInputErrorMsg).toContainText(errorMessages['tender description less 40 symbols']);

    const random39Char = faker.string.alpha({length: 39});

    await createTenderPage.fillCreateTenderInput(createTenderPage.descriptionInput, random39Char);

    await expect(createTenderPage.descriptionInputErrorMsg).toBeVisible();
    await expect(createTenderPage.descriptionInputErrorMsg).toContainText(errorMessages['tender description less 40 symbols']);
    
    await createTenderPage.fillCreateTenderInput(createTenderPage.descriptionInput, '<>{};^');
    
    await expect(createTenderPage.descriptionInput).toHaveText('');

    const random40Char = faker.string.alpha({length: 40});

    await createTenderPage.fillCreateTenderInput(createTenderPage.descriptionInput, random40Char);

    await expect(createTenderPage.descriptionInputErrorMsg).not.toBeVisible();
    await expect(createTenderPage.descriptionInput).toHaveText(random40Char);
});

test('Test Case: C784 Verify "Скасувати" button', async ({ page, createTenderPage }) => {
    await expect(createTenderPage.cancelBtn).toHaveText(buttonNames.cancel);

    let dialogAppeared = false; 

    page.on('dialog', async (dialog) => {
        await expect(dialog.type()).toBe('confirm')
            dialogAppeared = true;
            await dialog.accept(); 
    });
    await createTenderPage.clickOnCancelBtn();

    await expect(dialogAppeared).toBe(true);
    await expect(page).toHaveURL(new RegExp(pagesUrl['owner-tender']));
});

test('Test Case: C785 Verify "Далі" button', async ({ createTenderPage }) => {
    const tenderName = faker.string.alpha({length: 10});
    const letter = faker.string.alpha({length: 1});
    const endDate = await createTenderPage.getEndDate();
    const { workPeriodStartDate, workPeriodEndDate } = await createTenderPage.getWorkPeriodStartAndEndDate(endDate);
    const budget = faker.string.numeric(5);
    const description = faker.string.alpha({length: 40});

    await createTenderPage.fillRequiredFields(tenderName, letter,  endDate.toString(), workPeriodStartDate.toString(),  workPeriodEndDate.toString(), budget, description);
    await createTenderPage.nextBtn.click();

    while(await createTenderPage.maininfoTitle.isVisible()) {
        await createTenderPage.selectAdress();
        await createTenderPage.nextBtn.click();
    }
    
    await expect(createTenderPage.createTenderPageTabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(createTenderPage.uploadDocsSection).toBeVisible();
});