"use client";

import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, createContext, useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { PUBLIC_ROUTES, ROUTES, isRoutePublic } from "@/constants/routes";
import { useMe } from "@/hooks/api";
import { CookiesKeys } from "@/lib/cookies";
import { AuthToken } from "@/types/authentication.type";

export const AuthContext = createContext<
  | {
      signIn: (authToken: AuthToken) => void;
      signOut: () => void;
    }
  | undefined
>(undefined);

export const AuthProvider = (p: { children: ReactNode }) => {
  const router = useRouter();
  const currentPathName = usePathname();
  const { data: user, error } = useMe();

  useEffect(() => {
    if (isRoutePublic(currentPathName, PUBLIC_ROUTES)) {
      setIsRedirectionDone(true);
    }
  }, [currentPathName]);

  const [isRedirectionDone, setIsRedirectionDone] = useState(false);

  const signIn = (authResponse: AuthToken) => {
    Cookies.set(CookiesKeys.token, authResponse.jwt, { expires: 365 });
  };

  const signOut = () => {
    router.replace(ROUTES.signin);
    Cookies.remove(CookiesKeys.token);
    setIsRedirectionDone(true);
  };

  useEffect(() => {
    if (user) {
      const checkTokenValidity = async () => {
        if (user?.id) {
          setIsRedirectionDone(true);
        } else {
          Cookies.remove(CookiesKeys.token);
          router.replace(ROUTES.signin);
        }
      };

      if (isRoutePublic(currentPathName, PUBLIC_ROUTES)) {
        setIsRedirectionDone(true);
      } else {
        if (Cookies.get(CookiesKeys.token)) {
          checkTokenValidity();
        } else {
          router.replace(ROUTES.signin);
        }
      }
    } else if (error) {
      Cookies.remove(CookiesKeys.token);
      router.replace(ROUTES.signin);
    }
  }, [user, error]);
  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {isRedirectionDone ? (
        p.children
      ) : (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      )}
    </AuthContext.Provider>
  );
};
