// frontend/pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useNotification } from "../components/NotificationContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_FRONT}/api/register`,
        { username, email, password }
      );
      showNotification({
        type: "success",
        message: response.data.message,
        duration: 3000,
      });

      router.push("/login");
    } catch (error) {
      const errMap = error.response?.data.error ?? {};
      const errorMsg = Object.values(errMap)[0];
      console.error("Registration error:", errorMsg[0]);
      showNotification({
        type: "error",
        message: "Registration failed: " + errorMsg[0],
        duration: 4000,
      });
    }
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Login here</Link>.
      </p>
    </>
  );
}
