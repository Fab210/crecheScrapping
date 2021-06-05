const puppeteer = require("puppeteer")
const cheerio = require("cheerio")


const scrapingResults = [{
    title: "Entry level software engineer",
    datePosted: new Date("2019-07-26 12:00:00"),
    neighborhood: "(palo alto)",
    url: "",
    jobDescription: "",
    compensation: ""

}];


async function main() {
    let hrefList = [];
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto("https://ssl.education.lu/sea?UniteTypeIds=9022%2C7021%2C4021%2C4022&Nom=&Localite=Esch-sur-Alzette")
    const html = await page.content();
    const $ = cheerio.load(html);
    const resultat = $('.table-striped tbody tr td a')

     for (let i = 0; i < resultat.length; i++) {
        debugger
        const element =  resultat[i].href;
        const list = hrefList.push(element)
        //console.log(list)
    }

    $(".table-striped tbody tr td a").each(function(i, item){
        console.log($(item).attr('href'))
    });
    
    //console.log(resultat[2])
}





main();