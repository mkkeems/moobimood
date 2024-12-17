import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await fetch("/api/me");
      if (!response.ok) throw new Error("Not authenticated");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
