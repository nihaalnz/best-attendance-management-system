// export { default } from "next-auth/middleware"
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
