import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-3">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo.png" alt="Logo" width={40} height={20} />
          <h2 className="text-primary-100 text-3xl mt-1">MockMate</h2>
        </Link>
        <LogoutButton />
      </nav>
      {children}
    </div>
  );
}
