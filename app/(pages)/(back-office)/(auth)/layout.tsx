import cowPng from "@/assets/images/auth-cow.png";
import { Logo } from "@/components/ui/logo";
import { APP_NAME } from "@/constants/app-info";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Auth",
  description: "Authentification",
};

export default function SigInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative  grid h-[800px] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 ">
      <div className="relative hidden h-full flex-col bg-muted  text-white lg:flex ">
        <Image
          width={1884}
          height={2220}
          alt="Image de vaches dans un pré"
          className="absolute inset-0 h-screen w-full object-cover "
          src={cowPng.src}
        />
        <div className="absolute h-screen  w-full bg-gradient-to-b from-primary/30 to-black/10" />

        <div className=" z-20 flex items-center p-10 text-lg  font-medium">
          <Logo />
          {APP_NAME}
        </div>
        <div className="relative z-20 mt-auto p-4">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {
                "Je gagne des heures au quotidien pour organiser mes ventes, c'est top !"
              }
            </p>
            <footer className="text-sm">Christine Galisson</footer>
          </blockquote>
        </div>
      </div>
      <div className="display lg:p-8">{children}</div>
    </div>
  );
}
