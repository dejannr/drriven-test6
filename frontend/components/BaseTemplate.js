// components/BaseTemplate.js
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidepanel from './Sidepanel';
import Rightpanel from './Rightpanel';

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
      const fetchProfile = axios.get("http://localhost:8000/users/profile/", {
        headers: {
          Authorization: `Bearer ${session.access}`,
        },
      });

      // Create a promise that resolves after 2 seconds
      const delay = new Promise(resolve => setTimeout(resolve, 2000));

      // Wait for both the profile fetch and the delay promise to resolve
      Promise.all([fetchProfile, delay])
        .then(([response]) => {
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

  if (profileLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="base-container">
      <Sidepanel profile={profile} profileLoading={profileLoading} />
      <div className="drr-main">
        {children}
      </div>
      <Rightpanel profile={profile} profileLoading={profileLoading} />
    </div>
  );
}
