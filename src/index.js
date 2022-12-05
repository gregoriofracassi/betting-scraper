// import mongoose from "mongoose"
// import server from "./server.js"
// import list from "express-list-endpoints"

// const port = process.env.PORT || 3030
// const ATLAS_URL = process.env.ATLAS_URL

// if (!ATLAS_URL) throw new Error("No Atlas URL specified")

// mongoose
//   .connect(ATLAS_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to mongo")
//     server.listen(port, () => {
//       console.table(list(server))
//       console.log("Server listening on port " + port)
//     })
//   })

import puppeteer from "puppeteer"

const URL = 'https://www.unibet.it/betting/sports/filter/football/world_cup_2022/all/matches'

const scrapeContent = async (url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const [el] = await page.$x('//*[@id="rightPanel"]/div[3]/div/div[2]/div[1]/div/div/div/div/div[2]/div[1]/div/div/div/div[4]/div[2]/div[2]/div[1]/div/div/div[2]/div[2]/div[1]/div/div/button/span')
    const src = await el.getProperty('textContent')
    const srcTxt = await src.jsonValue()
    const num = parseFloat(srcTxt)

    console.log({num})
    
    browser.close()
}

scrapeContent(URL)
