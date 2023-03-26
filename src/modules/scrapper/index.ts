import puppeteer from "puppeteer";

import { ScrapeOptions, GoodreadsBook } from "../../types/scrapper";

export default class GoodreadsScraper {
  private bookURL: string;
  private options: string[];

  constructor(bookURL: string, options?: string[]) {
    if (!this.isGoodreadsBookUrl(bookURL)) {
      throw new Error("Invalid Goodreads book URL");
    }

    const reservedValues = Object.values(ScrapeOptions);

    if (options !== undefined && options.length) {
      const invalidValues = options.filter(
        (option) => !reservedValues.includes(option as ScrapeOptions)
      );

      if (invalidValues.length > 0) {
        throw new Error(`Invalid options: ${invalidValues.join(", ")}`);
      }
    } else {
      options = reservedValues;
    }

    this.bookURL = bookURL;
    this.options = options;
  }

  protected isGoodreadsBookUrl = (url: string): boolean => {
    const regex = /https?:\/\/(?:www\.)?goodreads\.com\/book\/show\/\d+/;
    return regex.test(url);
  };

  async scrapeBook(): Promise<GoodreadsBook> {
    console.log("sould return =", this.options);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set navigation timeout to 60 seconds
    await page.setDefaultNavigationTimeout(60000);

    await page.goto(this.bookURL);

    const book: GoodreadsBook = {
      title: "",
      authors: [],
      cover: "",
      synopsis: [],
      genres: [],
    };

    if (this.options.includes("title")) {
      const bookTitleElement = await page.$(".BookPageTitleSection__title h1");
      book.title = bookTitleElement
        ? await bookTitleElement.evaluate((node) => node.textContent.trim())
        : "";
    }

    if (this.options.includes("authors")) {
      const authorElements = await page.$$(".ContributorLink__name");
      book.authors = authorElements
        ? await Promise.all(
            authorElements.map(async (element) => {
              const author = await element.evaluate((node) =>
                node.textContent.trim()
              );
              return author;
            })
          )
        : [];
    }

    if (this.options.includes("cover")) {
      const bookCoverImageElement = await page.$(".BookCover__image img");
      book.cover = bookCoverImageElement
        ? await bookCoverImageElement.evaluate((node) => node.src)
        : "";
    }

    if (this.options.includes("synopsis")) {
      const detailsElements = await page.$(
        ".DetailsLayoutRightParagraph .Formatted"
      );

      book.synopsis = detailsElements
        ? await detailsElements.evaluate((node) => node.innerHTML.trim())
        : "";
    }

    if (this.options.includes("genres")) {
      const genreElements = await page.$$(
        ".BookPageMetadataSection__genres .Button__labelItem"
      );

      book.genres = genreElements
        ? await Promise.all(
            genreElements.map(async (element) => {
              const genre = await element.evaluate((node) =>
                node.textContent.trim()
              );
              return genre;
            })
          )
        : [];
    }
    await browser.close();
    return book;
  }
}
