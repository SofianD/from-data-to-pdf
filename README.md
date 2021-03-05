# from-data-to-pdf
This library converts html files, URL and character string from html files to PDF files or PDF buffer.

## Installation
```$ npm i from-data-to-pdf```

# Usage

## getPdfAndSave(targets: FileBuffer[]): Promise<FileBuffer[]>
1.   targets:
    * list of [FileBuffer](#<FileBuffer>)

```js
async function main() {
    const dataToPdf = require("from-data-to-pdf");

    const listOfSavedPdf = await dataToPdf.getPdfAndSave(
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

    console.log(listOfSavedPdf);
    // Display:
    // [
    //     {
    //         name: 'Google',
    //         pathOfsavedFile: '<your project path>/temp/generatedPdf/Google1614854566504.pdf',
    //     },
    //     {
    //         name: 'String of html',
    //         pathOfsavedFile: '<your project path>/temp/generatedPdf/Strin-of-html1614854568915.pdf',
    //     }
    // ]
}
main();
```

## getPdf(targets: FileBuffer[]): Promise<FileBuffer[]>
1.   targets:
    * list of [FileBuffer](#<FileBuffer>)

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

## fromHtmlFileToPdfAndSave(files: HTMLTarget[], path?: string): Promise<FileBuffer[]>
1.   files:
    * list of [HTMLTarget](#<HTMLTarget>)
2.   path: 
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

    const listOfSavedPdf = await dataToPdf.fromHtmlFileToPdfAndSave(data);

    console.log(listOfSavedPdf);
    // Display:
    // [
    //     {
    //         name: 'Test1',
    //         pathOfsavedFile: '<your project>/temp/generatedPDF/Test11614887750982.pdf'
    //     }
    // ]
}
main();
```

## fromHtmlFileToPdf(files: HTMLTarget[], path?: string): Promise<FileBuffer[]>
1.   files:
    * list of [HTMLTarget](#<HTMLTarget>)
2.   path: 
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

# Models

## <HTMLTarget>
```ts
export interface HTMLTarget {
    projectName: string,
    fileName: string,
    pdfOptions: PdfOptions,
}
``` 

## <FileBuffer>
```ts
export interface FileBuffer {
    name: string,
    url?: string,
    text?: string,
    buffer?: Buffer,
    options?: PdfOptions,
    pathOfsavedFile?: string,
    htmlOptions?: any[],
    error?: any,
}
``` 

## <PdfOptions>

> Check [puppeteer.PDFOptions](https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagepdfoptions) for more informations.

```ts
export interface PdfOptions {
    path?: string,
    scale?: number,
    displayHeaderFooter?: boolean,
    headerTemplate?: string,
    footerTemplate?: string,
    printBackground?: boolean,
    landscape?: boolean,
    pageRanges?: string,
    format?: string,
    width?: string | number,
    height?: string | number,
    margin?: {
        top?: string | number,
        right?: string | number,
        bottom?: string | number,
        left?: string | number,
    },
    preferCSSPageSize?: boolean
}
``` 