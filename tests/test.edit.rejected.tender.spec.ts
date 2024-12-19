import { test, expect } from "../fixtures";
import testData from '../data/test.data.json' assert {type: 'json'};
import { faker } from "@faker-js/faker";

// import ApiHelper from "../helpers/api.helper";
// import OwnerTendersPage from "../pages/owner.tenders.page";

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let userAccessToken: string;
let adminAccessToken: string;
let createdTender;
let createdTenderId: number;
let createdTenderName: string;

test.beforeAll(async ({apiHelper}) => {
    userAccessToken = await apiHelper.createUserAccessToken();
    adminAccessToken = await apiHelper.createAdminAccessToken()
})

test.beforeEach('test', async ({apiHelper, homepage}) => {
    await homepage.loginUser(VALID_EMAIL, VALID_PASSWORD);

    createdTender = await apiHelper.createTender(userAccessToken);
    createdTenderId = createdTender.id
    createdTenderName = faker.lorem.word()

    await apiHelper.addFileToTender(userAccessToken, createdTenderId, createdTenderName);
    await apiHelper.moderateTenderStatus(adminAccessToken, createdTenderId, 'declined');
    // await apiHelper.getTenderById(userAccessToken, createdTenderId)
    //await apiHelper.getTendersList(userAccessToken);
})

test.only('Test case C238: Edit the rejected tender with valid values (default contact person)', async({page, homepage, ownerTendersPage, editTenderPage, apiHelper}) => {
    test.setTimeout(180000)

    await page.goto(`${testData.pagesURLPath["owner-tender"]}`);
    await page.waitForLoadState('networkidle');
    await homepage.closePopUpBtn.click()
    await ownerTendersPage.rejectedTab.click();

    await expect((await ownerTendersPage.rejectedTenders.all()).length).not.toBe(0);

    await ownerTendersPage.editBtn.first().click();

    await expect(page).toHaveURL(new RegExp(testData.pagesURLPath.editTender));

    await editTenderPage.tenderNameInput.clear();
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.tenderNameInputError).toBeVisible();
    await expect(editTenderPage.tenderNameInputError).toHaveText(testData.errorMessages.tenderNameLess10Symbols);

    const random9Char = faker.string.alpha({length: 9});

    await editTenderPage.tenderNameInput.clear()
    await editTenderPage.tenderNameInput.fill(random9Char);
    await page.waitForLoadState('networkidle')
    await editTenderPage.saveTenderChangesBtn.click();
    await page.waitForLoadState('networkidle')

    await expect(await editTenderPage.tenderNameInput.inputValue()).toBe(random9Char)
    await expect(editTenderPage.tenderNameInputError).toBeVisible();
    await expect(editTenderPage.tenderNameInputError).toHaveText(testData.errorMessages.tenderNameLess10Symbols);

    for(let i = 0; i < testData.restrictedSymbols.length; i++) {
        const nameWithRestrictedSymbol = random9Char + testData.restrictedSymbols[i];

        await await editTenderPage.tenderNameInput.type(nameWithRestrictedSymbol);
        //await editTenderPage.saveTenderChangesBtn.click();

        await expect(await editTenderPage.tenderNameInput.inputValue()).not.toContain(testData.restrictedSymbols[i]);

        await editTenderPage.tenderNameInput.clear()
        await await editTenderPage.tenderNameInput.fill(nameWithRestrictedSymbol);
        //await editTenderPage.saveTenderChangesBtn.click();

        await expect(await editTenderPage.tenderNameInput.inputValue()).not.toContain(testData.restrictedSymbols[i]);
    }

    const random71Char = faker.string.alpha({length: 71})

    await editTenderPage.tenderNameInput.type(random71Char);

    await expect((await editTenderPage.tenderNameInput.inputValue()).length).toBe(70);

    await editTenderPage.removeTenderServiceBtn.click();
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(await editTenderPage.tenderServiceInput.inputValue()).toBe('');
    await expect(editTenderPage.tenderServiceInputError).toBeVisible();
    await expect(editTenderPage.tenderServiceInputError).toHaveText(testData.errorMessages.requiredField);

    const randomChar = faker.string.alpha({length: 1});

    await editTenderPage.tenderServiceInput.fill(randomChar);

    await expect(editTenderPage.tenderServicesDropDown).toBeVisible();

    const selectedService = await editTenderPage.tenderServicesDropDownOptions.first().innerText();

    await editTenderPage.tenderServicesDropDownOptions.first().click();

    await expect(editTenderPage.selectedTenderService).toHaveText(selectedService);

    const incorrectBudgetValues = Object.entries(testData.strWithSymbols)

    for (const [symbol, value] of incorrectBudgetValues) {
        await editTenderPage.tenderBudgetInput.clear();

        await await editTenderPage.tenderBudgetInput.type(value);
        //await editTenderPage.saveTenderChangesBtn.click();

        await expect(editTenderPage.tenderBudgetInputError).toBeVisible();
        await expect(editTenderPage.tenderBudgetInputError).toHaveText(testData.errorMessages.requiredField)

        await editTenderPage.tenderBudgetInput.clear()
        await await editTenderPage.tenderBudgetInput.fill(value);
        //await editTenderPage.saveTenderChangesBtn.click();

        await expect(editTenderPage.tenderBudgetInputError).toBeVisible();
        await expect(editTenderPage.tenderBudgetInputError).toHaveText(testData.errorMessages.requiredField)
    }

    const random10NumStr = faker.string.numeric({length: 10});

    await editTenderPage.tenderBudgetInput.type(random10NumStr);

    await expect((await editTenderPage.tenderBudgetInput.inputValue()).length).toBe(9);

    await editTenderPage.tenderBudgetInput.clear();
    await editTenderPage.tenderBudgetInput.fill(random10NumStr);
    await page.waitForLoadState('networkidle');

    await expect((await editTenderPage.tenderBudgetInput.inputValue()).length).toBe(9);

    await editTenderPage.tenderDescriptionInput.clear();

    const random39Char = faker.string.alpha({length: 39});

    await editTenderPage.tenderDescriptionInput.fill(random39Char);

    await expect(editTenderPage.tenderDescriptionInputError).toBeVisible();
    await expect(editTenderPage.tenderDescriptionInputError).toContainText(testData.errorMessages.tenderDescriptionLess40Symbols);

    for(let i = 0; i < testData.restrictedSymbols.length; i++) {
        const restrictedSymbolInEnd = random39Char + testData.restrictedSymbols[i];
    
        await editTenderPage.tenderDescriptionInput.fill(restrictedSymbolInEnd);

        await expect(editTenderPage.tenderDescriptionInputError).toBeVisible();
        await expect(editTenderPage.tenderDescriptionInputError).toContainText(testData.errorMessages.tenderDescriptionLess40Symbols)
    }

    await editTenderPage.removeDocBtn.click();
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.tenderDocsErrorMsg).toBeVisible();
    await expect(editTenderPage.tenderDocsErrorMsg).toHaveText(testData.errorMessages.uploadMin1Doc);

    await editTenderPage.operatorCheckbox.click();

    await expect(editTenderPage.lastNameInput).toBeVisible();
    await expect(editTenderPage.firstNameInput).toBeVisible();
    await expect(editTenderPage.phoneInput).toBeVisible();
    await expect(editTenderPage.lastNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.firstNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.phoneInputErrorMsg).toBeVisible();
    await expect(editTenderPage.lastNameInputErrorMsg).toHaveText(testData.errorMessages.requiredField);
    await expect(editTenderPage.firstNameInputErrorMsg).toHaveText(testData.errorMessages.requiredField);
    await expect(editTenderPage.phoneInputErrorMsg).toHaveText(testData.errorMessages.requiredField);

    const lastName = faker.person.lastName();
    const firstName = faker.person.firstName();
    const phoneNumber = testData.incorrectPhoneNumbers.withoutCountryCode

    await editTenderPage.lastNameInput.fill(lastName);
    await editTenderPage.firstNameInput.fill(firstName);
    await editTenderPage.phoneInput.fill(phoneNumber);

    await expect(editTenderPage.lastNameInputErrorMsg).not.toBeVisible();
    await expect(editTenderPage.firstNameInputErrorMsg).not.toBeVisible();
    await expect(editTenderPage.phoneInputErrorMsg).not.toBeVisible();
    await expect(editTenderPage.lastNameInput).toHaveValue(lastName);
    await expect(editTenderPage.firstNameInput).toHaveValue(firstName);
    await expect((await editTenderPage.phoneInput.inputValue()).split(' ').join('')).toContain(phoneNumber);

    await editTenderPage.lastNameInput.clear();
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.lastNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.lastNameInputErrorMsg).toHaveText(testData.errorMessages.requiredField);

    const oneLetter = faker.string.alpha({length: 1});

    await editTenderPage.lastNameInput.fill(oneLetter);
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.lastNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.lastNameInputErrorMsg).toHaveText(testData.errorMessages.lastNameShouldBeAtList2Symbols);

    const random26Char = faker.string.alpha({length: 26});

    await editTenderPage.lastNameInput.fill(random26Char);
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.lastNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.lastNameInputErrorMsg).toHaveText(testData.errorMessages.nameMore25Symbols);

    for(let i = 0; i < testData.restrictedSymbols.length; i++) {
        const restrictedSymbolInEnd = lastName + testData.restrictedSymbols[i];

        await editTenderPage.lastNameInput.clear();
        // await editTenderPage.firstNameInput.clear();
        // await editTenderPage.phoneInput.clear();
        await editTenderPage.lastNameInput.type(restrictedSymbolInEnd);

        await expect(editTenderPage.lastNameInput).toHaveValue(lastName);

        // await editTenderPage.lastNameInput.clear();
        // await editTenderPage.lastNameInput.fill(restrictedSymbolInEnd);
        // await editTenderPage.saveTenderChangesBtn.click();
        // await page.waitForLoadState('domcontentloaded');

        // await expect(editTenderPage.lastNameInput).toHaveValue(lastName);
    }

    await editTenderPage.lastNameInput.clear();
    await editTenderPage.firstNameInput.clear();
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.firstNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.firstNameInputErrorMsg).toHaveText(testData.errorMessages.requiredField);

    await editTenderPage.firstNameInput.fill(oneLetter);
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.firstNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.firstNameInputErrorMsg).toHaveText(testData.errorMessages.firstNameShouldBeAtList2Symbols);

    await editTenderPage.firstNameInput.fill(random26Char);
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.firstNameInputErrorMsg).toBeVisible();
    await expect(editTenderPage.firstNameInputErrorMsg).toHaveText(testData.errorMessages.nameMore25Symbols);

    for(let i = 0; i < testData.restrictedSymbols.length; i++) {
        const restrictedSymbolInEnd = lastName + testData.restrictedSymbols[i];
    
        // await editTenderPage.lastNameInput.clear();
        await editTenderPage.firstNameInput.clear();
        // await editTenderPage.phoneInput.clear();
        await editTenderPage.firstNameInput.type(restrictedSymbolInEnd);

        await expect(editTenderPage.firstNameInput).toHaveValue(lastName);

        // await editTenderPage.firstNameInput.clear();
        // await editTenderPage.firstNameInput.fill(restrictedSymbolInEnd);
        // await editTenderPage.saveTenderChangesBtn.click();
        // await page.waitForLoadState('domcontentloaded');

        // await expect(editTenderPage.firstNameInput).toHaveValue(lastName);
    }

    await editTenderPage.phoneInput.clear();
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.phoneInputErrorMsg).toBeVisible();
    await expect(editTenderPage.phoneInputErrorMsg).toHaveText(testData.errorMessages.requiredField);

    for(let i = 0; i < testData.restrictedSymbols.length; i++) {
        // const phoneWithRestrictedSymbol = testData.incorrectPhoneNumbers.withoutLn.slice(0, -1) + testData.restrictedSymbols[i];
        const phoneWithRestrictedSymbol = '38099123456' + testData.restrictedSymbols[i];

        await editTenderPage.phoneInput.clear()
        await editTenderPage.phoneInput.fill(phoneWithRestrictedSymbol);
        await page.waitForLoadState('networkidle');

        // console.log('phone: ', phoneWithRestrictedSymbol);
        // console.log('input value: ', (await editTenderPage.phoneInput.inputValue()).split(' ').join(''))

        await expect((await editTenderPage.phoneInput.inputValue()).split(' ').join('')).toBe(`+${phoneWithRestrictedSymbol.slice(0, -1)}`);
        await expect(editTenderPage.phoneInputErrorMsg).toBeVisible();
        await expect(editTenderPage.phoneInputErrorMsg).toHaveText(testData.errorMessages.enterCorrectPhoneNumber);
    }

    await editTenderPage.phoneInput.clear();
    await editTenderPage.phoneInput.type(testData.incorrectPhoneNumbers["11Numders"]);
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(editTenderPage.phoneInputErrorMsg).toBeVisible();
    await expect(editTenderPage.phoneInputErrorMsg).toHaveText(testData.errorMessages.enterCorrectPhoneNumber);

    // const phone13digits = testData.incorrectPhoneNumbers["11Numders"] + faker.string.numeric({length: 2});
    const phone13digits = '3809912345678'

    console.log('phone: ', phone13digits);
    console.log('input value: ', (await editTenderPage.phoneInput.inputValue()).split(' ').join(''))

    await editTenderPage.phoneInput.clear();
    await editTenderPage.phoneInput.type(phone13digits);
    await editTenderPage.saveTenderChangesBtn.click();

    await expect((await editTenderPage.phoneInput.inputValue()).split(' ').join('')).toBe(`+${phone13digits.slice(0, -1)}`);

    const description = faker.string.alpha({length: 40});

    await editTenderPage.tenderDescriptionInput.fill(description);
    await apiHelper.addFileToTender(userAccessToken, createdTenderId, createdTenderName);

    await page.waitForTimeout(5000)

    await editTenderPage.saveTenderChangesBtn.click();


    await expect(editTenderPage.tenderSuccessfullyEditedMsg).toBeVisible();
    await expect(editTenderPage.lookInMyTendersBtn).toBeVisible();

    await editTenderPage.lookInMyTendersBtn.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(new RegExp(testData.pagesURLPath["owner-tender"]))

    await apiHelper.deleteTenderById(adminAccessToken, createdTenderId)
})