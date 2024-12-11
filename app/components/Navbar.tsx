import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/articles">Articles</Link>
      <Link href="/featured-songs">Featured Music</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
