// tests/api/auth.api.ts
import { APIRequestContext } from "@playwright/test";

export class AuthAPI {
  private request: APIRequestContext;
  private baseURL = "https://api.practicesoftwaretesting.com";

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Register a new user via API
   * @param userData - User registration data
   * @returns User ID and access token
   */
  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    address?: string[];
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    phone?: string;
    dob?: string;
  }) {
    const response = await this.request.post(`${this.baseURL}/users/register`, {
      data: userData,
    });

    if (!response.ok()) {
      throw new Error(
        `Registration failed: ${response.status()} ${await response.text()}`
      );
    }

    const body = await response.json();
    return {
      id: body.id,
      email: body.email,
      firstName: body.first_name,
      lastName: body.last_name,
    };
  }

  /**
   * Login user and get access token
   * @param email - User email
   * @param password - User password
   * @returns Access token and user info
   */
  async login(email: string, password: string) {
    const response = await this.request.post(`${this.baseURL}/users/login`, {
      data: {
        email,
        password,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()} ${await response.text()}`
      );
    }

    const body = await response.json();
    return {
      accessToken: body.access_token,
      tokenType: body.token_type,
    };
  }

  /**
   * Get authorization headers for authenticated requests
   * @param token - Access token from login
   * @returns Headers object with authorization
   */
  getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
}