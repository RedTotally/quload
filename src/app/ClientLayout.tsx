"use client";

import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <img className="hidden" src="/host.png"></img>
      {children}
      <footer className="my-[20em] px-10">
        <p className="text-center">
          © 2023 - 2025{" "}
          <Link className="text-[#1F51FF]" href={"https://godotwebs.com/"}>
            GoDotWebs
          </Link>
        </p>
      </footer>
    </>
  );
}
