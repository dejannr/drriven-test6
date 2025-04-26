// components/BaseTemplate.js
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Sidepanel from './Sidepanel';
import Rightpanel from './Rightpanel';
import Downpanel from './Downpanel';
import { NotificationProvider } from "./NotificationContext";

export default function BaseTemplate({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // derive page name from path, e.g. "/dashboard/settings" → "dashboard-settings"
  const pageName = router.pathname === '/'
    ? 'home'
    : router.pathname
        .slice(1)               // remove leading slash
        .replace(/\//g, '-')    // replace other slashes
        .replace(/\[\.\.\.\w+\]/g, 'all')   // optional: catch [..slug] to “all”
        .replace(/\[\w+\]/g, '')            // optional: remove [id] params
        .toLowerCase();

  useEffect(() => {
    if (session?.error === "SessionExpired") {
      signOut({ callbackUrl: '/login' });
    }
  }, [session]);

  useEffect(() => {
    if (session?.access && !profile) {
      setProfileLoading(true);
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/bapi/users/profile/`, {
          headers: { Authorization: `Bearer ${session.access}` },
        })
        .then(res => setProfile(res.data))
        .catch(err => console.error("Error fetching profile:", err))
        .finally(() => setProfileLoading(false));
    }
  }, [session, profile]);

  return (
    <NotificationProvider>
      <div className="base-container">
        <Sidepanel profile={profile} profileLoading={profileLoading} />
        {/* add the pageName as an extra class */}
        <div className={`drr-main page-${pageName}`}>
          {children}
        </div>
        <Rightpanel profile={profile} profileLoading={profileLoading} />
        <Downpanel profile={profile} profileLoading={profileLoading} />
      </div>
    </NotificationProvider>
  );
}
