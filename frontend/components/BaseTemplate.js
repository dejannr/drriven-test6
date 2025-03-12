// components/BaseTemplate.js
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidepanel from './Sidepanel';
import Rightpanel from './Rightpanel';

export default function BaseTemplate({ children }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (session?.access) {
      setProfileLoading(true);
      axios
        .get("http://localhost:8000/users/profile/", {
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
  }, [session]);

  return (
    <div className="base-container">
      {/* Pass profile and loading state to Sidepanel */}
      <Sidepanel profile={profile} profileLoading={profileLoading} />

      {/* Main Content */}
      <div className="drr-main">
        {children}
      </div>

      {/* Pass profile and loading state to Rightpanel */}
      <Rightpanel profile={profile} profileLoading={profileLoading} />
    </div>
  );
}
