# from-data-to-pdf
This library converts html files to PDF files or PDF buffer.

Is working for:
-   URL.
-   local html files.
-   html as string.
-   text.

## Installation
```$ npm i from-data-to-pdf```

# Usage

## getPdf(targets: [FileBuffer](#FileBuffer), save: string, path?: string): Promise<FileBuffer[]>
-   targets:
    * list of [FileBuffer](#FileBuffer).
-   save:
    * type `boolean`.
    * `true` to save targets, `false` to get buffers.
-   path:
    * is optionnal.
    * type `string`.

```js
const dataToPdf = require("from-data-to-pdf");

main();

async function main() {
    const data =[
        {
            name: 'Google',
            url: 'https://www.google.com'
        },
        {
            name: 'String of html',
            text: '<html string>'
        }
    ];

    const listOfSavedFiles = await dataToPdf.getPdf(data, true, 'C:/Users/Me/Documents/MyPDF/');

    console.log(listOfSavedFiles);
    // Display:
    // [
    //     {
    //         name: 'Google',
    //         pathOfsavedFile: 'C:/Users/Me/Documents/MyPDF/google15156514.pdf'
    //     },
    //     {
    //         name: 'String of html',
    //         pathOfsavedFile: 'C:/Users/Me/Documents/MyPDF/string-of-html15156515.pdf'
    //     }
    // ]
}

```

## fromHtmlFileToPdf(files: [HTMLTarget](#HTMLTarget), save: boolean, path?: [Path](#Path)): Promise<FileBuffer[]>
-   files:
    * list of [HTMLTarget](#HTMLTarget).
-   save:
    * type `boolean`.
    * `true` to save targets, `false` to get buffers.
-   path: 
    * is optionnal.
    * type [Path](#Path).
    * /!\ relative path starts from the app directory.

> ***CSS must be in your html files.***

```js
const dataToPdf = require("from-data-to-pdf");

main();

async function main() {
    const data = [
        {
            projectName: "Mon Fichier",
            fileName: "project1.html"
        }
    ];

    // If this is my first time using this package and I don't have a custom path to get templates.
    // I run the function below once:
    await dataToPdf.initDefaultFolder();
    // Now, I move my html files in the created folder: my-app/temp/target/
    // Then:

    const listOfSavedPDF = await dataToPdf.fromHtmlFileToPdf(data, true);
    console.log(listOfSavedPDF);
    // Display:
    // [
    //     {
    //         name: 'Test',
    //         pathOfsavedFile: 'my-app/temp/generatedPDF/Mon-Fichier1561654165.pdf'
    //     }
    // ]


    // Else if I have custom path:
    const listOfSavedPDF = await dataToPdf.fromHtmlFileToPdf(data, true, {
        toGetFiles: 'C:/Users/Me/Documents/MyTemplates/',
        toSaveFiles: 'C:/Users/Me/Documents/MyPDF/'
    });

    console.log(listOfSavedPDF);
    // Display:
    // [
    //     {
    //         name: 'Test',
    //         pathOfsavedFile: 'C:/Users/Me/Documents/MyPDF/mon-fichier1561654165.pdf'
    //     }
    // ]
}

```

# Models

## HTMLTarget
```ts
export interface HTMLTarget {
    projectName: string;
    fileName: string;
    pdfOptions: PdfOptions;
}
``` 

## FileBuffer
```ts
export interface FileBuffer {
    name: string;
    url?: string;
    text?: string;
    buffer?: Buffer;
    options?: puppeteer.PDFOptions;
    pathOfsavedFile?: string;
    error?: any;
}
``` 

## Path
```ts
export interface Path {
    toGetFiles?: string;
    toSaveFiles?: string;
}
```

## puppeter.PDFOptions

> Check [puppeteer.PDFOptions](https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagepdfoptions) for more informations.
