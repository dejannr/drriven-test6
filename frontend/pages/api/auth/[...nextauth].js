// frontend/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

async function refreshAccessToken(token) {
  try {
    const response = await axios.post("http://localhost:8000/auth/jwt/refresh/", {
      refresh: token.refresh,
    });
    return {
      ...token,
      access: response.data.access,
      // Update the expiration time as needed
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // example: 15 minutes
    };
  } catch (error) {
    console.error("Error refreshing access token", error.response?.data || error.message);
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
          const res = await axios.post("http://localhost:8000/auth/jwt/create/", {
            username: credentials.username,
            password: credentials.password,
          });
          const user = res.data;
          // Expecting a response like { access: "jwt...", refresh: "jwt...", expires_in: 900 }
          if (user && user.access) {
            user.expires_in = user.expires_in || 900;
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
  // Extend session lifespan to 15 days
  session: {
    strategy: "jwt",
    // 15 days in seconds: 15 days * 24 hours * 60 minutes * 60 seconds = 1296000
    maxAge: 1296000,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign in, set the access token and calculate its expiration time
      if (account && user) {
        return {
          access: user.access,
          refresh: user.refresh,
          // Calculate expiry time (convert seconds to ms)
          accessTokenExpires: Date.now() + user.expires_in * 1000,
        };
      }
      // If token is still valid, return it
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      // Otherwise, attempt to refresh the access token
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.access = token.access;
      session.refresh = token.refresh;
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
