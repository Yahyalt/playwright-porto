import {test, expect} from "@playwright/test";
import { LoginPage } from "../../pages/login/loginPage";
import { createTestUserData, testUser } from "../../fixtures/testData";
import { AuthAPI } from "../api/auth.api";

test.describe("Home page with no auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-page-no-auth.png", {
      mask: [page.getByTitle("Practice Software Testing - Toolshop")],
    });
  });

  test("Login with page object", async ({ page, request }) => {
    // Generate unique test user
    const testUserData = createTestUserData({
      first_name: "Jane",
      last_name: "Doe",
    });

    // Register the user via API
    const authAPI = new AuthAPI(request);
    const response = await authAPI.register(testUserData);

    // Verify response structure
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("email");
    expect(response.email).toBe(testUserData.email);
    expect(response.firstName).toBe(testUserData.first_name);
    console.log(`User registered: ${response.email}`);

    // Login with generated credentials
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill(testUserData.email);
    await loginPage.passwordInput.fill(testUserData.password);
    await loginPage.loginButton.click();
    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  });
});

