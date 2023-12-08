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
    RESULT_IMP_NUM_FILE_NAME,
} from './CONFIG.module.js'


import saveReportFromLink from "./modules/saveReportFromLink.module.js";

import { dateReverseFormat, parseDate } from './modules/functions.module.js';

import fs from 'fs';
import path from 'path';
import puppteer from 'puppeteer';




// console.log(
//     fs.readdirSync(path.resolve(REPORTS_FILES_FOLDER))
//     // .splice(0,3)
//     .map(fileName=>fs.readFileSync(path.resolve(REPORTS_FILES_FOLDER,fileName)).toString())
//     // .map(buf=>buf.toString())
//     .map(text=>({
//         fullText: text,
//         lineArr:text.split('\n')
//     }))
//     .map(obj=>({
//         // ...obj,
//         documentName: obj.lineArr[0],
//         startDateTime: getParsedDateFromString(obj.lineArr[1]),
//         iteratorData: obj.fullText.split('\nI: ').map(iteratorDataItem=>iteratorDataItem.split('\n').map(line=>line.trim()))
//     }))
//     .filter(obj=>obj.documentName!=='Звіт про автоматизований розподіл судових справ між суддями')

//     .map(tmp=>tmp.iteratorData)[0]

// )


// console.log(
//     fs.writeFileSync('79857.json',
//     JSON.stringify(
//     JSON.parse(
//         fs.readFileSync(path.resolve(
//             RESULT_FILE_FOLDER,
//             RESULT_IMP_NUM_FILE_NAME
//         ))
//     )
//     .filter(dataItem=>dataItem.impNum==='79857')
//     // .map(dataItem=>({
//     //     ...dataItem,
//     //     assigArr: dataItem.assigArr.map(assigItem=>({
//     //         ...assigItem,
//     //         tmpLineArr: assigItem.reportFullText.split('\nI: ')
            
//     //     }))
//     // }))
//     // .map(dataItem=>dataItem.assigArr.map(el=>el.tmpLineArr.map(el=>el.indexOf('Всого членвів ВРП: ')!==-1)))
//     , null, '\t')
//     )
// )


fs.writeFileSync('79857_parsed.json',
// console.log(
JSON.stringify(
    JSON.parse(fs.readFileSync('79857.json'))
    .map(dataItem=>({
        ...dataItem,
        assigArr: dataItem.assigArr.map(assigItem=>({
            ...assigItem,
            assigMembersData: (
                assigItem.reportFullText
                .split('\n')
                .filter(line=>/^\d+\s/.test(line))
                .map(line=>(
                    line.replace(/^\d+\s+/gi,'')
                    .split(';')
                    .map(item=>item.trim())
                ))
                .map(arr=>{
                    // return arr;
                    const [member, periodStart, periodStop] = arr[0].split(/\s+період з\s+|\s+до\s+/)
                    // const weight = arr.find(item=>item.indexOf(/Матеріалів розподілено\(приведена вага\)\:\s+/)==0)
                    const weight = +arr.find(item=>item.indexOf('Матеріалів розподілено')===0).split(':')[1].trim().replace(',','.');
                    const interval = arr.find(item=>item.indexOf('Інтервал')===0).split(' ')[1].split('-').map(str=>+str);
                    const workedDay = +arr.find(item=>item.indexOf('Відпрацьовано:')===0).split(':')[1].trim();
                    const kn = +arr.find(item=>item.indexOf('КН')===0).split(' ')[1].trim().replace(',','.');
                    const kap = +arr.find(item=>item.indexOf('КАП')===0).split(' ')[1].trim().replace(',','.');

                    // const kap = 
                    // return null
                    return {
                        member,
                        priod: [dateReverseFormat(periodStart), dateReverseFormat(periodStop)],
                        workedDay,
                        weight,
                        kn,
                        interval,
                        kap,
                    }
                })
                
            ),
        }))
    }))
,null, '  ')
)