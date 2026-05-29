import { Locator, Page } from "@playwright/test";
import { AgreementConfirmModal } from "./modals/agreement-confirm-modal";

export class ReceiptPage {

    private page: Page;

    private anotherOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.anotherOrderButton = page.getByRole('button', { name: 'Order another robot' });
    }

    async isReceiptDisplayed(): Promise<boolean> {
        return this.page.getByRole('heading', { name: 'Receipt' }).isVisible();
    }

    async clickAnotherOrder() {
        await this.anotherOrderButton.click();
        const modal: AgreementConfirmModal = new AgreementConfirmModal(this.page);
        const isModalVisible = await modal.isModalPopup(5);
        if (isModalVisible) {
            await modal.clickOk();
        }
    }
}