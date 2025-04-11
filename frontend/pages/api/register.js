// frontend/pages/api/register.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    try {
      // Call Django's registration endpoint (Djoser's /auth/users/)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bapi/auth/users/`, {
        username,
        email,
        password,
      });

      // If registration is successful, return a success message
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        error: error.response?.data || "Registration failed",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
