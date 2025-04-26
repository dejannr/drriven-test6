// frontend/pages/login.js
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useNotification } from "../components/NotificationContext";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (result.error) {
      if (result.error === 'CredentialsSignin') {
        showNotification({ type: "error", message: 'Uneli ste pogrešne kredencijale!', duration: 4000 });
      } else {
        showNotification({ type: "error", message: result.error, duration: 4000 });
      }
    } else {
      showNotification({ type: "success", message: "Login successful!", duration: 2000 });
      router.push("/blog");
    }
  };


  return (
    <>
      <h1>Login</h1>
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
