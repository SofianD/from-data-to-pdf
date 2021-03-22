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
async function main() {
    const dataToPdf = require("from-data-to-pdf");

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
main();
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
async function main() {
    const dataToPdf = require("from-data-to-pdf");

    // If I don't have custom path:
    await dataToPdf.initDefaultFolder();
    // Now, I move my html files in the created folder: my-app/temp/target/project1.html
    // Then...

    const data = [
        {
            projectName: "Mon Fichier",
            fileName: "project1.html"
        }
    ];

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

main();
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
