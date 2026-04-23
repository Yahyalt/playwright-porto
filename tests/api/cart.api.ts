// tests/api/cart.api.ts
import { APIRequestContext } from "@playwright/test";

export class CartAPI {
  private request: APIRequestContext;
  private baseURL = "https://api.practicesoftwaretesting.com";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Add product to cart via API
   * @param productId - Product ID to add
   * @param quantity - Quantity to add
   * @param token - User access token (optional for guest cart)
   * @returns Cart item details
   */
  async createCart(){
    const response = await this.request.post(`${this.baseURL}/carts`, {
    data: {}
  });
  if (!response.ok()) {
    throw new Error(`Create cart failed: ${response.status()}`);
  }
  return await response.json(); // returns { id: "cart_id" }
  }



  async addToCart(cartId: string, productId: string, quantity: number, token?: string) {



   const headers: { [key: string]: string } = {
    "Content-Type": "application/json"
};
    //   ? {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     }
    //   : { "Content-Type": "application/json" };

 if (token) {
    headers.Authorization = `Bearer ${token}`;
  }


    const response = await this.request.post(`${this.baseURL}/carts/${cartId}`, {
      headers,
      data: {
        product_id: productId,
        quantity,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Add to cart failed: ${response.status()} ${await response.text()}`
      );
    }

    return await response.json();
  }

  /**
   * Get cart contents
   * @param token - User access token (optional for guest cart)
   * @returns Array of cart items
   */
  async getCart(cartId: string, token?: string ) {
    const headers: { [key: string]: string } = {};
    
 if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

    const response = await this.request.get(`${this.baseURL}/carts/${cartId}`, {
      headers,
    });

    if (!response.ok()) {
      throw new Error(
        `Get cart failed: ${response.status()} ${await response.text()}`
      );
    }

    return await response.json();
  }



  /**
   * Delete one item from cart
   * @param token - User access token (optional for guest cart)
   */
  async deleteProductCartItem(cartId: string, productId: string, token?: string) {

    const headers: { [key: string]: string } = {};
      
   if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  
      // const headers = token
      //   ? { Authorization: `Bearer ${token}` }
      //   : {};
  
      const response = await this.request.delete(`${this.baseURL}/carts/${cartId}/product/${productId}`, {
        headers,
      });
  
      if (!response.ok()) {
        throw new Error(
          `Clear cart failed: ${response.status()} ${await response.text()}`
        );
      }
  
      return null;
    }

  /**
   * Clear all items from cart
   * @param token - User access token (optional for guest cart)
   */
  async clearCart(cartId: string, token?: string) {

  const headers: { [key: string]: string } = {};
    
 if (token) {
    headers.Authorization = `Bearer ${token}`;
  }


    const response = await this.request.delete(`${this.baseURL}/carts/${cartId}`, {
      headers,
    });

    if (!response.ok()) {
      throw new Error(
        `Clear cart failed: ${response.status()} ${await response.text()}`
      );
    }

    return null;
  }

  /**
   * Update cart item quantity
   * @param cartItemId - Cart item ID
   * @param quantity - New quantity
   * @param token - User access token
   */
  async updateCartItem(cartItemId: string, quantity: number, token: string) {
    const response = await this.request.put(
      `${this.baseURL}/carts/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          quantity,
        },
      }
    );

    if (!response.ok()) {
      throw new Error(
        `Update cart item failed: ${response.status()} ${await response.text()}`
      );
    }

    return await response.json();
  }
}