// frontend/pages/profile.js
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (session && session.access) {
      axios
        .get("http://localhost:8000/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${session.access}`,
          },
        })
        .then((response) => {
          setProfile(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error.response?.data || error.message);
        });
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in. Please log in.</p>;

  return (
    <>
      <h1>Profile</h1>
      {profile ? (
        <div>
          <p>ID: {profile.id}</p>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
        </div>
      ) : (
        <p>Loading profile data...</p>
      )}
    <button onClick={() => signOut({callbackUrl: '/login'})}>Sign out</button>
    </>
  );
}
