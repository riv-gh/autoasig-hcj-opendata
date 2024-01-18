export const START_SCHEDULER_TIME = '4:00';
// [строка] час у якій запускати основний процес
export const USE_FETCH = true; 
// [true або false] використовувати fetch або pptr
export const FILES_FOLDER = 'data';
// [строка] папка для збереження файлів помісячно
// export const MERGED_TO_ONE_FILE = false;
// // [true або false] чи об'єднувати в один файл (варіант true в розробці)
export const TYPE_OF_RAW_DATA_PROCESSING = 'MERGED_TO_ONE';
// ['MERGED_TO_ONE', 'PER_MONTH'] один з варіантів
// MERGED_TO_ONE - об'єднувати в один результуючий файл
// PER_MONTH - обробляти кожен місяць окремо
export const MERGED_FILE_FOLDER = 'merged';
// [строка] папка для збереження файлу об'єднання
export const MERGED_FILE_NAME = 'data_merged.json';
// [строка] ім'я файлу об'єднання
export const RESULT_FILE_FOLDER = 'result';//'..';
// [строка] папка для збереження результуючого файлу
// (.. - повернення на директорію вище)
export const RESULT_FILE_NAME = 'data_result.json';
// [строка] результуючого файлу (розташовано в папці об'єднання)
export const REPORTS_FILES_FOLDER = 'reports';
// [строка] папка звітів авторозподілу
export const DOWNLOAD_REPORTS = true;
// [true або false] чи завантажувати звітів
export const FIND_BY_GET_DATE = true;
// [true або false] шукати справи по даті отримання (true)
// або по даті розподілу(false)
// !!! у разі зміни типу бажано завантажити всі данні щоб уникниути втрат
export const START_YEAR = 2014;
// [число] розпочати з року
export const STOP_YEAR = 2015;
// [число] закінчити до року (НЕ включно)
export const CLEAR_OLD_DATA = true;//false;
// [true або false] видалити старі завантаження
export const FROM_LAST_DATE_TO_NOW = true;
// [true або false] від останнього завантаженого до поточної дати
// або START_YEAR (у разі відсутності)
// (ігнорує параметри діапазону дат [START_YEAR, STOP_YEAR]
// але залежить від LOAD_NEW_DATA)
export const LOAD_NEW_DATA = true;
// [true або false] збирати данні з сайту
export const CREATE_MREGED_FILE = true;
// [true або false] об'єднувати файли в один
export const CREATE_RESULT_FILE = true;
// [true або false] обробити об'єдананний файл і створити результуючий
// (потребує наявності об'єднаного файлу)
export const ADD_IMP_NUM_RESULT_FILE = true;
// [true або false] Додати номер впровадження до результуючого файлу
// (потребує наявності результуючого файлу)
export const RESULT_IMP_NUM_FILE_NAME = 'data_result_imp_num.json';
// [строка] результуючого файлу з номером впровадження (розташовано в папці об'єднання)
export const PARSE_REPORT = true;
// [true або false] чи дизагрегувати данні з звітів авторозподілу
export const RESULT_REPORT_PARSED_FILE = 'data_result_parsed.json';
// ім'я обробленого файлу
export const DISPLAY_BROWSER_WINDOW = false;
// [true або false] обробити об'єдананний файл і створити результуючий
// для відладки та пошуку проблем у разі використання pptr (USE_FETCH=false)