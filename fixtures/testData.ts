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

