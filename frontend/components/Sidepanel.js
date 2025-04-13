import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import noUser from "../photos/nouser.png";
import logoW from "../photos/drriven-logo-w.png";

export default function Sidepanel({ profile, profileLoading }) {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  // bubble state now holds an object { target: string, message: string }
  const [bubble, setBubble] = useState(null);
  const bubbleTimeoutRef = useRef(null);

  // This dictionary maps dynamic route segments to their display names.
  const nameMapping = {
    "[slug]": "Post"
    // Add more mappings as needed
  };

  // Clear any existing bubble timer
  const clearBubbleTimeout = () => {
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = null;
    }
  };

  // Show bubble message next to a specific link, then clear after 2.5 seconds
  const showBubble = (target, message) => {
    clearBubbleTimeout();
    setBubble({ target, message });
    bubbleTimeoutRef.current = setTimeout(() => {
      setBubble(null);
      bubbleTimeoutRef.current = null;
    }, 2500);
  };

  // Handler that intercepts navigation if not allowed.
  // The parameter "canJoin" indicates if the link should be accessible by anyone.
  const handleNavigation = (e, targetPath, canJoin = false) => {
    const canNavigate = canJoin || (targetPath === '/profile' && session);
    if (canNavigate) {
      // Remove mobile classes from both sidepanel and rightpanel if the link is allowed.
      document.querySelector('.drr-sidepanel')?.classList.remove('drr-mob-show');
      document.querySelector('.drr-rightpanel')?.classList.remove('drr-mob-show');
      document.dispatchEvent(new CustomEvent('downpanelSelectMiddle'));
      return;
    }
    // Prevent navigation if not allowed
    e.preventDefault();
    if (session) {
      showBubble(targetPath, "Uskoro!");
    } else {
      showBubble(targetPath, "Uskoro!");
    }
  };

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      clearBubbleTimeout();
    };
  }, []);

  // Helper to render a link with an inline bubble if needed.
  // The parameter "canJoin" (default false) determines if anyone can access the link.
  // Additionally, if the current path is a sub-route of the link (e.g., /blog/[slug]),
  // it extracts the subpage name and displays a mapped value if available.
  const renderLink = (href, iconClass, text, canJoin = false) => {
    // Determine active state: either an exact match or if pathname starts with href + "/"
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    let subpageName = null;
    // If there is a sub-route after the main route, extract it.
    if (isActive && pathname !== href) {
      // This assumes the structure /[base]/[subpage]...
      const parts = pathname.split('/').filter(Boolean);
      const baseParts = href.split('/').filter(Boolean);
      if (parts.length > baseParts.length) {
        // Join all extra segments in case there are more than one.
        subpageName = parts.slice(baseParts.length).join('/');
        // Check if the subpage name is in our mapping dictionary.
        if (nameMapping[subpageName]) {
          subpageName = nameMapping[subpageName];
        }
      }
    }

    return (
      <div className="link-container">
        <Link
          href={href}
          className={isActive ? "active" : ""}
          onClick={(e) => handleNavigation(e, href, canJoin)}
        >
          <i className={iconClass}></i> {text}
        </Link>
        {bubble && bubble.target === href && (
          <span className="soon-bubble">{bubble.message}</span>
        )}
        {subpageName && (
          <div className="subpage-name">
            <i class="fa-solid fa-arrow-trend-down"></i> {subpageName}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="drr-sidepanel">
      <div>
        <div className="logo">
          <Image src={logoW} alt="Drriven" />
        </div>
      </div>
      <div>
        <div className="links-top">
          {renderLink("/feed", "fa-solid fa-compass", "Početna")}
          {renderLink("/inbox", "fa-solid fa-inbox", "Poruke")}
          {/* Here, Blog is accessible by everyone */}
          {renderLink("/blog", "fa-solid fa-newspaper", "Blog", true)}
          {renderLink("/forum", "fa-solid fa-comments", "Forum")}
          {renderLink("/events", "fa-solid fa-calendar-alt", "Dogadjaji")}
          {renderLink("/spotting", "fa-solid fa-car", "Spotovanje")}
        </div>
      </div>
      <div>
        <div className="links-bottom">
          {/*{session && renderLink("/profile", "fa-solid fa-cog", "Settings")}*/}
        </div>
      </div>
    </aside>
  );
}
