import { test, expect } from "@playwright/test";

test.describe("Sign-In Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication
    await page.context().clearCookies();
    await page.goto("/sign-in");
  });

  test("should display sign-in page elements", async ({ page }) => {
    await expect(page).toHaveTitle("Auth");

    // Check main heading and description
    await expect(page.getByText("Bonjour 👋")).toBeVisible();
    await expect(
      page.getByText("Entrez vos identifiants pour vous connecter"),
    ).toBeVisible();

    const emailInput = page
      .locator('input[name="email"]')
      .or(page.getByPlaceholder("name@gmail.com"));
    await expect(emailInput).toBeVisible();

    const passwordInput = page
      .locator('input[name="password"]')
      .or(page.getByPlaceholder("******"));
    await expect(passwordInput).toBeVisible();

    // Check form labels
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Mot de passe")).toBeVisible();

    // Check submit button
    await expect(
      page.getByRole("button", { name: "Se connecter" }),
    ).toBeVisible();

    // Check terms and privacy links
    await expect(
      page.getByRole("link", { name: /Conditions d'utilisation/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Politique de confidentialité/i }),
    ).toBeVisible();
  });

  test("shows errors when form is submitted empty", async ({ page }) => {
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page.getByText("Email invalide")).toBeVisible();
    await expect(page.getByText("Champ requis")).toBeVisible();
  });

  test("should validate invalid email format", async ({ page }) => {
    const emailInput = page
      .locator('input[name="email"]')
      .or(page.getByPlaceholder("name@gmail.com"));
    await emailInput.fill("invalid-email");
    const passwordInput = page
      .locator('input[name="password"]')
      .or(page.getByPlaceholder("******"));
    await passwordInput.fill("password123");

    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page.getByText("Email invalide")).toBeVisible();
  });

  test("should validate required password field", async ({ page }) => {
    const emailInput = page
      .locator('input[name="email"]')
      .or(page.getByPlaceholder("name@gmail.com"));
    await emailInput.fill("test@example.com");

    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page.getByText("Champ requis")).toBeVisible();
  });

  test("can toggle password visibility", async ({ page }) => {
    const passwordInput = page
      .locator('input[name="password"]')
      .or(page.getByPlaceholder("******"));
    const toggleButton = page.getByTestId("toggle-password-visibility");

    await passwordInput.fill("testpassword");

    await expect(passwordInput).toHaveAttribute("type", "password");
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("successfully submits with valid credentials", async ({ page }) => {
    // Mock backend login response
    await page.route("**/api/auth/local", async (route) => {
      const postData = route.request().postData();

      if (postData?.includes("test@example.com")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            jwt: "mock-jwt-token",
            user: {
              id: 1,
              username: "John Doe",
              email: "test@example.com",
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ error: { message: "Invalid credentials" } }),
        });
      }
    });

    // Mock the /me route after login
    await page.route("**/api/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          username: "John Doe",
          email: "test@example.com",
        }),
      });
    });

    const emailInput = page
      .locator('input[name="email"]')
      .or(page.getByPlaceholder("name@gmail.com"));
    const passwordInput = page
      .locator('input[name="password"]')
      .or(page.getByPlaceholder("******"));

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page).toHaveURL("/");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    // Mock failed authentication
    await page.route("**/api/auth/local", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: { message: "Invalid credentials" },
        }),
      });
    });

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await emailInput.fill("wrong@example.com");
    await passwordInput.fill("wrongpassword");

    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(
      page
        .locator(".text-sm.opacity-90")
        .getByText("Email ou mot de passe incorrect"),
    ).toBeVisible({ timeout: 5000 });
  });

  test("should show loading state during submission", async ({ page }) => {
    // Mock slow API response
    await page.route("**/api/auth/local", async (route) => {
      // Add delay to see loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jwt: "mock-jwt-token",
          user: { id: 1, username: "John Doe", email: "test@example.com" },
        }),
      });
    });

    const emailInput = page
      .locator('input[name="email"]')
      .or(page.getByPlaceholder("name@gmail.com"));
    const passwordInput = page
      .locator('input[name="password"]')
      .or(page.getByPlaceholder("******"));

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");

    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page.locator(".animate-spin")).toBeVisible();
  });
});
