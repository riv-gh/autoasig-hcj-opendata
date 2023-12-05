import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';


const filesToOneFile = async (folerOfFiles, mergedFileFolder, mergedFileName) => {

    const mergedFilePath = path.resolve(mergedFileFolder, mergedFileName);


    Promise.all(
        fs.readdirSync(path.resolve(folerOfFiles))
        .map(fileName => (
            fsp.readFile(path.resolve(folerOfFiles, fileName))
        ))

    )
    .then(fileData=> {
        fs.writeFile(
            mergedFilePath,
            JSON.stringify(
                Array.from(
                    new Set(
                        [].concat(
                            ...fileData
                            .map(buf=>buf.toString())
                            .map(json=>(
                                JSON.parse(json)
                            ))
                        )
                        .map(json=>(
                            JSON.parse(
                                JSON.parse(json)
                            )
                        ))
                    )
                )
            ),
            (err) => {
                if (err) {
                    console.log('Сталася помилка!')
                    console.log('Детальніше:')
                    console.error(err)
                }
                else{
                    // console.log(`Файл збережено за розташуванням:\n ${mergedFilePath}`)
                }
            }
        )

    })
}

export default filesToOneFile;