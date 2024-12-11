import { Page as PlaywrightPage } from '@playwright/test';
import Page from './page';

class OwnerTendersPage extends Page {

    constructor(page: PlaywrightPage) {
        super(page);
    }

    createTenderBtn = this.page.locator('[data-testid="emptyBlockButton"]');
    tenderCard = this.page.locator('div[class*="OwnerTenderCard_tenderCard_"]');
    tenderCategory = this.page.locator('div[class*="CurrentItemInfo_category_"]');
    tenderTitle = this.page.locator('div[class*="CurrentItemInfo_name_"]');
    tenderPrice = this.page.locator('div[class*="CurrentItemPrice_price_"]');
    tenderDate = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(0);
    tenderLocation = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(1);
    tenderPropositions = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(2);
    tenderActionBtn = this.page.locator('button[class*="CurrentTenderButtons_fillBtn_"]');
    tenderCloseBtn = this.page.locator('button[class*="CurrentTenderButtons_redBtn_"]');
    tenderPropositionsOpenLabel = this.page.locator('div[class*="CurrentTenderStatus_proposes_"]');

    getTenderByTitle(title: string) {
        return this.tenderCard.filter({ has: this.tenderTitle.filter({ hasText: title }) });
    }

    getPriceOnTender(title: string) {
        return this.getTenderByTitle(title).locator(this.tenderPrice);
    }

    getDateOnTender(title: string) {
        return this.getTenderByTitle(title).locator(this.tenderDate);
    }

    getLocationOnTender(title: string) {
        return this.getTenderByTitle(title).locator(this.tenderLocation);
    }

    getActionBtnOnTender(title: string) {
        return this.getTenderByTitle(title).locator(this.tenderActionBtn);
    }

    getCloseBtnOnTender(title: string) {
        return this.getTenderByTitle(title).locator(this.tenderCloseBtn);
    }

    getPropositionsOpenLabelOnTender(title: string) {
        return this.getTenderByTitle(title).locator(this.tenderPropositionsOpenLabel);
    }

    async getCategoryOnTender(index: number) {
        const unitCard = this.tenderCard.nth(index);
        const category = (await unitCard.locator(this.tenderCategory).innerText()).split('/')[0].trim();
        return category
    }

    async getTenderCardsLength() {
        const cards = await this.tenderCard.all();
        const unitCardsLength = cards.length;
        return unitCardsLength;
    }

    async verifyAllTendersDisplayedWithCategory(expectedCategory: string) {
        const tenderCardsCount = await this.getTenderCardsLength();

        if (tenderCardsCount === 0) {
            console.warn(`No tenders found for category ${expectedCategory}`);
        }
        else {
            for (let i = 0; i < tenderCardsCount; i++) {
                const category = await this.getCategoryOnTender(i);
                if (category !== expectedCategory) {
                    console.warn(`Mismatched category: ${category}, expected ${expectedCategory}`);
                    return false;
                }
            }
            return true;
        }
    }

    async verifyAllTendersSortedAlphabetically() {
        const initialTitles = await this.tenderTitle.allInnerTexts();

        const sortedTitles = [...initialTitles].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

        return initialTitles.every((title, index) => title === sortedTitles[index]);
    }
}

export default OwnerTendersPage;