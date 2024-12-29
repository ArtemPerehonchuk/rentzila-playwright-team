import { expect } from "@playwright/test";
import { test } from "../fixtures";
import testData from '../data/test.data.json' assert {type: 'json'};
import { faker } from "@faker-js/faker";
import { getDateRangeFromElement, parseApiDate, parseDate } from "../helpers/datetime.helpers";

let adminAccessToken: string
let userAccessToken: string

const LOGIN = process.env.VALID_EMAIL || ''
const PASSWORD = process.env.VALID_PASSWORD || ''

let tenders: Array<{
    id: number;
    name: string;
    start_price: number;
    start_tender_date: string;
    end_tender_date: string;
    start_propose_date: string;
    end_propose_date: string;
    customer: {
        first_name: string;
        middle_name: string;
        last_name: string;
    }
    description: string
    amount_of_props: number;
    [key: string]: any
}> = [];

test.beforeAll(async ({ apiHelper }) => {
    adminAccessToken = await apiHelper.createAdminAccessToken();
    userAccessToken = await apiHelper.createUserAccessToken();
});

test.describe('Tender View Tests', async () => {
    let tenderPrice: string

    test.beforeEach(async ({ homePage, apiHelper }) => {
        const tenderName = "Tender " + faker.string.alpha({ length: 10 });

        const createdTender = await apiHelper.createTender(userAccessToken, tenderName);

        tenders.push({
            ...createdTender,
            name: tenderName,
            attachment: await apiHelper.uploadTenderAttachment(userAccessToken, createdTender.id, testData.photoFileNames[0]),
        });

        tenderPrice = new Intl.NumberFormat('uk-UA').format(tenders[0].start_price);

        await homePage.loginUser(LOGIN, PASSWORD);
        await homePage.goToMyTenders();
    });

    test.afterEach(async ({ apiHelper }) => {
        await apiHelper.setTenderStatus(userAccessToken, tenders[0].id, 'closed', true);
        await apiHelper.deleteTender(userAccessToken, tenders[0].id);
    });

    test('C232 - View active tender', async ({ apiHelper, ownerUnitsUI, ownerTendersPage }) => {
        await apiHelper.setTenderModerationStatus(adminAccessToken, tenders[0].id, 'approved');

        await expect(ownerUnitsUI.activeTab).toHaveAttribute('aria-selected', 'true');

        await ownerTendersPage.refreshUntilElementVisible(
            ownerTendersPage.getTenderByTitle(tenders[0].name));
        await expect(ownerTendersPage.getTenderByTitle(tenders[0].name)).toBeVisible();

        const tenderWorksDate = await getDateRangeFromElement(ownerTendersPage.getDateOnTender(tenders[0].name));
        expect(tenderWorksDate.startDate).toEqual(parseApiDate(tenders[0].start_tender_date));
        expect(tenderWorksDate.endDate).toEqual(parseApiDate(tenders[0].end_tender_date));

        await expect(ownerTendersPage.getLocationOnTender(tenders[0].name))
            .toContainText(testData.tenders.defaultLocation);

        await expect(ownerTendersPage.getPriceOnTender(tenders[0].name))
            .toContainText(tenderPrice);

        await expect(ownerTendersPage.getPropositionsOpenLabelOnTender(tenders[0].name))
            .toContainText(testData.tenders.propositionsOpenLabel);
        await expect(ownerTendersPage.getActionBtnOnTender(tenders[0].name))
            .toContainText(testData.tenders.editBtn);
        await expect(ownerTendersPage.getCloseBtnOnTender(tenders[0].name))
            .toContainText(testData.tenders.closeBtn);
    });

    test('C232 - View closed tender', async ({ apiHelper, ownerUnitsUI, ownerTendersPage }) => {
        await apiHelper.setTenderStatus(userAccessToken, tenders[0].id, 'closed', true);

        await ownerUnitsUI.closedTab.click();
        await expect(ownerUnitsUI.closedTab).toHaveAttribute('aria-selected', 'true');

        await ownerTendersPage.refreshUntilElementVisible(
            ownerTendersPage.getTenderByTitle(tenders[0].name), async () => {
                await ownerUnitsUI.closedTab.click();
            });
        await expect(ownerTendersPage.getTenderByTitle(tenders[0].name)).toBeVisible();

        const tenderWorksDate = await getDateRangeFromElement(ownerTendersPage.getDateOnTender(tenders[0].name));
        expect(tenderWorksDate.startDate).toEqual(parseApiDate(tenders[0].start_tender_date));
        expect(tenderWorksDate.endDate).toEqual(parseApiDate(tenders[0].end_tender_date));

        await expect(ownerTendersPage.getLocationOnTender(tenders[0].name))
            .toContainText(testData.tenders.defaultLocation);

        await expect(ownerTendersPage.getPriceOnTender(tenders[0].name))
            .toContainText(tenderPrice);

        await expect(ownerTendersPage.getCloseBtnOnTender(tenders[0].name))
            .toContainText(testData.tenders.deleteBtn);
    });

    test('C232 - View rejected tender', async ({ apiHelper, ownerUnitsUI, ownerTendersPage }) => {
        await apiHelper.setTenderModerationStatus(adminAccessToken, tenders[0].id, 'declined');

        await ownerUnitsUI.rejectedTab.click();
        await expect(ownerUnitsUI.rejectedTab).toHaveAttribute('aria-selected', 'true');

        await ownerTendersPage.refreshUntilElementVisible(
            ownerTendersPage.getTenderByTitle(tenders[0].name), async () => {
                await ownerUnitsUI.rejectedTab.click();
            });
        await expect(ownerTendersPage.getTenderByTitle(tenders[0].name)).toBeVisible();

        const tenderWorksDate = await getDateRangeFromElement(ownerTendersPage.getDateOnTender(tenders[0].name));
        expect(tenderWorksDate.startDate).toEqual(parseApiDate(tenders[0].start_tender_date));
        expect(tenderWorksDate.endDate).toEqual(parseApiDate(tenders[0].end_tender_date));

        await expect(ownerTendersPage.getLocationOnTender(tenders[0].name))
            .toContainText(testData.tenders.defaultLocation);

        await expect(ownerTendersPage.getPriceOnTender(tenders[0].name))
            .toContainText(tenderPrice);

        await expect(ownerTendersPage.getActionBtnOnTender(tenders[0].name))
            .toContainText(testData.tenders.editBtn);
        await expect(ownerTendersPage.getCloseBtnOnTender(tenders[0].name))
            .toContainText(testData.tenders.closeBtn);
    });

    test('C232 - View pending tender', async ({ ownerUnitsUI, ownerTendersPage }) => {

        await ownerUnitsUI.pendingTab.click();
        await expect(ownerUnitsUI.pendingTab).toHaveAttribute('aria-selected', 'true');

        await ownerTendersPage.refreshUntilElementVisible(
            ownerTendersPage.getTenderByTitle(tenders[0].name), async () => {
                await ownerUnitsUI.pendingTab.click();
            });
        await expect(ownerTendersPage.getTenderByTitle(tenders[0].name)).toBeVisible();

        const tenderWorksDate = await getDateRangeFromElement(ownerTendersPage.getDateOnTender(tenders[0].name));
        expect(tenderWorksDate.startDate).toEqual(parseApiDate(tenders[0].start_tender_date));
        expect(tenderWorksDate.endDate).toEqual(parseApiDate(tenders[0].end_tender_date));

        await expect(ownerTendersPage.getLocationOnTender(tenders[0].name))
            .toContainText(testData.tenders.defaultLocation);
        ;
        await expect(ownerTendersPage.getPriceOnTender(tenders[0].name))
            .toContainText(tenderPrice);

        await expect(ownerTendersPage.getActionBtnOnTender(tenders[0].name))
            .toContainText(testData.tenders.editBtn);
        await expect(ownerTendersPage.getCloseBtnOnTender(tenders[0].name))
            .toContainText(testData.tenders.closeBtn);
    });

    test('C236 - View the tender detail page', async ({ homePage, apiHelper, ownerTendersPage, tenderViewPage }) => {
        await apiHelper.setTenderModerationStatus(adminAccessToken, tenders[0].id, 'approved');

        await ownerTendersPage.refreshUntilElementVisible(
            ownerTendersPage.getTenderByTitle(tenders[0].name));
        await homePage.closePopUpBtn.click();


        await ownerTendersPage.getTenderByTitle(tenders[0].name).click();

        await expect(tenderViewPage.tenderTitle).toHaveText(tenders[0].name);
        await expect(tenderViewPage.tenderStatusLabel).toHaveText(testData.tenders.stateLabel.active);
        await expect(tenderViewPage.tenderEditBtn).toHaveText(testData.tenders.editBtn);
        await expect(tenderViewPage.tenderCloseBtn).toHaveText(testData.tenders.closeBtn);
        await expect(tenderViewPage.tenderPropositionStatusTitle).toHaveText(testData.tenders.propositionsOpenLabel);

        const tenderPropositionDate = await getDateRangeFromElement(tenderViewPage.tenderPropositionDuration);
        expect(tenderPropositionDate.startDate).toEqual(parseApiDate(tenders[0].start_propose_date, true));
        expect(tenderPropositionDate.endDate).toEqual(parseApiDate(tenders[0].end_propose_date, true));

        await expect(tenderViewPage.tenderBudget).toHaveText(tenderPrice + " грн");

        const fullName: string = tenders[0].customer.first_name + " " + tenders[0].customer.last_name
        await expect(tenderViewPage.tenderOrganiser).toHaveText(
            testData.tenders.organiserText + fullName + ", ФОП");

        await expect(tenderViewPage.tenderPropositions).toHaveText(
            testData.tenders.propositionsText + tenders[0].amount_of_props.toString());

        const worksDateInfo = await tenderViewPage.splitWorksDateInfo();
        expect(worksDateInfo.labelText).toEqual(testData.tenders.worksDateText);
        expect(worksDateInfo.startDate).toEqual(parseApiDate(tenders[0].start_tender_date));
        expect(worksDateInfo.endDate).toEqual(parseApiDate(tenders[0].end_tender_date));

        await expect(tenderViewPage.tenderLocation).toHaveText(
            testData.tenders.locationText + testData.tenders.defaultLocation);

        await expect(tenderViewPage.tenderServiceLabel).toHaveText(testData.apiRequestData.defaultServiceName);
        await expect(tenderViewPage.tenderDescription).toHaveText(tenders[0].description);

        await expect(tenderViewPage.tenderDocumentName).toHaveText(testData.photoFileNames[0]);

        const currentDate = new Date();
        expect(parseDate(await tenderViewPage.tenderDocumentDate.innerText()))
            .toEqual(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));

        await tenderViewPage.tenderDocumentViewBtn.click();
        await expect(tenderViewPage.tenderDocumentPopup).toBeVisible();
        await tenderViewPage.tenderDocumentPopupCloseBtn.click();

        await tenderViewPage.downloadFile(async () => {
            await tenderViewPage.tenderDocumentDownloadBtn.click();
        }, testData.photoFileNames[0] + ".jpg");

        await expect(tenderViewPage.tendersFromAuthorBlock).toBeVisible();
    });
});

test.describe('Tender Search and Sorting Tests', async () => {
    let totalNumberOfTenders: number

    test.beforeEach(async ({ homePage, apiHelper }) => {
        for (const [serviceID, categoryID] of Object.entries(testData.apiRequestData.serviceCategoryMap)) {
            const tenderName = "Tender " + faker.string.alpha({ length: 10 });

            const createdTender = await apiHelper.createTender(userAccessToken, tenderName, {
                "category": categoryID,
                "services": [parseInt(serviceID)]
            });

            tenders.push({
                ...createdTender,
                name: tenderName,
                attachment: await apiHelper.uploadTenderAttachment(userAccessToken, createdTender.id, testData.photoFileNames[0]),
            });

            await apiHelper.setTenderModerationStatus(adminAccessToken, createdTender.id, 'approved');
        }

        totalNumberOfTenders = Object.entries(testData.apiRequestData.serviceCategoryMap).length;

        await homePage.loginUser(LOGIN, PASSWORD);
        await homePage.goToMyTenders();
    });

    test.afterEach(async ({ apiHelper }) => {
        for (const tender of tenders) {
            await apiHelper.setTenderStatus(userAccessToken, tender.id, 'closed', true);
            await apiHelper.deleteTender(userAccessToken, tender.id);
        }
    });

    test('C241.1 - Searching Tenders', async ({ page, ownerUnitsUI, ownerTendersPage }) => {

        await ownerUnitsUI.searchInput.click();
        await page.keyboard.press('Enter');

        expect(await ownerTendersPage.getTenderCardsLength()).toBe(totalNumberOfTenders);

        const nonExistentTender = faker.string.alpha({ length: 15 });
        await ownerTendersPage.enterValueToInput(ownerUnitsUI.searchInput, nonExistentTender);
        await expect(ownerUnitsUI.blockEmptyTitle).toContainText(`Тендер за назвою "${nonExistentTender}" не знайдені`);
        await expect(ownerUnitsUI.blockEmptyMsg).toContainText(testData.ownerUnitsUI.noResultsFoundMsg);
        await expect(ownerUnitsUI.emptyBlockBtn).toContainText(testData.ownerUnitsUI.resetFiltersBtn);

        await ownerUnitsUI.emptyBlockBtn.click();
        expect(await ownerTendersPage.getTenderCardsLength()).toBe(totalNumberOfTenders);

        const randomLetter = tenders[0].name.charAt(9);
        await ownerTendersPage.enterValueToInput(ownerUnitsUI.searchInput, randomLetter);
        for (const title of await ownerTendersPage.tenderTitle.allInnerTexts()) {
            expect(title.toLowerCase()).toContain(randomLetter.toLowerCase());
        }

        await ownerTendersPage.enterValueToInput(ownerUnitsUI.searchInput, tenders[0].name);
        expect(await ownerTendersPage.getTenderCardsLength()).toBe(1);
        await expect(ownerTendersPage.getTenderByTitle(tenders[0].name)).toBeVisible();

        await ownerUnitsUI.searchInput.clear();
        expect(await ownerTendersPage.getTenderCardsLength()).toBe(totalNumberOfTenders);

        await ownerTendersPage.enterValueToInput(ownerUnitsUI.searchInput, tenders[1].name, 'paste');
        expect(await ownerTendersPage.getTenderCardsLength()).toBe(1);
        await expect(ownerTendersPage.getTenderByTitle(tenders[1].name)).toBeVisible();

        await ownerTendersPage.enterValueToInput(ownerUnitsUI.searchInput, tenders[2].name.toUpperCase());
        expect(await ownerTendersPage.getTenderCardsLength()).toBe(1);
        await expect(ownerTendersPage.getTenderByTitle(tenders[2].name)).toBeVisible();

        await ownerTendersPage.enterValueToInput(ownerUnitsUI.searchInput, tenders[3].name.toLowerCase());
        expect(await ownerTendersPage.getTenderCardsLength()).toBe(1);
        await expect(ownerTendersPage.getTenderByTitle(tenders[3].name)).toBeVisible();
    });

    test('C241.2 - Sorting Tenders by Category', async ({ ownerUnitsUI, ownerTendersPage }) => {
        await expect(ownerUnitsUI.categorySelect).toHaveText(testData.myUnitsFilters.serviceCategory.allCategories);
        expect(await ownerTendersPage.getTenderCardsLength()).toBe(totalNumberOfTenders);

        await ownerUnitsUI.categorySelect.click();
        await ownerUnitsUI.getSelectItemWithText(testData.myUnitsFilters.serviceCategory.building).click();
        expect(await ownerTendersPage.verifyAllTendersDisplayedWithCategory(
            testData.myUnitsFilters.serviceCategory.building)).toBe(true);

        await ownerUnitsUI.categorySelect.click();
        await ownerUnitsUI.getSelectItemWithText(testData.myUnitsFilters.serviceCategory.farming).click();
        expect(await ownerTendersPage.verifyAllTendersDisplayedWithCategory(
            testData.myUnitsFilters.serviceCategory.farming)).toBe(true);

        await ownerUnitsUI.categorySelect.click();
        await ownerUnitsUI.getSelectItemWithText(testData.myUnitsFilters.serviceCategory.user).click();
        expect(await ownerTendersPage.verifyAllTendersDisplayedWithCategory(
            testData.myUnitsFilters.serviceCategory.user)).toBe(true);

        await ownerUnitsUI.categorySelect.click();
        await ownerUnitsUI.getSelectItemWithText(testData.myUnitsFilters.serviceCategory.other).click();
        expect(await ownerTendersPage.verifyAllTendersDisplayedWithCategory(
            testData.myUnitsFilters.serviceCategory.other)).toBe(true);
    });

    test('C241.3 - Sorting Tenders by Title and Creation Date', async ({ ownerUnitsUI, ownerTendersPage }) => {
        await expect(ownerUnitsUI.sortingSelect).toHaveText(testData.myUnitsFilters.sorting.dateTime.toLowerCase());
        expect(await ownerTendersPage.verifyAllTendersSortedAlphabetically()).toBe(false);

        await ownerUnitsUI.sortingSelect.click();
        await ownerUnitsUI.getSelectItemWithText(testData.myUnitsFilters.sorting.alpabetically).click();
        expect(await ownerTendersPage.verifyAllTendersSortedAlphabetically()).toBe(true);
    });
});