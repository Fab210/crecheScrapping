const puppeteer = require("puppeteer")
const cheerio = require("cheerio")


async function scrapeListings(page) {
  
    await page.goto("https://ssl.education.lu/sea?UniteTypeIds=9022%2C7021%2C4021%2C4022&Nom=&Localite=Esch-sur-Alzette")
    const html = await page.content();
    const $ = cheerio.load(html);

    //
    // ─── SEARCH CSS CLASS IN SELECTED PAGE ──────────────────────────────────────────
    //
    const resultat = $(".table-striped tbody tr td a").map((index,element) => {
        const crecheName = $(element).text();
        const url = 'https://ssl.education.lu' + $(element).attr('href');
        return { crecheName,url}
    })
    .get();
    return resultat
   
}

async function scrapeCrecheDescriptions(listings, page){
    for (let i = 0; i < listings.length; i++) {
        await page.goto(listings[i].url);
        const html = await page.content();
        
    }
}


async function main(){
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const listings = await scrapeListings(page)
    const listingsWithDescriptions = await scrapeCrecheDescriptions(listings, page)
    console.log(listings);


}


main();