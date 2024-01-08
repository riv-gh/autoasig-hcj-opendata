import fs from 'fs';
import iconv from 'iconv-lite';

const saveReportFromLink = async (log, doc, filePath) => {
    const reportText = await getReport(log, doc);
    fs.writeFileSync(filePath, reportText);
}

async function getReport(log = 38286393, doc = 38288769) {
    const response = await fetch("https://court.gov.ua/logs.php", {
        "headers": {
            "accept": "text/plain, */*; q=0.01",
            "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        // "referrer": "https://court.gov.ua/autoassig_vrp_log/38212011/38222911",
        "referrer": `https://court.gov.ua/autoassig_vrp_log/${doc}/${log}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        // "body": "doc_ver=54_2&did=38222911&ddid=9993",
        "body": `doc_ver=54_2&did=${log}&ddid=9993`,
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });


    const contentType = response.headers.get('content-type');
    console.log(contentType)

    const responseArrayBuffer = await response.arrayBuffer();

    // const responseBuffer = new Buffer(responseArrayBuffer)
    const responseBuffer = Buffer.from(responseArrayBuffer)

    return (iconv.decode(responseBuffer, 'windows-1251')).trim()
}

export default saveReportFromLink;