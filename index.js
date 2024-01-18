console.log('      __    __  __  ____  _____     ');
console.log('     /__\\  (  )(  )(_  _)(  _  )   ');
console.log('    /(__)\\  )(__)(   )(   )(_)(     ');
console.log('   (__)(__)(______) (__) (_____)    ');
console.log('        __    ___  ____  ___        ');
console.log('       /__\\  / __)(_  _)/ __)       ');
console.log('      /(__)\\ \\__ \\ _)(_( (_-.       ');
console.log('     (__)(__)(___/(____)\\___/       ');
console.log('        _   _  ___   ____           ');
console.log('       ( )_( )/ __) (_  _)          ');
console.log('        ) _ (( (__ .-_)(            ');
console.log('       (_) (_)\\___)\\____)           ');

import fs from 'fs';
import path from 'path';

const CONFIG_FILENAME = 'CONFIG.js';
let usedConfigFilename =  'CONFIG_DEFAULT.js';

if (!fs.existsSync(path.resolve(CONFIG_FILENAME))){
    console.log(
        `Файл ${CONFIG_FILENAME} відсутній!\n`+
        `Використовується файл конфгурації за замовченням ${usedConfigFilename}\n`+
        `Для своєї конфігурації створіть файл за шляхом:\n${path.resolve(CONFIG_FILENAME)}`
    )
}
else {
    usedConfigFilename = CONFIG_FILENAME;
}

import {
    USE_FETCH,
    FILES_FOLDER,
    MERGED_FILE_FOLDER,
    TYPE_OF_RAW_DATA_PROCESSING,
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
    ADD_IMP_NUM_RESULT_FILE,
    RESULT_IMP_NUM_FILE_NAME,
    PARSE_REPORT,
    RESULT_REPORT_PARSED_FILE,
    DISPLAY_BROWSER_WINDOW,
} from usedConfigFilename;

//додаємо toReversed у разі відсутності
if (!Array.prototype.toReversed) {
    Array.prototype.toReversed = function () {
        return Array.from(this).reverse();
    };
}

import getMounthDateToFilePPTR from './modules/getMounthDateToFilePPTR.module.js';
import getMounthDateToFileFetch from './modules/getMounthDateToFileFetch.module.js';
import filesToOneFile from './modules/filesToOneFile.module.js';
import dataReconst from './modules/dataReconst.module.js';
import getReports from './modules/getReports.module.js';

const getMounthDateToFile = USE_FETCH ? getMounthDateToFileFetch : getMounthDateToFilePPTR;
 
import { dateReverseFormat, parseDate } from './modules/functions.module.js';

const delay = 3000;

const tmp_nums = [];

(async () => {
    [
        FILES_FOLDER,
        MERGED_FILE_FOLDER,
        RESULT_FILE_FOLDER,
        REPORTS_FILES_FOLDER
    ]
    .forEach(folderName => {
        if (!fs.existsSync(folderName)){
            fs.mkdirSync(folderName);
        }
    })

    if (CLEAR_OLD_DATA) {
        console.log('Очищення старих файлів...');
        fs.readdirSync(path.resolve(FILES_FOLDER))
        .forEach(fileName=>{
            fs.unlinkSync(path.resolve(FILES_FOLDER,fileName))
        })
        console.log('Очищення старих файлів завершено');
    }
    if (LOAD_NEW_DATA) {
        console.log('Збираємо данні з сайту...');
        console.log(
            FIND_BY_GET_DATE
            ? 'За дату приймається дата НАДХОДЖЕННЯ!'
            : 'За дату приймається дата РОЗПОДІЛУ!'
        )
        if (FROM_LAST_DATE_TO_NOW) {
            const [ startYear, startMounth ] = 
                (
                    fs.readdirSync(FILES_FOLDER).at(-1) || //якщо папка пуста undefinded
                    `data_${START_YEAR}_01.json`
                )
                .split(/[_\.]/)
                .map(el=>+el)
                .filter(num=>!isNaN(num));
            const [ nowYear, nowMounth ] = 
                (new Date()).toISOString()
                .split('-')
                .map(el=>+el)
                .filter(num=>!isNaN(num));
            console.log(`Діапазон років пошуку: `+
                `${startMounth}.${startYear}-${nowMounth}.${nowYear}`);
            let y = startYear;
            let m = startMounth;
            do {
                await getMounthDateToFile(m, y, FILES_FOLDER, false, DISPLAY_BROWSER_WINDOW);
                // console.log(`await getMounthDateToFile(${m}, ${y}, ${FILES_FOLDER}, false);`);
                y = (m>=12) ? y+1 : y;
                m = (m>=12) ? 1 : m+1;
            } while (
                !(y>nowYear) &&
                !(m>nowMounth && y>=nowYear)
            )
        }
        else {
            console.log(`Діапазон років пошуку: ${START_YEAR}-${STOP_YEAR}`);
            for (let y=START_YEAR; y<STOP_YEAR; y++) {
                for (let m=1; m<13; m++) {
                    await getMounthDateToFile(m, y, FILES_FOLDER, FIND_BY_GET_DATE, FIND_BY_GET_DATE);
                }
            }
        }

        console.log('Данні з сайту зібрано!');
    }
    switch (TYPE_OF_RAW_DATA_PROCESSING) {
        case 'MERGED_TO_ONE':
            setTimeout(async()=>{
                if (CREATE_MREGED_FILE) {
                    console.log('Об\'єднуємо в один файл...');
                    await filesToOneFile(FILES_FOLDER, MERGED_FILE_FOLDER, MERGED_FILE_NAME);
                    console.log('Об\'єднуємо в один файл завершено!');
                }

                setTimeout(()=>{
                    if (CREATE_RESULT_FILE) {
                        console.log('Створення результуючого файлу...')
                        fs.writeFileSync(
                            path.resolve(
                                RESULT_FILE_FOLDER,
                                RESULT_FILE_NAME
                            ),
                            JSON.stringify(
                                dataReconst(
                                    JSON.parse(
                                        fs.readFileSync(path.resolve(
                                            MERGED_FILE_FOLDER,
                                            MERGED_FILE_NAME
                                        ))
                                    )
                                )
                            , null, '\t')
                        )
                        console.log('Створення результуючого файлу завершено!');
                        console.log('Ім\'я файлу: ' + RESULT_FILE_NAME);
                        console.log(
                            'Повинй шлях:\n'+
                            path.resolve( RESULT_FILE_FOLDER, RESULT_FILE_NAME )                
                        );
                    }
                    setTimeout(async()=>{
                        if (DOWNLOAD_REPORTS) {
                            console.log('Отримання протоколів та створення файлів...');
                                await getReports(
                                    JSON.parse(
                                        fs.readFileSync(path.resolve(
                                            MERGED_FILE_FOLDER,
                                            MERGED_FILE_NAME
                                        ))
                                    )
                                    .map(arr=>arr[5])
                                )
                            console.log('Отримання протоколів та створення файлів завершено!');
                        }
                        setTimeout(()=>{
                            if (ADD_IMP_NUM_RESULT_FILE) {
                                console.log('Додання номерів впровадження до результуючого файлу...');
                                fs.writeFileSync(
                                    path.resolve(
                                        RESULT_FILE_FOLDER,
                                        RESULT_IMP_NUM_FILE_NAME
                                    ),
                                    JSON.stringify(
                                        JSON.parse(
                                            fs.readFileSync(path.resolve(
                                                RESULT_FILE_FOLDER,
                                                RESULT_FILE_NAME
                                            ))
                                        )
                                        // .map(dataItem=>({
                                        //     impNum: (
                                        //         /\d+/.exec(
                                        //             fs.readFileSync(path.resolve(
                                        //                 REPORTS_FILES_FOLDER,
                                        //                 dataItem.assigArr[0].num+'.txt'                
                                        //             )).toString()
                                        //             .split('\n')
                                        //             .find(line=>line.indexOf('I: Номер провадження:')===0)
                                        //         )?.toString() || null
                                        //     ),
                                        //     ...dataItem,
                                        // })),
                                        .map(dataItem=>({
                                            ...dataItem,
                                            assigArr: dataItem.assigArr.map(assigItem=>({
                                                ...assigItem,
                                                reportFullText: (
                                                    fs.readFileSync(path.resolve(
                                                        REPORTS_FILES_FOLDER,
                                                        assigItem.num+'.txt'                
                                                    )).toString()
                                                )
                                            }))
                                        }))
                                        .map(dataItem=>({
                                            impNum: (
                                                /\d+/.exec(
                                                    dataItem.assigArr[0].reportFullText
                                                    .split('\n')
                                                    .find(line=>line.indexOf('I: Номер провадження:')===0)
                                                )?.toString() || null
                                            ),
                                            ...dataItem,
                                        })),
                                    null, '\t')
                                );
                                console.log('Додання номерів впровадження до результуючого файлу завершено!');
                            }
                            setTimeout(()=>{
                                if (PARSE_REPORT) {
                                    console.log('Аналізування тексту протоколів...')
                                    fs.writeFileSync(
                                        path.resolve(
                                            RESULT_FILE_FOLDER,
                                            RESULT_REPORT_PARSED_FILE
                                        ),
                                        JSON.stringify(
                                            JSON.parse(
                                                fs.readFileSync(path.resolve(
                                                    RESULT_FILE_FOLDER,
                                                    RESULT_IMP_NUM_FILE_NAME
                                                ))
                                            )
                                            .map(dataItem=>({
                                                ...dataItem,
                                                assigArr: dataItem.assigArr.map(assigItem=>({
                                                    ...assigItem,
                                                    assigMembersData: (
                                                        assigItem.reportFullText
                                                        .split('\n')
                                                        .filter(line=>/^\d+\s.+період/.test(line))
                                                        .map(line=>(
                                                            line.replace(/^\d+\s+/gi,'')
                                                            .split(';')
                                                            .map(item=>item.trim())
                                                        ))
                                                        .map(arr=>{
                                                            try {
                                                                // return arr;
                                                                const [member, periodStart, periodStop] = arr[0].split(/\s+період з\s+|\s+до\s+/)
                                                                // const weight = arr.find(item=>item.indexOf(/Матеріалів розподілено\(приведена вага\)\:\s+/)==0)
                                                                const weight = (
                                                                    +arr.find(item=>(
                                                                        item.indexOf('Матеріалів розподілено')===0 ||
                                                                        item.indexOf('Справ розглянуто')===0
                                                                    ))?.split(':')[1].trim().replace(',','.')
                                                                );
                                                                const interval = arr.find(item=>item.indexOf('Інтервал')===0)?.split(' ')[1].split('-').map(str=>+str);
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
                                                            }
                                                            catch(err) {
                                                                console.log(err, dataItem.num)
                                                                // tmp_nums.push({num: dataItem.num, id: dataItem.id})
                                                                tmp_nums.push(dataItem)
                                                            }
                                                            return null;
                                                        })
                                                        
                                                    ),
                                                }))
                                            }))

                                            // .filter(dataItem=>dataItem.num==='Л-184/0/7-22')
                                        ,null, '\t')
                                    );
                                    console.log(tmp_nums)
                                    fs.writeFileSync('test.json',JSON.stringify((
                                        Array.from(
                                            new Set(
                                                tmp_nums.map(el=>JSON.stringify(el))
                                            )
                                        )
                                        .map(json_el=>JSON.parse(json_el))
                                    ) ,null, '\t'));
                                    console.log('Аналізування тексту протоколів завершено!')
                                }
                            },delay)
                        },delay)
                    },delay);
                },delay);
            }, delay);
            break;
        case 'PER_MONTH':
            console.log('todo');
            
            break;
        default:
            console.warn(
                `Помилка в файлі конфігурації ${usedConfigFilename}: `+
                `параметр TYPE_OF_RAW_DATA_PROCESSING визначено не вірно`
            );
    }
})();