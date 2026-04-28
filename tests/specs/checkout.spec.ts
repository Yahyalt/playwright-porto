import { test, expect } from "@playwright/test";
import { AuthAPI } from "../api/auth.api";
import { CartAPI } from "../api/cart.api";
import { ProductsAPI } from "../api/products.api";
import { createTestUserData } from "../../fixtures/testData";

test.describe("Checkout Flow - API + UI Integration", () => {
  let userEmail: string;
  let userPassword: string;
  let accessToken: string;
  let cartId: string;
  let products: any[];
  test.beforeEach(async ({ request, page }) => {
    // Create test data via API
    const authAPI = new AuthAPI(request);
    const cartAPI = new CartAPI(request);
    const productsAPI = new ProductsAPI(request);

    // 1. Register new user via API
    const userData = createTestUserData();
    userEmail = userData.email;
    userPassword = userData.password;

    await authAPI.register(userData);
    console.log(`Created user via API: ${userEmail}`);

    // 2. Login to get access token
    const loginResponse = await authAPI.login(userEmail, userPassword);
    accessToken = loginResponse.accessToken;
    console.log("Logged in via API, got access token");

    // 3. Get products and add to cart via API
    const products = await productsAPI.getProducts();

    // 4. Create Cart
    ({ id: cartId } = await cartAPI.createCart());

    // Add first 2 products to cart
    await cartAPI.addToCart(cartId, products[0].id, 2, accessToken);
    console.log(`Added ${products[0].name} (qty: 2) to cart via API`);

    await cartAPI.addToCart(cartId, products[1].id, 1, accessToken);
    console.log(`Added ${products[1].name} (qty: 1) to cart via API`);
    console.log(cartId);

    // 5. Verify cart was created correctly via API
    const cartContents = await cartAPI.getCart(cartId, accessToken);
    expect(cartContents.cart_items.length).toBe(2);
    console.log("Verified cart contains 2 items via API");
  });

  test("should display pre-filled cart and allow checkout @api-ui", async ({
    page,
  }) => {
    // TEST: Now verify via UI
    // 1. User logs in via UI
    await page.goto("/auth/login");
    await page.fill('[data-test="email"]', userEmail);
    await page.fill('[data-test="password"]', userPassword);
    await page.click('[data-test="login-submit"]');

    await expect(page.locator('[data-test="nav-menu"]')).toBeVisible();
    console.log("UI: User logged in successfully");
    //Set sessionStorage for cart and qty
    await page.evaluate(({ cartId, qty }) => {
      sessionStorage.setItem("cart_id", cartId);
      sessionStorage.setItem("cart_quantity", String(qty));
    }, { cartId, qty: 3 });
    await page.reload();

    // 2. User navigates to cart
    await page.click('[data-test="nav-cart"]');
    await page.waitForURL("**/checkout");
    // 4. Verify product details are shown correctly
    await expect(page.locator('[data-test="product-title"]')).toHaveCount(2);
    await expect(page.locator('[data-test="product-quantity"]')).toHaveCount(2);
    console.log("UI: Product details displayed correctly");
  });
});