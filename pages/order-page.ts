import { Locator, Page } from "@playwright/test";
import fs from 'fs';
import { ScreenshotUtils } from "../utils/screenshot-utils";
import { ReceiptPage } from "./receipt-page";
import { PathUtils } from "../utils/path-utils";
import { FileUtils } from "../utils/file-utils";

export class OrderPage {

    private page: Page;

    private headSelectbox: Locator;
    private legsInput: Locator;
    private shippingAddressInput: Locator;
    private orderButton: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headSelectbox = page.getByLabel('Head:');
        this.legsInput = page.getByRole('spinbutton', { name: 'Legs:' });
        this.shippingAddressInput = page.getByRole('textbox', { name: 'Shipping address' });
        this.orderButton = page.getByRole('button', { name: 'Order' });
        this.errorMessage = page.locator('text=Extraterrestrial Server Error');
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

    async clickOrder(maxRetry = 3) {
        for (let i = 0; i < maxRetry; i++) {
            await this.orderButton.click();

            if (!(await this.errorMessage.isVisible({ timeout: 3000 }))) {
                console.log('Create order success');
                return;
            }

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

            await ScreenshotUtils.takeScreenshot(
                this.page,
                `order-${order.OrderNo}.png`
            );

            // sleep 2 seconds before create next order
            await this.page.waitForTimeout(2000);

            if(i < ordersData.length - 1) {
                await receiptPage.clickAnotherOrder();
            }
        }
    }

}