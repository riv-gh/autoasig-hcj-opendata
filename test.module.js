import getMounthDateToFileFetch from "./modules/getMounthDateToFileFetch.module.js";
import getMounthDateToFilePPTR from "./modules/getMounthDateToFilePPTR.module.js";




await getMounthDateToFileFetch(11,2014,'test_fetch', true);
await getMounthDateToFilePPTR(11,2014,'test_pptr', true)