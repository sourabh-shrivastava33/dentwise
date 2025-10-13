"use client";

import { syncUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";

import { useEffect } from "react";

export const UserSync = () => {
  const { isLoaded, isSignedIn } = useUser();
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      try {
        const handleUserSync = async () => {
          if (isLoaded && isSignedIn) {
            try {
              await syncUser();
            } catch (error) {
              console.log("Failed to sync user", error);
            }
          }
        };

        handleUserSync();
      } catch (error) {
        console.log("Error syncing user on client:", error);
      }
    }
  }, [isLoaded, isSignedIn]);

  return null;
};
