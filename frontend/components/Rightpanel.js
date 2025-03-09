// components/Rightpanel.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Sidepanel() {
  const { data: session } = useSession();
  const { pathname } = useRouter();

  return (
    <aside className="drr-rightpanel">

    </aside>
  );
}
