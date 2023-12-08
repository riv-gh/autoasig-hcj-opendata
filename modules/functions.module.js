export function getParamsFromUrl(url) {
    const params = {};
    const regex = /([?&]\w+=[^&]*)/g;
    let match;
    while (match = regex.exec(url)) {
        let [name, value] = match[1].substring(1).split('=');
        params[name] = value;
    }
    return params;
}

export function parseDate(dateString) {
    const parts = dateString.split(/[\.\s\:]/)
    const date = new Date(+parts[2], +parts[1]-1, +parts[0], parts[3], parts[4], 0)
    return date
}

export function dateReverseFormat(dateString) {
    return new Date(dateString.trim().split('.').toReversed().join('-'));
}

export function getParsedDateFromString(stringWithDate) {
    const dateStringReg = /\d+\.\d\d\.\d\d\d\d\s\d+\:\d\d\:\d\d/; ///\d+\.\d{2}\.\d{4}\s\d{2}:\d{2}:\d{2}/
    return parseDate(dateStringReg.exec(stringWithDate).toString());
}

export function twoDig(num) {
    return String(num).padStart(2, '0');
}