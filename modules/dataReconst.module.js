import { getParamsFromUrl, parseDate, dateReverseFormat  } from './functions.module.js';

const dataReconst = (getDataArr) => {
    const dividedDataArr = 
    getDataArr
    // .slice(0,2)
    // .filter(lineArr=>lineArr[0]==='100/0/6-22'||lineArr[0]==='10192/0/8-21')
    // .filter(lineArr=>lineArr[0]==='100/0/6-22')
    // .filter(lineArr=>lineArr[0]==='10192/0/8-21')
    .toReversed()
    .filter(lineArr=>lineArr[0].trim()!=='') //прибираємо старе гімно в даних
    .map(lineArr => ({
        num: lineArr[0],
        id: getParamsFromUrl(lineArr[5]).log,
        regData: dateReverseFormat(lineArr[1]),
        persons: (()=>{
            const personsArr =
            lineArr[3]
            .split(',\n')
            .map(str=>str.trim())
            .map(line=>line.split(': ').toReversed())
            .map(arr=>(
                arr.join('').length //якщо поле не пусте
                ? { title:arr[1], name:arr[0] }
                : null
            ))
            .filter(personEl=>personEl!==null)

            return personsArr;
        })(),
        assigArr: [
            {
                member: lineArr[2],
                date: parseDate(lineArr[4]),
                num: getParamsFromUrl(lineArr[5]).doc,
                link: lineArr[5],
            }
        ],
    }))
    .map(dataItem => ({
        ...dataItem,
        assigArr: [{
            ...dataItem.assigArr[0],
            frameLink: `https://court.gov.ua/autoassig_vrp_log/${dataItem.id}/${dataItem.assigArr[0].num}`
        }]
    }))
    const unicDataArr = 
    Array.from(new Set(dividedDataArr.map(dataObj=>dataObj.num)))
    .map(num=>(
        dividedDataArr
        .filter(dataArr=>dataArr.num===num)
        .reduce((numData,line)=>(
            numData.num===undefined
            ?   line
            :   {
                    ...numData,
                    assigArr: numData.assigArr.concat(line.assigArr)
                }
        ),{assigArr:[]})
    ))
    // console.log(JSON.stringify(
    //     Array.from(unicDataArr)
    // , null, '  '))

    return unicDataArr;   
}

export default dataReconst;