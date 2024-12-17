import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout");
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      console.log("/api/logout response: ", response);
      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};
