import { tmdbApiPaths } from "@/lib/tmdb/apiConfig";
import { tmdbFetcher } from "@/lib/tmdb/tmdbFetcher";
import type { MovieDetails } from "@/lib/tmdb/tmdbTypes";
import { useQuery } from "@tanstack/react-query";

export const useTmdbMovieDetailQuery = (movieId: number) => {
  return useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: async (): Promise<MovieDetails> => {
      const url = tmdbApiPaths.movieDetails.replace(
        "{movie_id}",
        movieId.toString(),
      );
      const response = await tmdbFetcher<MovieDetails>(url);

      return response;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
  });
};
