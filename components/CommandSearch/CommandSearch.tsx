"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  MovieWithMediaType,
  PersonWithMediaType,
  TvSeriesWithMediaType,
} from "@/lib/tmdb/tmdbTypes";
import { useTmdbMultiSearchQuery } from "@/queries/tmdb/useTmdbMultiSearchQuery";
import React, { useEffect, useState } from "react";
import CommandSearchButton from "./CommandSearchButton";
import CommandSearchGroup from "./CommandSearchGroup";
import CommandSearchItem from "./CommandSearchItem";

export const CommandSearch = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce<string>(search, 500);

  const { data, isLoading } = useTmdbMultiSearchQuery(debouncedSearch);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const { movies, tvSeries, people } = data?.results.reduce<{
    movies: MovieWithMediaType[];
    tvSeries: TvSeriesWithMediaType[];
    people: PersonWithMediaType[];
  }>(
    (acc, result) => {
      if (result.media_type === "movie") {
        acc.movies = [...acc.movies, result].slice(0, 10);
      } else if (result.media_type === "tv") {
        acc.tvSeries = [...acc.tvSeries, result].slice(0, 10);
      } else if (result.media_type === "person") {
        acc.people = [...acc.people, result].slice(0, 10);
      }
      return acc;
    },
    { movies: [], tvSeries: [], people: [] },
  ) || { movies: [], tvSeries: [], people: [] };

  const hasResults = data?.results.length;

  // console.log({ hasResults, movies, tvSeries, people });

  return (
    <>
      <CommandSearchButton onClick={() => setOpen(true)} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for Movies, TV Shows, People..."
          onValueChange={setSearch}
        />
        <CommandList>
          {hasResults && (
            <>
              {movies.length > 0 && (
                <CommandSearchGroup heading="Movies">
                  {movies.map((movie) => (
                    <CommandSearchItem
                      item={movie}
                      key={`search-movie-${movie.id}`}
                    />
                  ))}
                </CommandSearchGroup>
              )}

              {tvSeries.length > 0 && (
                <CommandSearchGroup heading="TV Shows">
                  {tvSeries.map((tv) => (
                    <CommandSearchItem item={tv} key={`search-tv-${tv.id}`} />
                  ))}
                </CommandSearchGroup>
              )}

              {people.length > 0 && (
                <CommandSearchGroup heading="People">
                  {people.map((person) => (
                    <CommandSearchItem
                      item={person}
                      key={`search-person-${person.id}`}
                    />
                  ))}
                </CommandSearchGroup>
              )}
            </>
          )}
          {debouncedSearch && !hasResults && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
