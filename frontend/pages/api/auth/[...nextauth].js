import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Function to refresh the access token using the refresh token
async function refreshAccessToken(token) {
  try {
    const response = await axios.post("http://localhost:8000/auth/jwt/refresh/", {
      refresh: token.refresh,
    });
    // Assuming your Django endpoint returns a new access token
    return {
      ...token,
      access: response.data.access,
      // Set new expiry time (e.g., 15 minutes from now)
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
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
          const res = await axios.post("http://localhost:8000/auth/jwt/create/", {
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
      // Initial sign in
      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;
        // Set token expiry time (15 minutes from now, adjust if necessary)
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        return token;
      }

      // Return previous token if the access token has not expired yet.
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it.
      return await refreshAccessToken(token);
    },
    // Make the access token available on the client via the session
    async session({ session, token }) {
      session.access = token.access;
      session.error = token.error;
      return session;
    },
  },
  secret: "your-secret-key",
});


// OLD SETTINGS
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import axios from "axios";
//
// export default NextAuth({
//   // Configure one or more authentication providers
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "Your username" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         try {
//           // Call your Django endpoint that returns JWT tokens
//           const res = await axios.post("http://localhost:8000/auth/jwt/create/", {
//             username: credentials.username,
//             password: credentials.password,
//           });
//
//           const user = res.data;
//           // Expecting a response like { access: "jwt...", refresh: "jwt..." }
//           if (user && user.access) {
//             // Return the user object which will be saved in the token
//             return user;
//           }
//           return null;
//         } catch (error) {
//           console.error("Error in authorize:", error.response?.data || error.message);
//           return null;
//         }
//       },
//     }),
//   ],
//   // Use JWT-based sessions (stored as HTTP-only cookies)
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     // When the user signs in, store the JWT tokens in the token
//     async jwt({ token, user }) {
//       if (user) {
//         token.access = user.access;
//         token.refresh = user.refresh;
//       }
//       return token;
//     },
//     // Make the tokens available on the client via session
//     async session({ session, token }) {
//       session.access = token.access;
//       session.refresh = token.refresh;
//       return session;
//     },
//   },
//   // Set a secret in production via env var NEXTAUTH_SECRET
//   secret: "your-secret-key",
// });
