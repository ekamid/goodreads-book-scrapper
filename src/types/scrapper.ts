export interface GoodreadsBook {
  title: string;
  authors: string[];
  cover: string;
  synopsis: string[];
  genres: string[];
}

export enum ScrapeOptions {
  TITLE = "title",
  AUTHORS = "authors",
  COVER = "cover",
  SYNOPSIS = "synopsis",
  GENRES = "genres",
}
