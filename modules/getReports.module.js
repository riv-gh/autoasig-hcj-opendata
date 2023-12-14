import {
    REPORTS_FILES_FOLDER,
    DISPLAY_BROWSER_WINDOW,
    USE_FETCH,
} from '../CONFIG.js'

import { getParamsFromUrl } from './functions.module.js';
import saveReportFromLinkPPTR from './saveReportFromLinkPPTR.module.js';
import saveReportFromLinkFetch from './saveReportFromLinkFetch.module.js';

import fs from 'fs';
import path from 'path';
import puppteer from 'puppeteer';

const getReports = async (linksArr) => {
    if (USE_FETCH) {
        const protocolObjArr = 
        linksArr
        // .splice(0,2)
        .map(link=>getParamsFromUrl(link))
        .map(param=>({
            ...param,
            name: `${param.doc}.txt`,
        }));
        for (let i=0; i<protocolObjArr.length; i++) {
            const { log, doc, name, } =  { ...protocolObjArr[i] };
            const filePath = path.resolve(REPORTS_FILES_FOLDER, name);
            if (fs.existsSync(filePath)) {
                console.log(`Файл ${name} вже було збережено!`);
            }
            else {
                // console.log('Завантаження за посиланням: ' + link);
                await saveReportFromLinkFetch(
                    log, doc, filePath,
                )
                console.log(`Збережено файл: ${name} (${i}/${protocolObjArr.length})`);
            }
        }
    }
    else {
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
        }));
        for (let i=0; i<protocolObjArr.length; i++) {
            const { link, name, } =  { ...protocolObjArr[i] };
            const filePath = path.resolve(REPORTS_FILES_FOLDER, name);
            if (fs.existsSync(filePath)) {
                console.log(`Файл ${name} вже було збережено!`);
            }
            else {
                // console.log('Завантаження за посиланням: ' + link);
                await saveReportFromLinkPPTR(
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
    

}



export default getReports; 