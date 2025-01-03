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
        // .sort((a, b) => a.title.localeCompare(b.title));
      } else if (result.media_type === "tv") {
        acc.tvSeries = [...acc.tvSeries, result].slice(0, 10);
        // .sort((a, b) => a.name.localeCompare(b.name));
      } else if (result.media_type === "person") {
        acc.people = [...acc.people, result].slice(0, 10);
        // .sort((a, b) => a.name.localeCompare(b.name));
      }
      return acc;
    },
    { movies: [], tvSeries: [], people: [] },
  ) || { movies: [], tvSeries: [], people: [] };

  const hasResults = data?.results.length;

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
                <CommandGroup heading="Movies">
                  {movies.map((movie) => (
                    <CommandItem key={movie.id}>{movie.title}</CommandItem>
                  ))}
                </CommandGroup>
              )}
              {tvSeries.length > 0 && (
                <CommandGroup heading="TV Shows">
                  {tvSeries.map((tv) => (
                    <CommandItem key={tv.id}>{tv.name}</CommandItem>
                  ))}
                </CommandGroup>
              )}
              {people.length > 0 && (
                <CommandGroup heading="People">
                  {people.map((person) => (
                    <CommandItem key={person.id}>{person.name}</CommandItem>
                  ))}
                </CommandGroup>
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
