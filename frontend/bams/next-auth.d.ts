import { DefaultSession, DefaultUser, ISODateString } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      email: string | null;
      role: string | null;
      token: string | null;
    } & DefaultSession;
  }
  interface User extends DefaultUser {
    role: string | null;
    token: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    email: string | null;
    role: string | null;
    token: string | null;
    expires: ISODateString;
  }
}
