// components/Sidepanel.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Sidepanel({ profile, profileLoading }) {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const [popup, setPopup] = useState(null);
  const popupTimeoutRef = useRef(null);

  // Clear any existing popup timer
  const clearPopupTimeout = () => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
  };

  // Show popup message that disappears after 5 seconds
  const showPopup = (message) => {
    clearPopupTimeout();
    setPopup(message);
    popupTimeoutRef.current = setTimeout(() => {
      setPopup(null);
      popupTimeoutRef.current = null;
    }, 5000);
  };

  // Handler that intercepts navigation when not logged in
  const handleNavigation = (e, targetPath) => {
    if (!session && targetPath !== '/news') {
      e.preventDefault();
      showPopup("You need to login first");
    }
  };

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      clearPopupTimeout();
    };
  }, []);

  return (
    <aside className="drr-sidepanel">
      <div className="logo">
        drriven<span>.</span>
      </div>
      <div className="links-top">
        <Link
          href="/feed"
          className={pathname === "/feed" ? "active" : ""}
          onClick={(e) => handleNavigation(e, '/feed')}
        >
          <i className="fa-solid fa-compass"></i> Feed
        </Link>
        <Link
          href="/inbox"
          className={pathname === "/inbox" ? "active" : ""}
          onClick={(e) => handleNavigation(e, '/inbox')}
        >
          <i className="fa-solid fa-inbox"></i> Inbox
        </Link>
        <Link
          href="/news"
          className={pathname === "/news" ? "active" : ""}
        >
          <i className="fa-solid fa-newspaper"></i> News
        </Link>
        <Link
          href="/forum"
          className={pathname === "/forum" ? "active" : ""}
          onClick={(e) => handleNavigation(e, '/forum')}
        >
          <i className="fa-solid fa-comments"></i> Forum
        </Link>
        <Link
          href="/events"
          className={pathname === "/events" ? "active" : ""}
          onClick={(e) => handleNavigation(e, '/events')}
        >
          <i className="fa-solid fa-calendar-alt"></i> Events
        </Link>
        <Link
          href="/spotting"
          className={pathname === "/spotting" ? "active" : ""}
          onClick={(e) => handleNavigation(e, '/spotting')}
        >
          <i className="fa-solid fa-car"></i> Spotting
        </Link>
      </div>
      <div className="links-bottom">
        {session && (
          <Link
            href="/profile"
            className={pathname === "/profile" ? "active" : ""}
            onClick={(e) => handleNavigation(e, '/profile')}
          >
            <i className="fa-solid fa-cog"></i> Settings
          </Link>
        )}
      </div>

      {/* Render the custom popup if exists */}
      {popup && (
        <div className="custom-popup">
          {popup}
        </div>
      )}
    </aside>
  );
}
