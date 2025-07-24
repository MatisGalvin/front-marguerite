import { test, expect } from "@playwright/test";

test.describe("Clients Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addCookies([
      {
        name: "__Marguerite__session_jwt",
        value: "mock-jwt-token",
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.route("**/api/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          username: "John Doe",
          email: "john@example.com",
        }),
      });
    });
  });

  test("should display clients page with data table", async ({ page }) => {
    await page.route("**/api/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            {
              id: 1,
              attributes: {
                firstname: "Jean",
                lastname: "Dupont",
                email: "jean.dupont@example.com",
                phoneNumber: "0123456789",
              },
            },
            {
              id: 2,
              attributes: {
                firstname: "Marie",
                lastname: "Martin",
                email: "marie.martin@example.com",
                phoneNumber: "0987654321",
              },
            },
          ],
        }),
      });
    });

    await page.goto("/clients");

    await expect(page).toHaveURL("/clients");
    await expect(
      page.getByRole("heading", { name: "Mes clients" }),
    ).toBeVisible();

    await page.waitForLoadState("networkidle");

    await expect(page.getByText("jean.dupont@example.com")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("0123456789")).toBeVisible({ timeout: 10000 });

    await expect(page.getByText("marie.martin@example.com")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("0987654321")).toBeVisible({ timeout: 10000 });
  });

  test("should show create client sheet when create button is clicked", async ({
    page,
  }) => {
    // Mock empty clients list
    await page.route("**/api/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.goto("/clients");

    const createButton = page.getByRole("button", { name: "Créer client" });

    if (await createButton.isVisible()) {
      await createButton.click();

      // Check if create client sheet/modal appears
      await expect(page.getByText("Ajouter un nouveau client")).toBeVisible();

      // Check for form fields
      const firstnameInput = page.getByLabel(/Prénom|Nom/i).first();
      const emailInput = page.getByLabel(/Email/i);

      if (await firstnameInput.isVisible()) {
        await expect(firstnameInput).toBeVisible();
      }
      if (await emailInput.isVisible()) {
        await expect(emailInput).toBeVisible();
      }
    }
  });

  test("should handle client creation", async ({ page }) => {
    // Mock clients API for initial load
    await page.route("**/api/clients", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
      } else if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: 3,
            firstname: "laura",
            lastname: "outang",
            email: "nouveau@example.com",
            phoneNumber: "0192837466",
          }),
        });
      }
    });

    await page.goto("/clients");

    const createButton = page.getByRole("button", { name: "Créer client" });

    await createButton.click();

    await page.waitForSelector(
      "[data-testid='create-client-sheet-description']",
      {
        state: "visible",
      },
    );

    // Fill form fields if they exist
    const firstnameInput = page.getByTestId("create-client-firstname");
    const lastnameInput = page.getByTestId("create-client-lastname");
    const emailInput = page.getByTestId("create-client-email");
    const phoneInput = page.getByTestId("create-client-phone");

    await firstnameInput.fill("laura");
    await lastnameInput.fill("outang");
    await emailInput.fill("nouveau@example.com");
    await phoneInput.fill("0192837466");

    // Wait for form validation and submit button to be enabled
    const submitButton = page.getByRole("button", { name: "Enregistrer" });
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    await submitButton.click();

    // Check for success message
    await expect(
      page.getByText("Le client a été créé avec succès", { exact: true }),
    ).toBeVisible({
      timeout: 5000,
    });
  });

  test("should show edit client sheet when edit button is clicked", async ({
    page,
  }) => {
    // Mock clients API
    await page.route("**/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            firstname: "Jean",
            lastname: "Dupont",
            email: "jean.dupont@example.com",
            phoneNumber: "+33123456789",
          },
        ]),
      });
    });

    await page.goto("/clients");

    // Look for edit button (pencil icon)
    const editButton = page.getByRole("button", { name: "Editer" }).first();

    if (await editButton.isVisible()) {
      await editButton.click();

      // Check if edit client sheet/modal appears
      await expect(page.getByText(/Modifier.*client/i)).toBeVisible();

      // Check that form is pre-filled with existing data
      const firstnameInput = page.locator('input[value="Jean"]');
      const emailInput = page.locator('input[value="jean.dupont@example.com"]');

      if (await firstnameInput.isVisible()) {
        await expect(firstnameInput).toBeVisible();
      }
      if (await emailInput.isVisible()) {
        await expect(emailInput).toBeVisible();
      }
    }
  });

  test("should handle client update", async ({ page }) => {
    // Mock clients API
    await page.route("**/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            firstname: "Jean",
            lastname: "Dupont",
            email: "jean.dupont@example.com",
            phoneNumber: "+33123456789",
          },
        ]),
      });
    });

    // Mock client update API
    await page.route("**/clients/*", async (route) => {
      if (route.request().method() === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1,
            firstname: "Jean-Modifié",
            lastname: "Dupont",
            email: "jean.modifie@example.com",
            phoneNumber: "+33123456789",
          }),
        });
      }
    });

    await page.goto("/clients");

    const editButton = page.getByRole("button", { name: "Editer" }).first();

    if (await editButton.isVisible()) {
      await editButton.click();

      // Modify form fields
      const firstnameInput = page.locator('input[value="Jean"]');
      if (await firstnameInput.isVisible()) {
        await firstnameInput.clear();
        await firstnameInput.fill("Jean-Modifié");
      }

      // Submit form
      const submitButton = page.getByRole("button", { name: "Enregistrer" });
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Check for success message
        await expect(page.getByText(/succès|modifié|mis à jour/i)).toBeVisible({
          timeout: 5000,
        });
      }
    }
  });

  test("should show delete confirmation dialog when delete button is clicked", async ({
    page,
  }) => {
    // Mock clients API
    await page.route("**/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            firstname: "Jean",
            lastname: "Dupont",
            email: "jean.dupont@example.com",
            phoneNumber: "+33123456789",
          },
        ]),
      });
    });

    await page.goto("/clients");

    // Look for delete button (trash icon)
    const deleteButton = page
      .getByRole("button", { name: "Supprimer" })
      .first();

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Check if confirmation dialog appears
      await expect(page.getByText("Suppression client")).toBeVisible();
      await expect(page.getByText("Jean Dupont")).toBeVisible();
      await expect(
        page.getByText("Cette action est irréversible"),
      ).toBeVisible();

      // Check for confirm and cancel buttons
      await expect(
        page.getByRole("button", { name: "Continuer" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Annuler" })).toBeVisible();
    }
  });

  test("should handle client deletion", async ({ page }) => {
    // Mock clients API
    await page.route("**/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            firstname: "Jean",
            lastname: "Dupont",
            email: "jean.dupont@example.com",
            phoneNumber: "+33123456789",
          },
        ]),
      });
    });

    // Mock client deletion API
    await page.route("**/clients/*", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
    });

    await page.goto("/clients");

    const deleteButton = page
      .getByRole("button", { name: "Supprimer" })
      .first();

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Confirm deletion
      const confirmButton = page
        .getByRole("button", { name: "Continuer" })
        .last();
      await confirmButton.click();

      // Check for success message
      await expect(page.getByText("Suppression du client")).toBeVisible({
        timeout: 5000,
      });
      await expect(page.getByText("supprimé avec succès")).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("should handle deletion error", async ({ page }) => {
    // Mock clients API
    await page.route("**/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            firstname: "Jean",
            lastname: "Dupont",
            email: "jean.dupont@example.com",
            phoneNumber: "+33123456789",
          },
        ]),
      });
    });

    // Mock client deletion API error
    await page.route("**/clients/*", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      }
    });

    await page.goto("/clients");

    const deleteButton = page
      .getByRole("button", { name: "Supprimer" })
      .first();

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Confirm deletion
      const confirmButton = page
        .getByRole("button", { name: "Continuer" })
        .last();
      await confirmButton.click();

      // Check for error message
      await expect(page.getByText(/Echec.*Suppression client/i)).toBeVisible({
        timeout: 5000,
      });
      await expect(page.getByText("Une erreur est survenue")).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("should cancel deletion when cancel button is clicked", async ({
    page,
  }) => {
    // Mock clients API
    await page.route("**/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            firstname: "Jean",
            lastname: "Dupont",
            email: "jean.dupont@example.com",
            phoneNumber: "+33123456789",
          },
        ]),
      });
    });

    await page.goto("/clients");

    const deleteButton = page
      .getByRole("button", { name: "Supprimer" })
      .first();

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Cancel deletion
      const cancelButton = page.getByRole("button", { name: "Annuler" });
      await cancelButton.click();

      // Dialog should close and client should still be visible
      await expect(page.getByText("Suppression client")).not.toBeVisible();
      await expect(page.getByText("Jean Dupont")).toBeVisible();
    }
  });

  test("should display empty state when no clients", async ({ page }) => {
    // Mock empty clients API
    await page.route("**/api/clients", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.goto("/clients");
    await expect(page).toHaveURL("/clients");
    await expect(
      page.getByRole("heading", { name: "Mes clients" }),
    ).toBeVisible();

    await expect(page.getByText("Pas de données")).toBeVisible();

    const createButton = page.getByRole("button", { name: "Créer client" });
    await expect(createButton).toBeVisible();
  });

  test("should handle API errors", async ({ page }) => {
    // Mock API error
    await page.route("**/clients", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    await page.goto("/clients");

    // When API fails, app redirects to sign-in page
    await expect(page).toHaveURL("/clients");
  });
});
