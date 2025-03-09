import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <nav>
        <Link href="/login">Login</Link> |{' '}
        <Link href="/register">Register</Link> |{' '}
        <Link href="/profile">Profile</Link> |{' '}
        <Link href="/posts">Posts</Link>
      </nav>
    </div>
  );
}
