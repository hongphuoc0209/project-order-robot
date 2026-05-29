import { Locator, Page } from "@playwright/test";

export class AgreementConfirmModal {

    private page: Page;

    private popupDialog: Locator;
    private okButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.popupDialog = page.locator('.modal');
        this.okButton = page.locator('.modal button', {
            hasText: 'OK',
        });
    }

    async isModalPopup(timeoutInSec: number): Promise<boolean> { 
        return this.popupDialog.isVisible({ timeout: timeoutInSec * 1000 });
    }

    async clickOk() {
        await this.okButton.click();
    }
}