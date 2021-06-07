const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
//const ObjectsToCsv = require('objects-to-csv');

const json2xls = require('json2xls');
const fs = require('fs');

//
// ─── SCRAPE LIST OF ALL CRECHES ─────────────────────────────────────────────────────
//
async function scrapeListings(page) {
    //https://ssl.education.lu/sea?UniteTypeIds=9022%2C7021%2C4021%2C4022&Nom=&Localite=Esch-sur-Alzette
//https://ssl.education.lu/sea?UniteTypeIds=9022%2C7021%2C4021%2C4022&Nom=&Localite=
    await page.goto("https://ssl.education.lu/sea?UniteTypeIds=9022%2C7021%2C4021%2C4022&Nom=&Localite=Esch-sur-Alzette")
    const html = await page.content();
    const $ = cheerio.load(html);

    //
    // ─── SEARCH CSS CLASS IN SELECTED PAGE ──────────────────────────────────────────
    //
    const resultat = $(".table-striped tbody tr").map((index, element) => {
        const urlElement = $(element).find('td a');
        const locationElement = $(element).find('td:nth-child(2)');
        const crecheName = $(urlElement).text();
        const url = 'https://ssl.education.lu' + $(urlElement).attr('href');
        const email = '';
        const location = $(locationElement).text();
        const adress = '';
        const website = '';
        return { crecheName,adress, location, url, email ,website}
    })
        .get();
    //console.log('list' , resultat)
    return resultat

}

//
// ─── SCRAPE DETAILS OF CRECHES ──────────────────────────────────────────────────
//
async function scrapeCrecheDescriptions(listings, page) {
    for (let i = 0; i < listings.length; i++) {
        await page.goto(listings[i].url);
        const html = await page.content();
        const $ = cheerio.load(html);


        const resultat = $(".signaletique").map((index, element) => {
            const adressElement = $(element).find('.col-4:first p:nth-child(2)');
            const emailElement = $(element).find('p a:first');
            const websiteElement = $(element).find('.col-4:nth-child(3) p:nth-child(2) a:eq(1)');
            const phoneElement = $(element).find('.col-4:nth-child(2) p:nth-child(2)');
            const adress = $(adressElement).text().trim();
            const email = $(emailElement).attr('href');
            const phone = $(phoneElement).text().trim();
            let website =  $(websiteElement).attr('href');
            let cleanEmail = '';
            let cleanPhone = '';
            if (email != undefined) {
                cleanEmail = email.replace("mailto:", "");
            }
            if (phone != undefined) {
                cleanPhone = phone.replace("\n\t\t\t", " ");
            }

            if (website == undefined){
                website = 'not found'
            }

            const cleanAdress = adress.replace("\n\t\t\t", " ")
            listings[i].email = cleanEmail
            listings[i].adress = cleanAdress
            listings[i].website = website
            // return { cleanAdress, cleanPhone, cleanEmail }
            
        })
            .get();


        console.log(listings)
        //return resultat
        await sleep(3000)

    }
}
//
// ─── INTERVAL BETWEEN CALLING PAGES ─────────────────────────────────────────────
//
async function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

async function createCsvFile(listings){
  
        /*const csv = new ObjectsToCsv(listingsWithDescriptions)
       
        // Save to file:
        await csv.toDisk('./test.csv');
       
        // Return the CSV file as string:
        console.log(await csv);*/

        var xls = json2xls(listings);

        await fs.writeFileSync('liste_de_creche_au_luxembourg.xlsx', xls, 'binary');
  
}

//
// ─── MAIN FUNCTION ──────────────────────────────────────────────────────────────
// 
async function main() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const listings = await scrapeListings(page)
    const listingsWithDescriptions = await scrapeCrecheDescriptions(listings, page)
    console.log(listingsWithDescriptions);
    await createCsvFile(listings);
    
    

   


}


main();