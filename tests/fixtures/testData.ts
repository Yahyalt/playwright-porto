// tests/fixtures/testData.ts

/**
 * Generate unique email to avoid conflicts
 */
export function generateUniqueEmail(prefix: string = "testuser"): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}@example.com`;
}

/**
 * Shared test user data
 */
export const testUser = {
  firstName: "John",
  lastName: "Doe",
  password: "Test123!@#",
  address: "123 Test Street",
  city: "Test City",
  state: "CA",
  country: "US",
  postcode: "12345",
  phone: "1234567890",
  dob: "1990-01-01",
};

/**
 * Create test user data with unique email
 */
export function createTestUserData(overrides?: Partial<typeof testUser>) {
  return {
    first_name: testUser.firstName,
    last_name: testUser.lastName,
    email: generateUniqueEmail(),
    password: testUser.password,
    address: testUser.address,
    city: testUser.city,
    state: testUser.state,
    country: testUser.country,
    postcode: testUser.postcode,
    phone: testUser.phone,
    dob: testUser.dob,
    ...overrides,
  };
}

/**
 * Known product IDs for testing
 * These are actual products from practicesoftwaretesting.com
 */
export const testProducts = {
  hammer: "01J9Z8EMXNY0VWFKCDNHMQ6QSE", // Example - you'll need to get real IDs
  pliers: "01J9Z8EMXPA8WRW2S6F9Q6K8T1", // Example - you'll need to get real IDs
  screwdriver: "01J9Z8EMXQH0Y9G8RCBZJP7M8W", // Example - you'll need to get real IDs
};

/**
 * Test cart data - products to add during setup
 */
export const testCartItems = [
  {
    name: "Hammer",
    quantity: 2,
  },
  {
    name: "Pliers",
    quantity: 1,
  },
];

/**
 * Expected cart calculations
 */
export function calculateCartTotal(items: Array<{ price: number; quantity: number }>) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}