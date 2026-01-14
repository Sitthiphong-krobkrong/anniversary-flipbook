"use client";

import { pages } from "../src/data/pages";
import FlipBook from "../src/components/FlipBook";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 p-6 safe-screen">
      <FlipBook items={pages} />
    </main>
  );
}