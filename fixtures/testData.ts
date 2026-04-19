//generate unique email to avoid conflicts

export function generateUniqueEmail(prefix: string = "testuser"): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}@example.com`;
}

//shared test user data
export const testUser = {
  firstName: "John",
  lastName: "Doe",
  password: "SecureP@ss2024!xyz",
  address: ["123 Test Street", "Test Street 2"],
  city: "Test City",
  state: "CA",
  country: "US",
  postcode: "12345",
  phone: "1234567890",
  dob: "1990-01-01",
};

//create test user data with unique email
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
  hammer: "01KCK671ZYPQQW6Q8YEDWHRZZM",
  pliers: "01KCK671ZAN06V5BVTEYDYTPHN",
  screwdriver: "01KCK6720PJ6T79ZDK843X5J4B",
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