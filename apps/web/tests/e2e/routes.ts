/** Every public route, plus the 404, checked by the M8 audits. */
export const publicRoutes = [
  "/",
  "/projects",
  "/projects/flood-aware",
  "/projects/storyweave",
  "/experience",
  "/leadership",
  "/credentials",
  "/about",
  "/contact",
] as const;

export const notFoundRoute = "/this-page-does-not-exist";
