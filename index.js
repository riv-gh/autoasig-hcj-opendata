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
    ADD_IMP_NUM_RESULT_FILE,
    RESULT_IMP_NUM_FILE_NAME,
    DISPLAY_BROWSER_WINDOW,
} from './CONFIG.module.js'

import getMountDateToFile from './modules/autoassig.module.js';
import filesToOneFile from './modules/filesToOneFile.module.js';
import dataReconst from './modules/dataReconst.module.js';
import getReports from './modules/getReports.module.js';

 
import fs from 'fs';
import path from 'path';

const delay = 1000;

(async () => {
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
                await getMountDateToFile(m, y, FILES_FOLDER, false, DISPLAY_BROWSER_WINDOW);
                // console.log(`await getMountDateToFile(${m}, ${y}, ${FILES_FOLDER}, false);`);
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
                    await getMountDateToFile(m, y, FILES_FOLDER, FIND_BY_GET_DATE, FIND_BY_GET_DATE);
                }
            }
        }

        console.log('Данні з сайту зібрано!');
    }
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
                                .map(dataItem=>({
                                    impNum: (
                                        /\d+/.exec(
                                            fs.readFileSync(path.resolve(
                                                REPORTS_FILES_FOLDER,
                                                dataItem.assigArr[0].num+'.txt'                
                                            )).toString()
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
                    
                },delay)
            },delay);
        },delay);
    }, delay);

})();