import { Page as PlaywrightPage } from '@playwright/test';
import Page from './page';
import { parseDate } from '../helpers/datetime.helpers';

class TenderViewPage extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
    }

    tenderTitle = this.page.locator('div[class*="TenderName_name__"]');
    tenderBudget = this.page.locator('span[class*="Additional_budget__"]');
    tenderOrganiser = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(0);
    tenderPropositions = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(1);
    tenderWorksDate = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(2);
    tenderLocation = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(3);
    tenderStatusLabel = this.page.locator('div[class*="ItemStatus_item_"]');
    tenderEditBtn = this.page.locator('button[class*="CurrentTenderButtons_fillBtn_"]');
    tenderCloseBtn = this.page.locator('button[class*="CurrentTenderButtons_redBtn_"]');
    tenderProposeBtn = this.page.locator('button[class*="ProposeButton_propose_"]');
    tenderPropositionStatusTitle = this.page.locator('div[class*="TenderMainInfo_propose_label_"]');
    tenderPropositionDuration = this.page.locator('div[class*="TenderMainInfo_proposition_duration_"]');
    tenderServiceLabel = this.page.locator('div[class*="CurrentItemServices_service_"]');
    tenderDescription = this.page.locator('div[class*="CurrentItemDescription_description__"]');
    tenderDocumentName = this.page.locator('div[class*="CurrentTenderDocuments_item_name__"]');
    tenderDocumentDate = this.page.locator('div[class*="CurrentTenderDocuments_item_date_"]');
    tenderDocumentViewBtn = this.page.locator('div[class*="CurrentTenderDocuments_oko_"]');
    tenderDocumentDownloadBtn = this.page.locator('a[class*="CurrentTenderDocuments_download_"]');
    tenderDocumentPopup = this.page.locator('div[class*="DocumentsPopup_container_"]');
    tenderDocumentPopupCloseBtn = this.page.locator('div[class*="DocumentsPopup_close_"]');
    tendersFromAuthorBlock = this.page.locator('div[class*="SelectedTenderPage_allTendersWrapper_"]');

    async splitWorksDateInfo () {
        const fullText = await this.tenderWorksDate.innerText();
        const [labelText, dateRangeText] = fullText.split(': ');

        const [startText, endText] = dateRangeText.split(' - ');
        const startDate = parseDate(startText.trim());
        const endDate = parseDate(endText.trim());

        return {labelText, startDate, endDate}
    }
}

export default TenderViewPage