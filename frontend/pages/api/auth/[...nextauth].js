// frontend/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          // Call your Django endpoint that returns JWT tokens
          const res = await axios.post("http://localhost:8000/auth/jwt/create/", {
            username: credentials.username,
            password: credentials.password,
          });

          const user = res.data;
          // Expecting a response like { access: "jwt...", refresh: "jwt..." }
          if (user && user.access) {
            // Return the user object which will be saved in the token
            return user;
          }
          return null;
        } catch (error) {
          console.error("Error in authorize:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  // Use JWT-based sessions (stored as HTTP-only cookies)
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // When the user signs in, store the JWT tokens in the token
    async jwt({ token, user }) {
      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;
      }
      return token;
    },
    // Make the tokens available on the client via session
    async session({ session, token }) {
      session.access = token.access;
      session.refresh = token.refresh;
      return session;
    },
  },
  // Set a secret in production via env var NEXTAUTH_SECRET
  secret: "your-secret-key",
});
