import { Page as PlaywrightPage, expect } from '@playwright/test';
import Page from './page';

class TendersPage extends Page {  

    constructor(page: PlaywrightPage) {
        super(page);
    }

    searchInput = this.page.getByTestId('search');

    async getSerchInputBgText() {
        const searchInputText = await this.searchInput.getAttribute('placeholder');
        return await searchInputText;
    }

}

export default TendersPage;