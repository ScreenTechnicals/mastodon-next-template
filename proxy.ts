export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/profile", "/dashboard"], // Protect these routes
};
