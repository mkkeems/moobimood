import {
  type TmdbMultiListResponseType,
  isMovie,
  isPerson,
  isTvSeries,
} from "@/lib/tmdb/tmdbTypes";
import Link from "next/link";
import React from "react";

type CommandSearchItemProps = {
  item: TmdbMultiListResponseType;
};

const CommandSearchItem = ({ item }: CommandSearchItemProps) => {
  return (
    <>
      {isMovie(item) && (
        <Link href="/movies/[id]" as={`/movies/${item.id}`}>
          <div className="p-2 text-sm flex justify-between items-center rounded-sm hover:bg-muted">
            <span>{item.title}</span>
            {item.release_date && (
              <span>({item.release_date?.slice(0, 4)})</span>
            )}
          </div>
        </Link>
      )}

      {isTvSeries(item) && (
        <Link href="/movies/[id]" as={`/tv/${item.id}`}>
          <div className="p-2 text-sm flex justify-between items-center rounded-sm hover:bg-muted">
            <span>{item.name}</span>
            {item.first_air_date && (
              <span>({item.first_air_date?.slice(0, 4)})</span>
            )}
          </div>
        </Link>
      )}

      {isPerson(item) && (
        <Link href="/movies/[id]" as={`/person/${item.id}`}>
          <div className="p-2 text-sm flex justify-between items-center rounded-sm hover:bg-muted">
            <span>{item.name}</span>
          </div>
        </Link>
      )}
    </>
  );
};

export default CommandSearchItem;
