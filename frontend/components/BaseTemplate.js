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

  useEffect(() => {
    if (session?.access) {
      setProfileLoading(true);
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bapi/users/profile/`, {
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

  // Temporarily disabled loading screen:
  // To re-enable, uncomment the block below.
  /*
  if (profileLoading) {
    return (
      <div className="square-loading-screen">
        <div className="square-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>Loading your profile...</p>
      </div>
    );
  }
  */

  return (
    <div className="base-container">
      <Sidepanel profile={profile} profileLoading={profileLoading} />
      <div className="drr-main">
        {children}
      </div>
      <Rightpanel profile={profile} profileLoading={profileLoading} />
      <Downpanel profile={profile} profileLoading={profileLoading} />
    </div>
  );
}
