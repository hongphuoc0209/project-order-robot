import { Page } from "@playwright/test";

export class ScreenshotUtils {
  static async takeScreenshot(
    page: Page,
    fileName: string
  ): Promise<void> {

    await page.screenshot({
      path: `${fileName}`,
      fullPage: true,
    });
  }
}