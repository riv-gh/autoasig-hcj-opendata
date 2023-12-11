// const puppeteer = require('puppeteer');
// import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

import { twoDig } from './functions.module.js';

const getMounthDateToFile = async (mounth, year, folder='test', fromGetDate=false, visible=false) => {

    const getStartStopDates = (m, y) => {
        const m2 = m===12 ? 1 : m+1;
        const y2 = m===12 ? y+1 : y;
        const date1 = `01.${twoDig(m)}.${y}`;
        const date2 = `01.${twoDig(m2)}.${y2}`;
        return [date1, date2];
    }

    const [dateStart, dateStop] = getStartStopDates(mounth, year)
    let startPos = 0;
    let recordsCount = Infinity;
    let dataArr = [];
    const dateType = !fromGetDate ? 'nadhodgennya' : 'rozpodil'; //немного напутано на бекнде
    do{
        const response = await fetch("https://court.gov.ua/post_test_vrp.php", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://court.gov.ua/autoassig_vrp",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `sEcho=3&iColumns=7&sColumns=&iDisplayStart=${startPos}&iDisplayLength=10&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=false&sSearch_1=&bRegex_1=false&bSearchable_1=false&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=false&sSearch_5=&bRegex_5=false&bSearchable_5=false&sSearch_6=&bRegex_6=false&bSearchable_6=false&q_ver=arbitr&date=${dateStart}~${dateStop}&q_ver=arbitr&date2=${dateStart}~${dateStop}&q_ver=arbitr&date_selected=${dateType}&cspec=0&sSearch=`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });


        const responseJson = await response.json()

        // console.log(responseJson)

        recordsCount = responseJson.iTotalDisplayRecords;
        // console.log(recordsCount)
        dataArr = dataArr.concat(responseJson.aaData);
        startPos+=10;
        console.log(`Данні за ${twoDig(mounth)}.${year} завантаження: ${startPos}/${recordsCount}`);
        // console.log(dataArr.length)
    } while(startPos<=recordsCount)
    // console.log(dataArr)

    if (dataArr.length>0) {
        dataArr = dataArr.map(dataItem=>[
            dataItem[0],
            dataItem[1],
            dataItem[2],
            dataItem[3],
            // dataItem[4],
            dataItem[5],
            dataItem[6].replace("<a href='",'').replace("' target='_blank'>Звіт авторозподілу</a>",''),
            //!!! потрібно переробити
        ])
        dataArr = Array.from(new Set(
            dataArr.map(dataItem=>JSON.stringify(JSON.stringify(dataItem)))
        ));
        const fileName = `data_${year}_${twoDig(mounth)}.json`;
        fs.writeFileSync (path.resolve(folder,fileName), JSON.stringify(dataArr));
        console.log(`Данні за ${twoDig(mounth)}.${year} збережені в файлі ${fileName}`);
    }
    else {
        console.log(`Данні за ${twoDig(mounth)}.${year} відсутні!`);
    }
}

export default getMounthDateToFile;