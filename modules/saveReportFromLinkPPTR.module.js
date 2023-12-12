import puppteer from 'puppeteer';
import fs from 'fs';

const saveReportFromLink = async (link, filePath, browserHandle) => {
    const visible = true;
    const thisHeadless = visible ? false : "new";

    const browser = browserHandle ? browserHandle : (
        await puppteer.launch({
            headless: thisHeadless
        })
    );

    const page = await browser.newPage();
    await page.goto(link);
    await page.waitForSelector('.modal-body>p>p');
    const reportText = await page.$eval('.modal-body>p', el=>el.textContent.trim());
    await page.waitForTimeout(100)
    fs.writeFileSync(filePath,reportText);
    await page.close();
    if (!browserHandle) {
        await browser.close()
    }
}

export default saveReportFromLink;