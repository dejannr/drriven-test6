// components/Rightpanel.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function RightPanel({ profile, profileLoading }) {
  const { data: session, status } = useSession();
  const { pathname } = useRouter();

  // While session is loading
  if (status === "loading") {
    return (
        <aside class="drr-rightpanel">
          <p>Loading...</p>
        </aside>
    );
  }

  // If there's no session, show login/register options.
  if (!session) {
    return (
      <aside className="drr-rightpanel">
        <div className="bubble"></div>
        <div className="down">
          <Link href="/login" className={pathname === "/login" ? "active" : ""}>
            <i className="fa-solid fa-car"></i> Login
          </Link>
          <Link href="/register" className={pathname === "/register" ? "active" : ""}>
            <i className="fa-solid fa-car"></i> Register
          </Link>
        </div>
      </aside>
    );
  }

  // If profile is still being fetched
  if (profileLoading) {
    return (
      <aside className="drr-rightpanel">
        <p>Loading profile...</p>
      </aside>
    );
  }

  // Once profile is loaded, display the profile info.
  return (
    <aside className="drr-rightpanel">
      <div>
        <h2>Profile Info</h2>
        <div>
          <p>Username: {profile?.username}</p>
          <p>Email: {profile?.email}</p>
        </div>
      </div>
    </aside>
  );
}
