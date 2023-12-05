import {
    FILES_FOLDER,
    MERGED_FILE_FOLDER,
    MERGED_FILE_NAME,
    RESULT_FILE_FOLDER,
    RESULT_FILE_NAME,
    REPORTS_FILES_FOLDER,
    DOWNLOAD_REPORTS,
    FIND_BY_GET_DATE,
    START_YEAR,
    STOP_YEAR,
    CLEAR_OLD_DATA,
    FROM_LAST_DATE_TO_NOW,
    LOAD_NEW_DATA,
    CREATE_MREGED_FILE,
    CREATE_RESULT_FILE,
    DISPLAY_BROWSER_WINDOW,
} from './../CONFIG.module.js'

import { getParamsFromUrl } from './functions.module.js';
import saveReportFromLink from './saveReportFromLink.module.js';

import fs from 'fs';
import path from 'path';
import puppteer from 'puppeteer';

const getReports = async (linksArr) => {
    const thisHeadless = DISPLAY_BROWSER_WINDOW ? false : "new";

    const browser = await puppteer.launch({
        headless: thisHeadless
    });


    const protocolObjArr = 
    linksArr
    // .splice(0,2)
    .map(link=>getParamsFromUrl(link))
    .map(param=>({
        name: `${param.doc}.txt`,
        link:`https://court.gov.ua/autoassig_vrp_log/${param.log}/${param.doc}`,
    }))
    for (let i=0; i<protocolObjArr.length; i++) {
        const { link, name, } =  { ...protocolObjArr[i] };
        const filePath = path.resolve(REPORTS_FILES_FOLDER, name);
        if (fs.existsSync(filePath)) {
            console.log(`Файл ${name} вже було збережено!`);
        }
        else {
            // console.log('Завантаження за посиланням: ' + link);
            await saveReportFromLink(
                link,
                filePath,
                browser,
            )
            console.log(`Збережено файл: ${name} (${i}/${protocolObjArr.length})`);
        }

    }

    // Try playing with process.stdout methods instead on console:

    // process.stdout.write("Hello, World");
    // process.stdout.clearLine(0);
    // process.stdout.cursorTo(0);
    // process.stdout.write("\n"); // end the line


    await browser.close();

}



export default getReports; 