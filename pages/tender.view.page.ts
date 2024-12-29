import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';
import { parseDate } from '../helpers/datetime.helpers';

class TenderViewPage extends Page {

    readonly tenderTitle: Locator;
    readonly tenderBudget: Locator;
    readonly tenderOrganiser: Locator;
    readonly tenderPropositions: Locator;
    readonly tenderWorksDate: Locator;
    readonly tenderLocation: Locator;
    readonly tenderStatusLabel: Locator;
    readonly tenderEditBtn: Locator;
    readonly tenderCloseBtn: Locator;
    readonly tenderProposeBtn: Locator;
    readonly tenderPropositionStatusTitle: Locator;
    readonly tenderPropositionDuration: Locator;
    readonly tenderServiceLabel: Locator;
    readonly tenderDescription: Locator;
    readonly tenderDocumentName: Locator;
    readonly tenderDocumentDate: Locator;
    readonly tenderDocumentViewBtn: Locator;
    readonly tenderDocumentDownloadBtn: Locator;
    readonly tenderDocumentPopup: Locator;
    readonly tenderDocumentPopupCloseBtn: Locator;
    readonly tendersFromAuthorBlock: Locator;

    constructor(page: PlaywrightPage) {
        super(page);

        this.tenderTitle = this.page.locator('div[class*="TenderName_name__"]');
        this.tenderBudget = this.page.locator('span[class*="Additional_budget__"]');
        this.tenderOrganiser = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(0);
        this.tenderPropositions = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(1);
        this.tenderWorksDate = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(2);
        this.tenderLocation = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(3);
        this.tenderStatusLabel = this.page.locator('div[class*="ItemStatus_item_"]');
        this.tenderEditBtn = this.page.locator('button[class*="CurrentTenderButtons_fillBtn_"]');
        this.tenderCloseBtn = this.page.locator('button[class*="CurrentTenderButtons_redBtn_"]');
        this.tenderProposeBtn = this.page.locator('button[class*="ProposeButton_propose_"]');
        this.tenderPropositionStatusTitle = this.page.locator('div[class*="TenderMainInfo_propose_label_"]');
        this.tenderPropositionDuration = this.page.locator('div[class*="TenderMainInfo_proposition_duration_"]');
        this.tenderServiceLabel = this.page.locator('div[class*="CurrentItemServices_service_"]');
        this.tenderDescription = this.page.locator('div[class*="CurrentItemDescription_description__"]');
        this.tenderDocumentName = this.page.locator('div[class*="CurrentTenderDocuments_item_name__"]');
        this.tenderDocumentDate = this.page.locator('div[class*="CurrentTenderDocuments_item_date_"]');
        this.tenderDocumentViewBtn = this.page.locator('div[class*="CurrentTenderDocuments_oko_"]');
        this.tenderDocumentDownloadBtn = this.page.locator('a[class*="CurrentTenderDocuments_download_"]');
        this.tenderDocumentPopup = this.page.locator('div[class*="DocumentsPopup_container_"]');
        this.tenderDocumentPopupCloseBtn = this.page.locator('div[class*="DocumentsPopup_close_"]');
        this.tendersFromAuthorBlock = this.page.locator('div[class*="SelectedTenderPage_allTendersWrapper_"]');
    }

    async splitWorksDateInfo() {
        const fullText = await this.tenderWorksDate.innerText();
        const [labelText, dateRangeText] = fullText.split(': ');

        const [startText, endText] = dateRangeText.split(' - ');
        const startDate = parseDate(startText.trim());
        const endDate = parseDate(endText.trim());

        return { labelText, startDate, endDate }
    }
}

export default TenderViewPage