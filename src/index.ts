import GoodreadsScraper from "./modules/scrapper";

const bookURL =
  "https://www.goodreads.com/book/show/53450790-the-perfect-marriage";

// Initialize a scraper object with options to scrape
/* the program could scrap
  "title"
  "cover"
  "genres"
  "authors"
  "synopsis"
*/
// const scraper = new GoodreadsScraper(bookURL); //will scrape everything
const scraper = new GoodreadsScraper(bookURL, ["title", "cover", "authors"]); //will scrape only the authors, title and cover

// Run the scraper and log the scraped data
scraper.scrapeBook().then((bookData) => console.log(bookData));
