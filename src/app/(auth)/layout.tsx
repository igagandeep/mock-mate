import { ReactNode } from "react";
import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuard>
      <div className="auth-layout flex h-screen">
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <div className="  flex flex-col items-center justify-center">
            <div className="flex gap-1 mb-2 flex-row items-center">
              <Image src="/logo.png" alt="logo" height={56} width={56} />
              <h2 className="text-primary-100 text-5xl mt-2">MockMate</h2>
            </div>

            <h3 className="text-2xl mt-2">Practice job interview with AI</h3>

            <Image
              src="/auth-avatar.png"
              alt="Authentication Illustration"
              width={350}
              height={350}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <div className="max-w-md w-full">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AuthLayout;
