export const USE_FETCH = true; 
// [true або false] використовувати fetch або pptr
export const FILES_FOLDER = 'test';//'data';
// [строка] папка для збереження файлів помісячно
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
export const DOWNLOAD_REPORTS = false//true;
// [true або false] чи завантажувати звітів
export const FIND_BY_GET_DATE = false;//true;
// [true або false] шукати справи по даті отримання (true)
// або по даті розподілу(false)
// !!! у разі зміни типу бажано завантажити всі данні щоб уникниути втрат
export const START_YEAR = 2014;
// [число] розпочати з року
export const STOP_YEAR = 2024;
// [число] закінчити до року (НЕ включно)
export const CLEAR_OLD_DATA = false;
// [true або false] видалити старі завантаження
export const FROM_LAST_DATE_TO_NOW = true;
// [true або false] від останнього завантаженого до поточної дати
// (ігнорує параметри діапазону дат [START_YEAR, STOP_YEAR]
// але залежить від LOAD_NEW_DATA)
export const LOAD_NEW_DATA = false;//true;
// [true або false] збирати данні з сайту
export const CREATE_MREGED_FILE = false;//true;
// [true або false] об'єднувати файли в один
export const CREATE_RESULT_FILE = false//true;
// [true або false] обробити об'єдананний файл і створити результуючий
// (потребує наявності об'єднаного файлу)
export const ADD_IMP_NUM_RESULT_FILE = true;
// [true або false] Додати номер впровадження до результуючого файлу
// (потребує наявності результуючого файлу)
export const RESULT_IMP_NUM_FILE_NAME = 'data_result_imp_num.json';
// [строка] результуючого файлу з номером впровадження (розташовано в папці об'єднання)

export const PARSE_REPORT = true;
export const RESULT_REPORT_PARSED_FILE = 'data_result_parsed.json';


export const DISPLAY_BROWSER_WINDOW = true;
// [true або false] обробити об'єдананний файл і створити результуючий
// для відладки та пошуку проблем