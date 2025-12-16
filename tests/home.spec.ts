import {test, expect} from "@playwright/test";
import dotenv from 'dotenv';
import { LoginPage } from "../pages/login/loginPage";



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

  
  test("Login with page object", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.emailInput.fill(process.env.EMAIL!);
  await loginPage.passwordInput.fill(process.env.PASSWORD!);
  await loginPage.loginButton.click();
  await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
});




  });

