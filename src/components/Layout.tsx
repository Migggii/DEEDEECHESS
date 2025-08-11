import React, { ReactNode } from 'react';
import Link from 'next/link';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-zinc-900">
        <h1 className="text-2xl font-bold">DeeDeeChess</h1>
        <ul className="flex space-x-4 text-sm uppercase">
          <li><Link href="/news">News</Link></li>
          <li><Link href="/content">Content</Link></li>
          <li><Link href="/calendar">Calendar</Link></li>
          <li><Link href="/competitions">Competitions</Link></li>
          <li><Link href="/social">Social</Link></li>
          <li><Link href="/donate">Donate</Link></li>
          <li><Link href="/bio">Bio</Link></li>
        </ul>
      </nav>

      {/* Wichtig: zentrierter, begrenzter Bereich */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
