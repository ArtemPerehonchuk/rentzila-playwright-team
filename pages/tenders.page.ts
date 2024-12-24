import { Page as PlaywrightPage, Locator } from '@playwright/test';
import Page from './page';

class TendersPage extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
    }

    searchInput: Locator = this.page.getByTestId('search');

    async getSerchInputBgText(): Promise<string | null> {
        const searchInputText = await this.searchInput.getAttribute('placeholder');
        return await searchInputText;
    }

}

export default TendersPage;