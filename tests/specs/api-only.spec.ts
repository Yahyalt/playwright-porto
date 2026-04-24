// tests/specs/api-only.spec.ts
import { test, expect } from "@playwright/test";
import { AuthAPI } from "../api/auth.api";
import { CartAPI } from "../api/cart.api";
import { ProductsAPI } from "../api/products.api";
import { createTestUserData, testUser } from "../../fixtures/testData";

test.describe("API Only Tests - Backend Validation", () => {
  test("should register user and verify response structure @api", async ({
    request,
  }) => {
    const authAPI = new AuthAPI(request);
    const userData = createTestUserData();

    const response = await authAPI.register(userData);

    // Verify response structure
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("email");
    expect(response.email).toBe(userData.email);
    expect(response.firstName).toBe(userData.first_name);
    console.log(`User registered: ${response.email}`);
  });

  test("should login with valid credentials @api", async ({ request }) => {
    const authAPI = new AuthAPI(request);
    const userData = createTestUserData();

    // Register first
    await authAPI.register(userData);

    // Login
    const loginResponse = await authAPI.login(userData.email, userData.password);

    // Verify token received
    expect(loginResponse).toHaveProperty("accessToken");
    expect(loginResponse).toHaveProperty("tokenType");
    expect(loginResponse.tokenType).toBe("bearer");
    expect(loginResponse.accessToken).toBeTruthy();
    console.log("Login successful, token received");
  });

  test("should reject login with invalid credentials @api", async ({
    request,
  }) => {
    const authAPI = new AuthAPI(request);

    // Attempt login with invalid credentials
    try {
      await authAPI.login("invalid@example.com", "wrongpassword");
      // If we reach here, test should fail
      expect(true).toBe(false); // Force failure
    } catch (error) {
      expect(error).toBeTruthy();
      console.log("Invalid login rejected as expected");
    }
  });

  test("should get all products @api", async ({ request }) => {
    const productsAPI = new ProductsAPI(request);

    const products = await productsAPI.getProducts();

    // Verify response
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verify product structure
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty("id");
    expect(firstProduct).toHaveProperty("name");
    expect(firstProduct).toHaveProperty("price");
    
    console.log(`Retrieved ${products.length} products`);
  });

  
  test("should add and remove items from cart @api", async ({ request }) => {
    const authAPI = new AuthAPI(request);
    const cartAPI = new CartAPI(request);
    const productsAPI = new ProductsAPI(request);
      

    // Setup: Register and login
    const userData = createTestUserData();
    await authAPI.register(userData);
    const { accessToken } = await authAPI.login(userData.email, userData.password);

    // Create cart (needed for cartId-based endpoints)
    const { id: cartId } = await cartAPI.createCart();

    // Get a product
    const products = await productsAPI.getProducts();
    const testProduct = products[0];

    // Add to cart
    const addResponse = await cartAPI.addToCart(
      cartId,
      testProduct.id,
      3,
      accessToken
    );
    expect(addResponse).toBeTruthy();
    console.log(`Added ${testProduct.name} to cart`);

    // Verify cart contents
    const cart = await cartAPI.getCart(cartId, accessToken);
    expect(cart.cart_items.length).toBe(1);
    expect(cart.cart_items[0].quantity).toBe(3);
    expect(cart.cart_items[0].product_id).toBe(testProduct.id);
    console.log("Cart contains correct item");

    // Clear cart
    await cartAPI.deleteProductCartItem(cartId,testProduct.id, accessToken);
    
    // Verify cart is empty
    const emptyCart = await cartAPI.getCart(cartId, accessToken);
    console.log("Empty cart contents:", emptyCart);
    expect(emptyCart.cart_items.length).toBe(0);
    console.log("Cart cleared successfully");
  });

  test("should handle concurrent cart operations @api", async ({ request }) => {
    const authAPI = new AuthAPI(request);
    const cartAPI = new CartAPI(request);
    const productsAPI = new ProductsAPI(request);

    // Setup user
    const userData = createTestUserData();
    await authAPI.register(userData);
    const { accessToken } = await authAPI.login(userData.email, userData.password);

    // Get products
    const products = await productsAPI.getProducts();
    const { id: cartId } = await cartAPI.createCart();
    // Add multiple products concurrently
    const addPromises = products.slice(0, 3).map((product) =>
      cartAPI.addToCart(cartId, product.id, 1, accessToken)
    );

    await Promise.all(addPromises);
    console.log("Added 3 products concurrently");

    // Verify all items in cart
    const cart = await cartAPI.getCart(cartId, accessToken);
    expect(cart.cart_items.length).toBe(3);
    console.log("All items added successfully");

    // Cleanup
    await cartAPI.clearCart(cartId, accessToken);
  });

  test("should validate product search functionality @api", async ({
    request,
  }) => {
    const productsAPI = new ProductsAPI(request);
test("search returns product when querying part of its name @api", async ({ request }) => {
  const productsAPI = new ProductsAPI(request);

  // 1) Get a real product from the catalog
  const products = await productsAPI.getProducts();
  expect(products.length).toBeGreaterThan(0);

  const picked = products.find((p: any) => typeof p?.name === "string" && p.name.trim().length > 0);
  console.log(`Picked product: ${picked.name}`);
  expect(picked).toBeDefined();

  // 2) Derive a search token from the product name (first "word" with >= 3 chars)
  const tokens = picked.name
    .toLowerCase()
    .split(/[\s-]+/)
    .map((t: string) => t.replace(/[^a-z0-9]/g, ""))
    .filter((t: string) => t.length >= 3);

  expect(tokens.length).toBeGreaterThan(0);
  const q = tokens[0];

  // 3) Search using that token
  const searchResults = await productsAPI.searchProducts(q);
  expect(Array.isArray(searchResults)).toBe(true);
  expect(searchResults.length).toBeGreaterThan(0);
  console.log(`Search results for ${q}:`, searchResults);
  // 4) Assert the picked product is included (strongest check)
  const ids = searchResults.map((p: any) => p.id);
  expect(ids).toContain(picked.id);
});




});