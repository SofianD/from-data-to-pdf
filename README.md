# from-data-to-pdf
This library converts html files, URL and character string from html files to PDF files or PDF buffer.

## Installation
```$ npm i from-data-to-pdf```

# Usage

## getPdf(targets: FileBuffer[], save?: string): Promise<FileBuffer[]>
-   targets:
    * list of [FileBuffer](#FileBuffer).
-   save:
    * is optionnal, is `false` by default.
    * type `boolean`.
    * `true` to save targets.

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

## fromHtmlFileToPdf(files: HTMLTarget[], path?: string): Promise<FileBuffer[]>
-   files:
    * list of [HTMLTarget](#HTMLTarget).
-   save:
    * type `boolean`.
    * `true` to save targets.
-   path: 
    * is optionnal.
    * Absolute path of the folder containing your html files.

> ***CSS must be in your html files.***

```js
async function main() {
    const dataToPdf = require("from-data-to-pdf");

    const data = [
        {
            projectName: "Test1",
            fileName: "project1.html"
        }
    ];

    const listOfPdfBuffer = await dataToPdf.fromHtmlFileToPdf(data, true);

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

# Models

## HTMLTarget
```ts
export interface HTMLTarget {
    projectName: string,
    fileName: string,
    pdfOptions: PdfOptions,
}
``` 

## FileBuffer
```ts
export interface FileBuffer {
    name: string,
    url?: string,
    text?: string,
    buffer?: Buffer,
    options?: puppeteer.PDFOptions,
    pathOfsavedFile?: string,
    htmlOptions?: any[],
    error?: any,
}
``` 

## puppeter.PDFOptions

> Check [puppeteer.PDFOptions](https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagepdfoptions) for more informations.
