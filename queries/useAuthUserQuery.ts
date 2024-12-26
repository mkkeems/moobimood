import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await fetch("/api/me");
      if (!response.ok) throw new Error("Not authenticated");
      const authUser = await response.json();

      return {
        email: authUser.email,
        username: authUser.username,
        authState: !!authUser,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
