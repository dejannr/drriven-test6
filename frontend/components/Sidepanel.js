// components/Sidepanel.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Sidepanel() {
  const { data: session } = useSession();
  const { pathname } = useRouter();

  return (
    <aside className="drr-sidepanel">
      <div className="logo">
        drriven<span>.</span>
      </div>
      <div className="links-top">
        {session ? (
          <>
            <Link href="/feed" className={pathname === "/feed" ? "active" : ""}>
              <i className="fa-solid fa-compass"></i> Feed
            </Link>
            <Link href="/inbox" className={pathname === "/inbox" ? "active" : ""}>
              <i className="fa-solid fa-inbox"></i> Inbox
            </Link>
            <Link href="/news" className={pathname === "/news" ? "active" : ""}>
              <i className="fa-solid fa-newspaper"></i> News
            </Link>
            <Link href="/forum" className={pathname === "/forum" ? "active" : ""}>
              <i className="fa-solid fa-comments"></i> Forum
            </Link>
            <Link href="/events" className={pathname === "/events" ? "active" : ""}>
              <i className="fa-solid fa-calendar-alt"></i> Events
            </Link>
            <Link href="/spotting" className={pathname === "/spotting" ? "active" : ""}>
              <i className="fa-solid fa-car"></i> Spotting
            </Link>
          </>
        ) : (
            <>
          <Link href="/login" className={pathname === "/login" ? "active" : ""}>
            Login
          </Link>
          <Link href="/register" className={pathname === "/register" ? "active" : ""}>
            Register
          </Link>
          </>
        )}
      </div>
      <div className="links-bottom">
        {session && (
          <Link href="/profile" className={pathname === "/profile" ? "active" : ""}>
            <i className="fa-solid fa-cog"></i> Settings
          </Link>
        )}
      </div>
    </aside>
  );
}
