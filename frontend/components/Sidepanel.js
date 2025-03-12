import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Sidepanel({ profile, profileLoading }) {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  // bubble state now holds an object { target: string, message: string }
  const [bubble, setBubble] = useState(null);
  const bubbleTimeoutRef = useRef(null);

  // Clear any existing bubble timer
  const clearBubbleTimeout = () => {
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = null;
    }
  };

  // Show bubble message next to a specific link, then clear after 5 seconds
  const showBubble = (target, message) => {
    clearBubbleTimeout();
    setBubble({ target, message });
    bubbleTimeoutRef.current = setTimeout(() => {
      setBubble(null);
      bubbleTimeoutRef.current = null;
    }, 2500);
  };

  // Handler that intercepts navigation if not allowed.
  // Allow /news always and /profile when logged in.
  const handleNavigation = (e, targetPath) => {
    if (
      targetPath === '/news' ||
      (targetPath === '/profile' && session)
    ) {
      // Allow navigation
      return;
    }
    e.preventDefault();
    if (session) {
      showBubble(targetPath, "Soon!");
    } else {
      showBubble(targetPath, "You need to login first");
    }
  };

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      clearBubbleTimeout();
    };
  }, []);

  // Helper to render a link with an inline bubble if needed
  const renderLink = (href, iconClass, text) => (
    <div className="link-container">
      <Link
        href={href}
        className={pathname === href ? "active" : ""}
        onClick={(e) => handleNavigation(e, href)}
      >
        <i className={iconClass}></i> {text}
      </Link>
      {bubble && bubble.target === href && (
        <span className="soon-bubble">{bubble.message}</span>
      )}
    </div>
  );

  return (
    <aside className="drr-sidepanel">
      <div>
        <div className="logo">
          drriven<span>.</span>
        </div>
      </div>
      <div>
        <div className="links-top">
          {renderLink("/feed", "fa-solid fa-compass", "Feed")}
          {renderLink("/inbox", "fa-solid fa-inbox", "Inbox")}
          <div className="link-container">
            <Link
              href="/news"
              className={pathname === "/news" ? "active" : ""}
            >
              <i className="fa-solid fa-newspaper"></i> News
            </Link>
          </div>
          {renderLink("/forum", "fa-solid fa-comments", "Forum")}
          {renderLink("/events", "fa-solid fa-calendar-alt", "Events")}
          {renderLink("/spotting", "fa-solid fa-car", "Spotting")}
        </div>
      </div>
      <div>
        <div className="links-bottom">
          {session && (
            <div className="link-container">
              <Link
                href="/profile"
                className={pathname === "/profile" ? "active" : ""}
                onClick={(e) => handleNavigation(e, '/profile')}
              >
                <i className="fa-solid fa-cog"></i> Settings
              </Link>
              {bubble && bubble.target === '/profile' && (
                <span className="soon-bubble">{bubble.message}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
