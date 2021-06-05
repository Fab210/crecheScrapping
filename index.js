const puppeteer = require("puppeteer")
const cheerio = require("cheerio")


async function scrapeListings(page) {

    await page.goto("https://ssl.education.lu/sea?UniteTypeIds=9022%2C7021%2C4021%2C4022&Nom=&Localite=Esch-sur-Alzette")
    const html = await page.content();
    const $ = cheerio.load(html);

    //
    // ─── SEARCH CSS CLASS IN SELECTED PAGE ──────────────────────────────────────────
    //
    const resultat = $(".table-striped tbody tr td a").map((index, element) => {
        const crecheName = $(element).text();
        const url = 'https://ssl.education.lu' + $(element).attr('href');
        const email = ''
        return { crecheName, url ,email}
    })
        .get();
    console.log(resultat)
    return resultat

}

async function scrapeCrecheDescriptions(listings, page) {
    for (let i = 0; i < listings.length; i++) {
        await page.goto(listings[i].url);
        const html = await page.content();
        const $ = cheerio.load(html);


        const resultat = $(".signaletique").map((index, element) => {
            const adressElement = $(element).find('.col-4:first p:nth-child(2)');
            const emailElement = $(element).find('p a:first');
            const phoneElement = $(element).find('.col-4:nth-child(2) p:nth-child(2)');
            const adress = $(adressElement).text().trim();
            const email = $(emailElement).attr('href');
            const phone = $(phoneElement).text().trim();
            let cleanEmail = '';
            let cleanPhone = '';
            if (email != undefined) {
                cleanEmail = email.replace("mailto:", "");
            }
            if (phone != undefined) {
                cleanPhone = phone.replace("\n\t\t\t", " ");
            }

            const cleanAdress = adress.replace("\n\t\t\t", " ")
listings[i].email = cleanEmail
           // return { cleanAdress, cleanPhone, cleanEmail }
        })
            .get();

        
        console.log(listings[i])
        //return resultat
        await sleep(3000)

    }
}

async function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}


async function main() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const listings = await scrapeListings(page)
    const listingsWithDescriptions = await scrapeCrecheDescriptions(listings, page)
    console.log(listings);


}


main();