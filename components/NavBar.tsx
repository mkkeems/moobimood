"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthUser } from "@/queries/useAuthUserQuery";
import { useLogout } from "@/queries/useLogoutMutation";
import Link from "next/link";
import * as React from "react";

export function NavBar() {
  const { data: authUser, isLoading, isError, status } = useAuthUser();
  const logoutMutation = useLogout();

  const handleLogout = async () => logoutMutation.mutate();

  return (
    <NavigationMenu>
      <NavigationMenuList className="justify-between w-screen">
        <div>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </div>
        {authUser && <div>Hello, {authUser?.username}</div>}
        <div>
          {!authUser ? (
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/login" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/signup" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Signup
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          ) : (
            <NavigationMenuItem onClick={handleLogout}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Logout
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
