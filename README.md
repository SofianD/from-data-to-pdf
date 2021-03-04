# from-data-to-pdf
This library converts html files and URL to PDF files or PDF buffer.

## Installation
```$ npm i from-data-to-pdf```

## Usage
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
                name: 'My html code convert as string',
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
    //         name: 'My Html Page',
    //         pathOfsavedFile: '<your project path>/temp/generatedPdf/My-html-code-convert-as-string1614854565481.pdf',
    //         done: true
    //     }
    // ]


    // OR


    const listOfPdfBuffer = await dataToPdf.getPdf(
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
    
    console.log(listOfPdfBuffer);
    // Display:
    // [
    //     {
    //         name: 'Google',
    //         buffer: [binary data...]
    //     },
    //     {
    //         name: 'My Html Page',
    //         buffer: [binary data...]
    //     }
    // ]

}
main();
```