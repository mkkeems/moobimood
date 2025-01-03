export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const tmdbApiPaths = {
  searchMovie: "/search/movie",
  searchPerson: "/search/person",
  multiSearch: "/search/multi",
  movieDetails: "/movie/{movie_id}",
  movieImages: "/movie/{movie_id}/images",
  configuration: "/configuration",
};
