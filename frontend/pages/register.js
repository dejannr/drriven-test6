// frontend/pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Notification from "../components/Notification";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_FRONT}/api/register`, {
        username,
        email,
        password,
      });
      setNotification({ type: "success", message: response.data.message, duration: 3000 });

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      const errMap = error.response?.data.error ?? {};
      const errorMsg = Object.values(errMap)[0]  //
      console.error("Registration error:", errorMsg[0]);
      setNotification({
        type: "error",
        message: "Registration failed: " + errorMsg[0],
        duration: 4000,
      });
    }
  };

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}

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
