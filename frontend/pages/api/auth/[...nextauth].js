import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Function to refresh the access token using the refresh token
async function refreshAccessToken(token) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bapi/auth/jwt/refresh/`, {
      refresh: token.refresh,
    });
    // Assuming your Django endpoint returns a new access token (and optionally a new refresh token)
    return {
      ...token,
      access: response.data.access,
      // Set new expiry time to 15 days from now
      accessTokenExpires: Date.now() + 15 * 24 * 60 * 60 * 1000,
      // Optionally update the refresh token if provided by your backend
      refresh: response.data.refresh ?? token.refresh,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error.response?.data || error.message);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
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
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bapi/auth/jwt/create/`, {
            username: credentials.username,
            password: credentials.password,
          });
          const user = res.data;
          // Expecting a response like { access: "jwt...", refresh: "jwt..." }
          if (user && user.access) {
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // Initial sign in: set token expiry to 15 days
      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;
        token.accessTokenExpires = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days from now
        return token;
      }

      // If token hasn't expired yet, just return it.
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token has expired; try to refresh it.
      return await refreshAccessToken(token);
    },
    // Make the access token and error available on the client via the session.
    async session({ session, token }) {
      session.access = token.access;
      session.error = token.error;
      return session;
    },
  },
  secret: "your-secret-key",
});
