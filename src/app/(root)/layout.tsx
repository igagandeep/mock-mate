import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect('/sign-in');

  return (
    <div className="root-layout">
      <nav className="flex justify-between items-center p-3">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo.png" alt="Logo" width={40} height={20} />
          <h2 className="text-primary-100 text-3xl mt-1">MockMate</h2>
        </Link>

        {isUserAuthenticated && <LogoutButton />}
      </nav>
      {children}
    </div>
  );
};
export default RootLayout;
