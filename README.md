# nHTMLToPDF
This library converts html files and URL to PDF files or PDF buffer.

## Installation
```$ npm i from-data-to-pdf```

## USAGE
```js
    async function main() {
        const listOfSavedPdf = await dataToPdf.getPdfAndSave(
            './temp/', 
            [
                {
                    name: "Google",
                    url: 'https://www.google.com'
                },
                {
                    name: "String of html",
                    text: "<string>"
                }
            ]
        );

        const listOfPdfBuffer = await dataToPdf.getPdf(
            [
                {
                    name: "Google",
                    url: 'https://www.google.com'
                },
                {
                    name: "String of html",
                    text: "<string>"
                }
            ]
        );
    }
    main();
```