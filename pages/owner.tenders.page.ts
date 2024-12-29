import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class OwnerTendersPage extends Page {

    readonly createTenderBtn: Locator;
    readonly tenderCard: Locator;
    readonly tenderCategory: Locator;
    readonly tenderTitle: Locator;
    readonly tenderPrice: Locator;
    readonly tenderDate: Locator;
    readonly tenderLocation: Locator;
    readonly tenderPropositions: Locator;
    readonly tenderActionBtn: Locator;
    readonly tenderCloseBtn: Locator;
    readonly tenderPropositionsOpenLabel: Locator;

    constructor(page: PlaywrightPage) {
        super(page);

        this.createTenderBtn = this.page.locator('[data-testid="emptyBlockButton"]');
        this.tenderCard = this.page.locator('div[class*="OwnerTenderCard_tenderCard_"]');
        this.tenderCategory = this.page.locator('div[class*="CurrentItemInfo_category_"]');
        this.tenderTitle = this.page.locator('div[class*="CurrentItemInfo_name_"]');
        this.tenderPrice = this.page.locator('div[class*="CurrentItemPrice_price_"]');
        this.tenderDate = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(0);
        this.tenderLocation = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(1);
        this.tenderPropositions = this.page.locator('div[class*="ParagraphWithIcon_paragraph_"]').nth(2);
        this.tenderActionBtn = this.page.locator('button[class*="CurrentTenderButtons_fillBtn_"]');
        this.tenderCloseBtn = this.page.locator('button[class*="CurrentTenderButtons_redBtn_"]');
        this.tenderPropositionsOpenLabel = this.page.locator('div[class*="CurrentTenderStatus_proposes_"]');
    }

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