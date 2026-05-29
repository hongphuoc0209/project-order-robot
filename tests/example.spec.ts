import { test, expect } from '@playwright/test';
import { FileUtils } from '../utils/file-utils';


test('Test Read Csv', async ({ page }) => {
  const data = await FileUtils.readCsv('data/orders.csv');
  // console.log(data);
  console.log(data[0]);
});





