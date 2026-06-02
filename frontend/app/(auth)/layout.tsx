'use client';

import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({children}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/assets/auth_img2.JPG"
          loading="eager"
          alt="App background image"
          className="absolute inset-0 w-full h-full object-cover"
          width={800}
          height={1200}
        />
        <div className="absolute inset-0 bg-primary/78" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-primary-foreground">
          <h1 className="text-4xl font-bold mb-3">Mayang</h1>
          <p className="text-lg opacity-90">
            Helping people stay ready and resilient in times of disaster.
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
