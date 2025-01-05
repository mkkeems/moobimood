import { tmdbGetImage } from "@/lib/tmdb/tmdbGetImage";
import {
  type TmdbMultiListResponseType,
  isMovie,
  isPerson,
  isTvSeries,
} from "@/lib/tmdb/tmdbTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CommandSearchItemProps = {
  item: TmdbMultiListResponseType;
};

const CommandSearchItem = ({ item }: CommandSearchItemProps) => {
  return (
    <>
      {isMovie(item) && (
        <div className="flex flex-col gap-3 w-1/4 h-auto min-h-fit">
          <Link href="/movies/[id]" as={`/movies/${item.id}`}>
            <div className="h-28 p-2 gap-2 align-top rounded-sm hover:bg-muted min-h-fit">
              <Image
                src={tmdbGetImage(item.poster_path)}
                alt={item.title}
                height={179.63}
                width={119.75}
              />
              <div className="font-bold text-sm w-full">
                <span>{item.title}</span>
                {item.release_date && (
                  <span> ({item.release_date?.slice(0, 4)})</span>
                )}
                {/* <p className="line-clamp-3">{item.overview}</p> */}
              </div>
            </div>
          </Link>
        </div>
      )}

      {isTvSeries(item) && (
        <Link href="/movies/[id]" as={`/tv/${item.id}`}>
          <div className="h-28 p-2 text-sm flex gap-2 align-top rounded-sm hover:bg-muted">
            <Image
              src={tmdbGetImage(item.poster_path)}
              alt={item.name}
              height={100}
              width={66}
            />
            <div className="w-full">
              <div className="font-bold flex flex-between w-full">
                {item.name}

                {item.first_air_date && (
                  <div>({item.first_air_date?.slice(0, 4)})</div>
                )}
              </div>
              <p className="line-clamp-3">{item.overview}</p>
            </div>
          </div>
        </Link>
      )}

      {isPerson(item) && (
        <div className="flex flex-col gap-3 w-1/2">
          <Link href="/movies/[id]" as={`/person/${item.id}`}>
            <div className="p-2 text-sm flex gap-3 items-center rounded-sm hover:bg-muted">
              <div className="flex w-10 h-10 items-center justify-center overflow-hidden rounded-full border border-muted-foreground">
                {item.profile_path ? (
                  <Image
                    src={tmdbGetImage(item.profile_path)}
                    alt={item.name.charAt(0)}
                    height={60}
                    width={40}
                  />
                ) : (
                  <div>{item.name.charAt(0)}</div>
                )}
              </div>

              <span>{item.name}</span>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default CommandSearchItem;
