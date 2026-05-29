import { Locator, Page } from "@playwright/test";
import { AgreementConfirmModal } from "../modals/agreement-confirm-modal";

export class NavigationBar {

    private page: Page;

    private orderYourRobotLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.orderYourRobotLink = this.page.getByRole('link', { name: 'Order your robot' });
    }

    async clickOrderYourRobot() {
        await this.orderYourRobotLink.click();
        const modal: AgreementConfirmModal = new AgreementConfirmModal(this.page);
        const isModalVisible = await modal.isModalPopup(5);
        if (isModalVisible) {
            await modal.clickOk();
        }
    }
}