import { test, expect } from "../fixtures";
import testData from '../data/test.data.json' assert {type: 'json'};
import { faker } from "@faker-js/faker";
import ApiHelper from "../helpers/api.helper";
import OwnerTendersPage from "../pages/owner.tenders.page";

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let userAccessToken: string;
let adminAccessToken: string;
let createdTender;
let createdTenderId: number;

test.beforeAll(async ({apiHelper}) => {
    userAccessToken = await apiHelper.createUserAccessToken();
    adminAccessToken = await apiHelper.createAdminAccessToken()
})

test.beforeEach('test', async ({apiHelper, homepage}) => {
    await homepage.loginUser(VALID_EMAIL, VALID_PASSWORD);

    createdTender = await apiHelper.createTender(userAccessToken);
    createdTenderId = createdTender.id

    await apiHelper.addFileToTender(userAccessToken, createdTenderId, faker.lorem.word());
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
    await editTenderPage.saveTenderChangesBtn.click();

    await expect(await editTenderPage.tenderNameInput.inputValue()).toBe(random9Char)
    await expect(editTenderPage.tenderNameInputError).toBeVisible();
    await expect(editTenderPage.tenderNameInputError).toHaveText(testData.errorMessages.tenderNameLess10Symbols);

    // const incorrectNames = Object.entries(testData.tenderNamesWithRestrictedSymbols)

    // for (const [symbol, name] of incorrectNames) {
    //     //const forbiddenSymbols = /[<>{};]/

    //     await await editTenderPage.tenderNameInput.type(name);
    //     //await editTenderPage.saveTenderChangesBtn.click();

    //     await expect(await editTenderPage.tenderNameInput.inputValue()).not.toContain(symbol);

    //     await editTenderPage.tenderNameInput.clear()
    //     await await editTenderPage.tenderNameInput.fill(name);
    //     //await editTenderPage.saveTenderChangesBtn.click();

    //     await expect(await editTenderPage.tenderNameInput.inputValue()).not.toContain(symbol);
    // }

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

        await expect(editTenderPage.tenderBudgetInput).toBeVisible();
        await expect(editTenderPage.tenderBudgetInput).toHaveText(testData.errorMessages.requiredField)

        await editTenderPage.tenderBudgetInput.clear()
        await await editTenderPage.tenderBudgetInput.fill(value);
        //await editTenderPage.saveTenderChangesBtn.click();

        await expect(editTenderPage.tenderBudgetInput).toBeVisible();
        await expect(editTenderPage.tenderBudgetInput).toHaveText(testData.errorMessages.requiredField)
    }

    const random10NumStr = faker.string.numeric({length: 10});

    await editTenderPage.tenderBudgetInput.type(random10NumStr);

    await expect((await editTenderPage.tenderBudgetInput.inputValue()).length).toBe(9);

    await editTenderPage.tenderBudgetInput.clear();
    await editTenderPage.tenderBudgetInput.fill(random10NumStr);

    await expect((await editTenderPage.tenderBudgetInput.inputValue()).length).toBe(9);

    await editTenderPage.tenderDescriptionInput.clear();

    const random39Char = faker.string.alpha({length: 39});

    await editTenderPage.tenderDescriptionInput.fill(random39Char);

    await expect(editTenderPage.tenderDescriptionInputError).toBeVisible();
    await expect(editTenderPage.tenderDescriptionInputError).toHaveText(testData.errorMessages.tenderDescriptionLess40Symbols);

    for(let i = 0; i < testData.restrictedSymbols.length; i++) {
        const restrictedSymbolInEnd = random39Char + testData.restrictedSymbols[i];
    
        await editTenderPage.tenderDescriptionInput.fill(restrictedSymbolInEnd);

        await expect(editTenderPage.tenderDescriptionInputError).toBeVisible();
        await expect(editTenderPage.tenderDescriptionInputError).toHaveText(testData.errorMessages.tenderDescriptionLess40Symbols)
    }

    await apiHelper.deleteTenderById(adminAccessToken, createdTenderId)
})