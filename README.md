# from-data-to-pdf
This library converts html files, URL and character string from html files to PDF files or PDF buffer.

## Installation
```$ npm i from-data-to-pdf```

# Usage

## getPdfAndSave(targets: FileBuffer[]): Promise<FileBuffer[]>
```js
async function main() {
    const dataToPdf = require("from-data-to-pdf");

    const listOfSavedPdf = await dataToPdf.getPdfAndSave(
        [
            {
                name: 'Google',
                url: 'https://www.google.com',
                options: {}
            },
            {
                name: 'String of html',
                text: '<string>',
                options: {}
            }
        ]
    );

    console.log(listOfSavedPdf);
    // Display:
    // [
    //     {
    //         name: 'Google',
    //         pathOfsavedFile: '<your project path>/temp/generatedPdf/Google1614854566504.pdf',
    //         done: true
    //     },
    //     {
    //         name: 'String of html',
    //         pathOfsavedFile: '<your project path>/temp/generatedPdf/Strin-of-html1614854568915.pdf',
    //         done: true
    //     }
    // ]
}

main();
```

## getPdf(targets: FileBuffer[]): Promise<FileBuffer[]>
```js
async function main() {
    const dataToPdf = require("from-data-to-pdf");

    const listOfPdfBuffer = await dataToPdf.getPdf(
        [
            {
                name: 'Google',
                url: 'https://www.google.com'
            },
            {
                name: 'String of html',
                text: '<string>'
            }
        ]
    );
    
    console.log(listOfPdfBuffer);
    // Display:
    // [
    //     {
    //         name: 'Google',
    //         buffer: [binary data...]
    //     },
    //     {
    //         name: 'String of html',
    //         buffer: [binary data...]
    //     }
    // ]

}

main();
```

## fromHtmlFileToPdfAndSave(files: HTMLTarget[]): Promise<FileBuffer[]>
```js
async function main() {
    const dataToPdf = require("from-data-to-pdf");

    const data = [
        {
            projectName: "Test1",
            fileName: "project1.html"
        }
    ];

    const listOfSavedPdf = await dataToPdf.fromHtmlFileToPdfAndSave(data);

    console.log(listOfSavedPdf);
    // Display:
    // [
    //     {
    //         name: 'Test1',
    //         done: true,
    //         pathOfsavedFile: '<your project>/temp/generatedPDF/Test11614887750982.pdf'
    //     }
    // ]
}

main();
```

## fromHtmlFileToPdf(files: HTMLTarget[]): Promise<FileBuffer[]>
```js
async function main() {
    const dataToPdf = require("from-data-to-pdf");

    const data = [
        {
            projectName: "Test1",
            fileName: "project1.html"
        }
    ];

    const listOfPdfBuffer = await dataToPdf.fromHtmlFileToPdfAndSave(data);

    console.log(listOfPdfBuffer);
    // Display:
    // [
    //     {
    //         name: 'Test1',
    //         pathOfsavedFile: <Buffer>
    //     }
    // ]
}

main();
```