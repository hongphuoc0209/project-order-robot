import test from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { OrderPage } from "../pages/order-page";
import { NavigationBar } from "../pages/components/navigation-bar";
import { ReceiptPage } from "../pages/receipt-page";
import { PathUtils } from "../utils/path-utils";

test('Test Order Functionality', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const orderPage = new OrderPage(page);
    const navigationBar = new NavigationBar(page);
    const receiptPage = new ReceiptPage(page);

    //Step 1: Navigate to site https://robotsparebinindustries.com/
    await page.goto('https://robotsparebinindustries.com/');

    //Step 2: Login with username and password
    await loginPage.login('maria', 'thoushallnotpass');

    //Step 3: Click on the "Order your robot" link in the navigation menu to go to the order page
    await navigationBar.clickOrderYourRobot();

    //Step 4: Order a robot with the following details
    const filePath = PathUtils.getDataPath('orders.csv');
    await orderPage.createOrderList(filePath);

    //Step 4: Verify order confirmation message


    await page.waitForTimeout(5000);
});