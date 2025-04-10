// pages/index.js

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/blog',
      permanent: false, // or true if the redirect is permanent
    },
  };
}

export default function Home() {
  return null; // This component won't actually render because of the redirect
}
