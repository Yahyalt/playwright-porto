import { APIRequestContext } from "@playwright/test";

export class ProductsAPI {
  private request: APIRequestContext;
  private baseURL = "https://api.practicesoftwaretesting.com";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Get all products
   * @returns Array of products
   */
  async getProducts() {
    const response = await this.request.get(`${this.baseURL}/products`);

    if (!response.ok()) {
      throw new Error(
        `Get products failed: ${response.status()} ${await response.text()}`
      );
    }

    const body = await response.json();
    return body.data; // API returns { data: [...products] }
  }

  /**
   * Get product by ID
   * @param productId - Product ID
   * @returns Product details
   */
  async getProductById(productId: string) {
    const response = await this.request.get(
      `${this.baseURL}/products/${productId}`
    );

    if (!response.ok()) {
      throw new Error(
        `Get product failed: ${response.status()} ${await response.text()}`
      );
    }

    return await response.json();
  }

  /**
   * Search products by name
   * @param searchTerm - Search term
   * @returns Array of matching products
   */
  async searchProducts(searchTerm: string) {
    const response = await this.request.get(
      `${this.baseURL}/products/search?q=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok()) {
      throw new Error(
        `Search products failed: ${response.status()} ${await response.text()}`
      );
    }

    const body = await response.json();
    return body.data;
  }

  /**
   * Get products by category
   * @param categoryId - Category ID
   * @returns Array of products in category
   */
  async getProductsByCategory(categoryId: string) {
    const response = await this.request.get(
      `${this.baseURL}/products?by_category=${categoryId}`
    );

    if (!response.ok()) {
      throw new Error(
        `Get products by category failed: ${response.status()} ${await response.text()}`
      );
    }

    const body = await response.json();
    return body.data;
  }
}