// components/Rightpanel.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RightPanel() {
  const { data: session, status } = useSession();
  const { pathname } = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (session && session.access) {
      axios
        .get("http://localhost:8000/users/profile/", {
          headers: {
            Authorization: `Bearer ${session.access}`,
          },
        })
        .then((response) => {
          setProfile(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching profile:",
            error.response?.data || error.message
          );
        });
    }
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in. Please log in.</p>;

  return (
    <aside className="drr-rightpanel">
      <div>
        <h2>Profile Info</h2>
        {profile ? (
          <div>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
          </div>
        ) : (
          <p>Loading profile data...</p>
        )}
      </div>
    </aside>
  );
}
