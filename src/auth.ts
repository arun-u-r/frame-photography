import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Frame Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
        const configuredPassword = (process.env.ADMIN_PASSWORD ?? "").trim();

        if (!adminEmail || !configuredPassword) {
          return null;
        }

        const emailMatch = parsed.data.email.trim().toLowerCase() === adminEmail;
        const passwordMatch = parsed.data.password === configuredPassword;

        if (!emailMatch || !passwordMatch) {
          return null;
        }

        return {
          id: "frame-admin",
          email: parsed.data.email,
          name: "FRAME Administrator",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = { ...session.user, ...token.user };
      }
      return session;
    },
  },
});
