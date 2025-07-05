export const ROUTES = {
  signin: "/sign-in",
  dashboard: "/",
  sales: "/sales",
  clients: "/clients",
  purchases: "/purchases",
  products: "/products",
  publicPurchases: "/public-purchases",
};

export const PUBLIC_ROUTES = [ROUTES.signin, ROUTES.publicPurchases];

export const isRoutePublic = (route: string, PUBLIC_ROUTES: string[]) => {
  // Loop through public routes and check if the current route matches
  for (const publicRoute of Object.values(PUBLIC_ROUTES)) {
    // Convert the public route to a regular expression
    const regex = new RegExp(
      `^${publicRoute.replace(/\[.*?\]/g, "[^/]+")}(\\?.*)?$`
    );
    if (regex.test(route)) {
      return true;
    }
  }
  return false;
};
