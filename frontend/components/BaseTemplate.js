// components/BaseTemplate.js
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidepanel from './Sidepanel';
import Rightpanel from './Rightpanel';
import Downpanel from './Downpanel';

export default function BaseTemplate({ children }) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Auto sign out if session has error "SessionExpired"
  useEffect(() => {
    if (session?.error === "SessionExpired") {
      signOut({ callbackUrl: '/login' });
    }
  }, [session]);

  // Fetch profile only if session exists and profile is not already set
  useEffect(() => {
    if (session?.access && !profile) {
      setProfileLoading(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/bapi/users/profile/`, {
          headers: {
            Authorization: `Bearer ${session.access}`,
          },
        })
        .then((response) => {
          setProfile(response.data);
          setProfileLoading(false);
        })
        .catch((error) => {
          console.error(
            "Error fetching profile:",
            error.response?.data || error.message
          );
          setProfileLoading(false);
        });
    }
  }, [session, profile]); // Include profile in the dependency array

  return (
    <div className="base-container">
      <Sidepanel profile={profile} profileLoading={profileLoading} />
      <div className="drr-main">{children}</div>
      <Rightpanel profile={profile} profileLoading={profileLoading} />
      <Downpanel profile={profile} profileLoading={profileLoading} />
    </div>
  );
}
