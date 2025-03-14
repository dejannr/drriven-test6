// frontend/components/Rightpanel.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import noUser from '../../photos/nouser.png'; // Import the image

export default function RightPanel({ profile, profileLoading }) {
  const { data: session, status } = useSession();
  const { pathname } = useRouter();

  // While session is loading
  if (status === "loading") {
    return (
      <aside className="drr-rightpanel">
        <p>Loading...</p>
      </aside>
    );
  }

  // If there's no session, show login/register options with the image inside .bubble.
  if (!session) {
    return (
      <aside className="drr-rightpanel">
        <div className="out">
          <div>
            <div className="bubble">
              <Image src={noUser} alt="No User" />
              <h2>No User</h2>
            </div>
          </div>
          <div>
            <div className="middle">
              <Link href="/login" className={pathname === "/login" ? "active" : ""}>
                <i className="fa-solid fa-right-to-bracket"></i> Login
              </Link>
              <Link href="/register" className={pathname === "/register" ? "active" : ""}>
                <i className="fa-solid fa-user-plus"></i> Register
              </Link>
            </div>
          </div>
          {/*<div>*/}
          {/*  <div className="down"></div>*/}
          {/*</div>*/}
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

  // Once profile is loaded, display the profile info including the photo.
  // The cover image will only display if profile.cover_image exists.
  return (
    <aside className="drr-rightpanel">
      <div className="in">
        <div className="bubble">
          <h2>Profile Info</h2>
          <div class="line"></div>
          <div className="cover">
            {profile?.cover_image && (
                <Image
                    src={`data:image/jpeg;base64,${profile.cover_image}`}
                    alt="Cover Image"
                    width={300}
                    height={150}
                    unoptimized
                />
            )}
          </div>
          <div className="under-cover">
            {profile?.image ? (
              <Image
                  src={`data:image/jpeg;base64,${profile.image}`}
                  alt="Profile Photo"
                  width={100}
                  height={100}
              />
          ) : (
              <Image src={noUser} alt="No User" width={100} height={100}/>
          )}
            <div className="info-container">
              <h2>{profile?.first_name} {profile?.last_name}</h2>
              <p>@{profile?.username}</p>
            </div>
          </div>
        </div>
        <div class="bubble bubble-garage">
          <h2>Garage</h2>
          <div class="line"></div>
        </div>
      </div>
    </aside>
  );
}
