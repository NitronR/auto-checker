import Papa from "papaparse";

export function readCsvFiles(files, mapping) {
    let objectsByFile = [];

    return readFiles(files).then(fileContents => {

        objectsByFile = fileContents.map(fileContent => {
            let rows = Papa.parse(fileContent.contents, {
                header: true
            }).data;


            // TODO validation
            let objects = rows.map(row => {
                const object = {}

                for (let rowField in row) {
                    object[mapping[rowField]] = row[rowField]
                }

                return object
            });

            return { fileName: fileContent.name, objects }
        });

        return objectsByFile;
    });
}

function readFiles(files) {
    return new Promise((resolve, reject) => {
        const filePromises = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            filePromises.push(new Promise((resolveFile, rejectFile) => {
                const reader = new FileReader();

                reader.addEventListener('load', (event) => {
                    const contents = event.target.result;
                    const fileName = file.name;
                    resolveFile({ name: fileName, contents: contents });
                });

                reader.addEventListener('error', (event) => {
                    const fileName = file.name;
                    rejectFile(new Error(`Error reading file ${fileName}: ${event.target.error}`));
                });

                reader.readAsText(file);
            }));
        }

        Promise.all(filePromises)
            .then(resolve)
            .catch(reject);
    });
}

export function removeExtension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
}