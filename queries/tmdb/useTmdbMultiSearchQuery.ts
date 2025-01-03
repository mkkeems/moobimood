import { tmdbApiPaths } from "@/lib/tmdb/apiConfig";
import { tmdbFetcher } from "@/lib/tmdb/tmdbFetcher";
import type {
  TmdbListResponse,
  TmdbMultiListResponseType,
} from "@/lib/tmdb/tmdbTypes";
import { useQuery } from "@tanstack/react-query";

export const useTmdbMultiSearchQuery = (searchKeyword: string) => {
  return useQuery({
    queryKey: ["search", searchKeyword],
    queryFn: async () => {
      const response = await tmdbFetcher<
        TmdbListResponse<TmdbMultiListResponseType>
      >(tmdbApiPaths.multiSearch, {
        queryParams: { query: searchKeyword },
      });

      return response;
    },
    enabled: !!searchKeyword,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
