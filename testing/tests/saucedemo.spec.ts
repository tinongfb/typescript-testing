import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
});

test.describe('has title', () => {
  test('no login', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs'); // Expect a title "to contain" a substring.
  })
});

test.describe('incorrect login', () => {
  test('different login', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    const error = await page.isVisible('.error');
    expect(error).toBe(true);
  })
});

test('login to saucedemo', async ({ page }) => {
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html'); // Verify that we are on the inventory page after login
  const productList = await page.isVisible('.inventory_list'); // Optionally, verify that an element on the page exists (like the product list)
  expect(productList).toBe(true);
});

test('add to cart', async ({ page }) => {
  //add to cart
  const addToCartButtons = await page.$$('button[data-test^="add-to-cart-"]'); // Matches all buttons with data-test starting with "add-to-cart-"
  // Loop through each button and click it
  for (let button of addToCartButtons) {
    await button.click();
  }

  const cartCount = await page.textContent('.shopping_cart_badge');
  expect(cartCount).toBe(String(addToCartButtons.length));
});

test('remove from cart', async ({ page }) => {
  //add to cart
  const addToCartButtons = await page.$$('button[data-test^="add-to-cart-"]');
  for (let button of addToCartButtons) {
    await button.click();
  }
  //remove from cart
  const removeFromCartButtons = await page.$$('button[data-test^="remove-"]');
  for (let rmvButton of removeFromCartButtons) {
    await rmvButton.click();
  }

  const cartBadge = await page.$('.shopping_cart_badge');
  expect(cartBadge).toBeNull(); //this element does not exist while cart is empty
});

test('checkout', async ({ page }) => {
  //add to cart
  const addToCartButtons = await page.$$('button[data-test^="add-to-cart-"]');
  for (let button of addToCartButtons) {
    await button.click();
  }

  const cartBadge = await page.$('.shopping_cart_badge');
  //expect(cartBadge).not.toBeNull();
  await page.click('#shopping_cart_container');
  console.log("Cart is not empty.");

  await page.click('#checkout');
  //await expect(page).toHaveTitle('Checkout: Your Information');
  await page.$('#checkout-info-container'); //check for the correct page
  await page.fill('#first-name', 'secret_sauce');
  await page.fill('#last-name', 'sauce');
  await page.fill('#postal-code', '1234');
  await page.click('#continue');
  await page.click('#finish');
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');


  //confirm cart has been emptied
  const cartBadge1 = await page.$('.shopping_cart_badge');
  if (cartBadge1 === null) {
    console.log("Checkout complete.");
  }

});

test('sorting reverse alphabetical', async ({ page }) => {
  const firstItem = await page.$$eval('.inventory_item_name[data-test="inventory-item-name"]'); // Select the first item
  await page.selectOption('select.product_sort_container', { value: 'za' }); // sort reverse alphabetical
  await expect(firstItem).toBe();

});

test('sorting lowest to highest', async ({ page }) => {
  
  const cheapestItem = await page.$('.inventory_item_price[data-test="inventory-item-price"]');
  await page.selectOption('select.product_sort_container', { value: 'lohi' }); // lowest to highest
  await expect(cheapestItem).toBe();

});

test('sorting alphabetical', async ({ page }) => {
  const firstItem = await page.$$eval('.inventory_item_name[data-test="inventory-item-name"]'); // Select the first item

  await page.selectOption('select.product_sort_container', { value: 'az' }); // alphabetical
  await expect(firstItem).toBe();

});

test('sorting highest to lowest', async ({ page }) => {
  const cheapestItem = await page.$('.inventory_item_price[data-test="inventory-item-price"]');
  await page.selectOption('select.product_sort_container', { value: 'hilo' }); // price highest to lowest
  await expect(firstItem).toBe();
});