import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Welcome to My Next.js App</h1>
      <p>Start building your app here!</p>
      <Link href="/interview">
        <button>Go to Interview</button>
      </Link>
    </main>
  );
}
