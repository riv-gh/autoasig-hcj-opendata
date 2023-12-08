// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

import { twoDig } from './functions.module.js';

const getMounthDateToFile = async (mounth, year, folder='data', fromGetDate=false, visible=false) => {

    // const puppeteer = require('puppeteer');
    const thisHeadless = visible ? false : "new";

    const browser = await puppeteer.launch({
        headless: thisHeadless
    });
    const page = await browser.newPage();
    await page.goto('https://court.gov.ua/autoassig_vrp');

    const setMounthYear = async (m, y) => {
        const m2 = m===12 ? 1 : m+1;
        const y2 = m===12 ? y+1 : y;
        const date1 = `01.${twoDig(m)}.${y}`;
        const date2 = `01.${twoDig(m2)}.${y2}`;

        const radioButtonSelector = fromGetDate ? 'input[value="nadhodgennya"]' : 'input[value="rozpodil"]';
        const startDateSelector = fromGetDate ? 'input#sdate' : 'input#sdate2';
        const stopDataSelector = fromGetDate ? 'input#edate' : 'input#edate2';

        await page.click(radioButtonSelector);

        await page.$eval(startDateSelector, (input, date)=>input.value=date, date1);
        await page.$eval(stopDataSelector, (input, date)=>input.value=date, date2);
    }
    
    const doSearch = async () => {
        const searchButtonSelector = 'button#search';
        await page.click(searchButtonSelector);
    }
    
    const nextPageAvaliable = async () => {
        const nextPageLink = 'a#bank_next';
        const nextPageEnabled = await page.$eval(nextPageLink,el=>!el.classList.contains('disabled'));
        return nextPageEnabled;
    }
    const nextPageNotAvaliable = async () => {
        return (
            !(await nextPageAvaliable())
        )
    }

    const goNextPage = async () => {
        const nextPageLink = 'a#bank_next';
        const nextPageEnabled = await page.$eval(nextPageLink,el=>!el.classList.contains('disabled'));
        if (nextPageEnabled) {
            await page.click(nextPageLink);
        }
        return nextPageEnabled;
    }
    
 

    const dataIsReddy = async () => {
        const waitElementSelector = 'div#bank_processing';
        const isWaitElHide = async ()=>{
            return await page.$eval(waitElementSelector, el=>el.style.visibility === 'hidden')
        }
        await page.waitForSelector(waitElementSelector);
        while (!isWaitElHide) {
            console.log('is wait')
        }
        return true;
    }
    
    const getDataFromPage = async () => {
        const dateTableSelector = 'table#bank tbody';
        return (
            await page.$eval(dateTableSelector, dataEl=>{
                return (
                    Array.from(dataEl.querySelectorAll('tr'))
                    .map(lineEl=>(
                        Array.from(lineEl.children)
                        .map(tdEl=>(
                            tdEl.querySelector('a')?.href || tdEl.textContent
                        ))
                    ))
                )
            })
        );
    }

    const doWait = async (milisec = 5000) => {
        await page.waitForTimeout(milisec);
    }

    // let dataArr = [];
    await setMounthYear(mounth,year);
    await doSearch();
    await doWait();
    // let dataArr = await getDataFromPage();

    let dataSet;
    let tmpDataArr;
    let hasNextPage;

    dataSet = new Set()
    tmpDataArr = await getDataFromPage();
    tmpDataArr.map(arr=>JSON.stringify(arr)).forEach(json=>dataSet.add(json))
    hasNextPage = await nextPageAvaliable();
    while(hasNextPage) {
        await goNextPage();
        await doWait();
        tmpDataArr = await getDataFromPage();
        tmpDataArr.map(arr=>JSON.stringify(arr)).forEach(json=>dataSet.add(json))
        hasNextPage = await nextPageAvaliable();
    }

    const dataArr = Array.from(dataSet).map(json=>JSON.stringify(json));
    if (dataArr[0]==='"[\\"Справи відсутні\\"]"') {
        console.log(`Данні за ${twoDig(mounth)}.${year} відсутні!`);
    }
    else {
        const fileName = `data_${year}_${twoDig(mounth)}.json`;
        // fs.writeFile(path.resolve(folder,fileName),JSON.stringify(dataArr), ()=>{
        //     console.log(`Данні за ${mounth}.${year} збережені в файлі ${fileName}`);
        // });
        fs.writeFileSync (path.resolve(folder,fileName), JSON.stringify(dataArr));
        console.log(`Данні за ${twoDig(mounth)}.${year} збережені в файлі ${fileName}`);

        await doWait(1000);
    }
    await browser.close();
}

export default getMounthDateToFile;