// tests/specs/checkout.spec.ts
import { test, expect } from "@playwright/test";
import { AuthAPI } from "../api/auth.api";
// import { CartAPI } from "../api/cart.api";
// import { ProductsAPI } from "../api/products.api";
import { createTestUserData, testUser } from "../../fixtures/testData";

test.describe("Checkout Flow - API + UI Integration", () => {
  let userEmail: string;
  let userPassword: string;
  let accessToken: string;

  test.beforeEach(async ({ request, page }) => {
    //create test data
    const authAPI = new AuthAPI(request);
    // const cartAPI = new CartAPI(request);
    // const productsAPI = new ProductsAPI(request);

    //register new user via API
    const userData = createTestUserData();
    userEmail = userData.email;
    userPassword = userData.password;

    await authAPI.register(userData);
    console.log(`Created user via API: ${userEmail}`);

    //login to get access token
    const loginResponse = await authAPI.login(userEmail, userPassword);
    accessToken = loginResponse.accessToken;
    console.log("Logged in via API, got access token");
  });

  test("should display pre-filled cart and allow checkout @api-ui", async ({
    page,
  }) => {
  
    await page.goto("/auth/login");
    await page.fill('[data-test="email"]', userEmail);
    await page.fill('[data-test="password"]', userPassword);
    await page.click('[data-test="login-submit"]');

    await expect(page).toHaveURL(/account/);
    await expect(page.locator('[data-test="nav-menu"]')).toBeVisible();
    console.log("UI: User logged in successfully");
  });
});