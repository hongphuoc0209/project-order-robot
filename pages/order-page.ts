import { Locator, Page } from "@playwright/test";
import fs from 'fs';
import { ScreenshotUtils } from "../utils/screenshot-utils";
import { ReceiptPage } from "./receipt-page";
import { FileUtils } from "../utils/file-utils";
import { getCurrentDateTime } from "../utils/datetime-utils";

export class OrderPage {

    private page: Page;

    private headSelectbox: Locator;
    private legsInput: Locator;
    private shippingAddressInput: Locator;
    private orderButton: Locator;
    private errorMessage: Locator;
    private headRobotImg: Locator;
    private bodyRobotImg: Locator;
    private legsRobotImg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headSelectbox = page.getByLabel('Head:');
        this.legsInput = page.getByRole('spinbutton', { name: 'Legs:' });
        this.shippingAddressInput = page.getByRole('textbox', { name: 'Shipping address' });
        this.orderButton = page.getByRole('button', { name: 'Order' });
        this.errorMessage = page.locator('.alert.alert-danger');
        this.headRobotImg = page.getByAltText('Head');
        this.bodyRobotImg = page.getByAltText('Body');
        this.legsRobotImg = page.getByAltText('Legs');
    }

    async selectHead(headOptionIndex: number) {
        await this.headSelectbox.selectOption({
            index: headOptionIndex
        });
    }

    async selectBody(option: number) {
        await this.page.locator(`input[name="body"][value="${option.toString()}"]`).check();
    }

    async enterLegs(legs: number) {
        await this.legsInput.fill(legs.toString());
    }

    async enterShippingAddress(address: string) {
        await this.shippingAddressInput.fill(address);
    }

    async clickOrder(maxRetry = 10) {
        for (let i = 0; i < maxRetry; i++) {
            await this.orderButton.click();

            if (!(await this.errorMessage.isVisible({ timeout: 3000 }))) {
                console.log('Create order success');
                return;
            }

            // sleep 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log(`Retry create order: ${i + 1}`);
        }

        throw new Error('Create order failed after max retry');
    }

    async createOrder(headOptionIndex: number, bodyOption: number, legs: number, address: string) {
        await this.selectHead(headOptionIndex);
        await this.selectBody(bodyOption);
        await this.enterLegs(legs);
        await this.enterShippingAddress(address);
        await this.clickOrder();
    }

    async createOrderList(file: string) {
        const currentDateTime = getCurrentDateTime();
        const screenshotDir = `screenshots/${currentDateTime}`;
        await fs.promises.mkdir(screenshotDir, { recursive: true });

        const receiptPage = new ReceiptPage(this.page);
        const ordersData = await FileUtils.readCsv(file);
        for (let i = 0; i < ordersData.length; i++) {
            const order = ordersData[i];

            await this.createOrder(
                Number(order.Head),
                order.Body,
                order.Legs,
                order.Address
            );

            await this.waitRobotImageLoad();

            await ScreenshotUtils.takeScreenshot(
                this.page,
                `${screenshotDir}/order-${order.OrderNo}.png`
            );

            // sleep 2 seconds before create next order
            await this.page.waitForTimeout(2000);

            if(i < ordersData.length - 1) {
                await receiptPage.clickAnotherOrder();
            }
        }
    }

    async waitRobotImageLoad(timeoutInSec: number = 10000) {
        await this.headRobotImg.waitFor({ state: 'visible', timeout: timeoutInSec });
        await this.bodyRobotImg.waitFor({ state: 'visible', timeout: timeoutInSec });
        await this.legsRobotImg.waitFor({ state: 'visible', timeout: timeoutInSec });
    }

}