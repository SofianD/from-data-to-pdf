import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import * as fs from "fs";


/**
 * @author DOUAL Sofian
 * @description Return a browser.
 *
 * @export
 * @returns { Promise<Browser> }
 */
export async function initBrowser(): Promise<Browser> {
    try {
        // console.log('BROWSER IS INIT');
        return await puppeteer.launch();
    }
    catch (error) {
        throw new Error(error);
    }
}

/**
 * @author DOUAL Sofian
 * @description Close given browser.
 *
 * @export
 * @param { Browser } browser
 * @returns { Promise<void> }
 */
export async function closeBrowser(browser: Browser): Promise<void> {
    try {
        // console.log('BROWSER IS CLOSED');
        await browser.close();
        return;
    }
    catch (error) {
        throw new Error(error);
    }
}

/**
 * @author DOUAL Sofian
 * @description Return an array of PDFS buffer.
 *
 * @export
 * @param { Browser } browser
 * @param { FileBuffer[] } targets
 * @returns {Promise<FileBuffer>}
 */
export async function generateBuffer(browser: Browser, targets: FileBuffer[]): Promise<FileBuffer[]> {
    try {
        const page = await browser.newPage();
        const targetMax: number = targets.length;

        for (let i = 0; i < targetMax; i++) {
            
            if (targets[i].url) {
                await page.goto(
                    targets[i].url as string,
                    {
                        waitUntil: 'networkidle0'
                    }
                );
                delete targets[i].url;
            }

            else if (targets[i].text) {
                await page.setContent(
                    targets[i].text as string,
                    {
                        waitUntil: "networkidle0"
                    }
                );
                delete targets[i].text;
            }
            
            else {
                continue;
            }

            // define the default pdf options.
            if (!targets[i].options) {
                targets[i]['options'] = {
                    printBackground: true
                };
            }

            targets[i]['buffer'] = await page.pdf(targets[i].options as puppeteer.PDFOptions);
            delete targets[i].options;
        }
        return targets;
    }
    catch (error) {
        throw new Error(error);
    }
}

/**
 * @author DOUAL Sofian
 * @description Save the buffer as a PDF file.
 *
 * @export
 * @param { string } path
 * @param { FileBuffer[] } targets
 * @returns { Promise<FileBuffer[]> }
 */
export async function savePDF(targets: FileBuffer[], folder?: string,): Promise<FileBuffer[]> {
    const targetMax = targets.length;

    for (let i = 0; i < targetMax; i++) {
        try {
            let path: any;
        
            if (folder) {
                path = folder;
            } else {
                path = __filename.split('\\node_modules');
                path = (path.length > 1 ? path[0] : path[0].split('\\dist')[0]) + '/temp/generatedPDF/';
            }

            const pdfName = path + targets[i].name.split(' ').join('-') + Date.now().toString() + '.pdf';
            const pdf = await fs.promises.open(pdfName, 'a');
            await pdf.appendFile(targets[i].buffer as Buffer);
            pdf.close();
            delete targets[i].buffer;
            targets[i]['done'] = true;
            targets[i]['pathOfsavedFile'] = pdfName;
        } catch (error) {
            delete targets[i].buffer;
            targets[i]['done'] = false;
            continue;
        }
    }

    return targets;
}

/**
 * @author DOUAL Sofian
 * @description 
 *
 * @param { string } path
 * @param { FileBuffer[] } targets
 * @returns { Promise<boolean> }
 */
export async function initDefaultFolder(path?: string): Promise<boolean> {
    try {
        let folderRoot: any;
        
        if (path) {
            folderRoot = path;
        } else {
            folderRoot = __filename.split('\\node_modules');
            folderRoot = (folderRoot.length > 1 ? folderRoot[0] : folderRoot[0].split('\\dist')[0]);
        }

        let contentFolder = await fs.promises.readdir(folderRoot);
        contentFolder = contentFolder.filter(x => x === 'temp');

        if (contentFolder.length === 0) {
            await fs.promises.mkdir(folderRoot + '/temp/');

            await fs.promises.mkdir(folderRoot + '/temp/target/');

            await fs.promises.mkdir(folderRoot + '/temp/generatedPDF/');

            return false;
        }
        else {
            const contentTemp = await fs.promises.readdir(folderRoot + '/temp/');
            let reload = false;

            if (!contentTemp.includes('target')) {
            await fs.promises.mkdir(folderRoot + '/temp/target/');
            reload = true;
            }

            if (!contentTemp.includes('generatedPDF')) {
            await fs.promises.mkdir(folderRoot + '/temp/generatedPDF/');
            reload = true;
            }

            if (reload) return false;

            return true;
        }
        } catch (error) {
            // console.log(error);
            throw new Error(error);
        }
}

/**
 * @author DOUAL Sofian
 * @description Carries out the entire process.
 *
 * @export
 * @param { string } path
 * @param { FileBuffer[] } targets
 * @returns { Promise<FileBuffer[]> }
 */
export async function getPdfAndSave(targets: FileBuffer[], path?: string): Promise<FileBuffer[]> {
    const browser = await initBrowser();
    targets = await generateBuffer(browser, targets);
    await closeBrowser(browser);
    if (path) {
        targets = await savePDF(targets, path);
    } else {
        await initDefaultFolder();
        targets = await savePDF(targets);
    }
    return targets;
}

/**
 * @author DOUAL Sofian
 * @description Carries out the entire process without to save pdf.
 *
 * @export
 * @param { string } path
 * @param { FileBuffer[] } targets
 * @returns { Promise<FileBuffer[]> }
 */
export async function getPdf(targets: FileBuffer[]): Promise<FileBuffer[]> {
    const browser = await initBrowser();
    targets = await generateBuffer(browser, targets);
    await closeBrowser(browser);
    return targets;
}

export interface FileBuffer {
    name: string,
    url?: string,
    text?: string,
    buffer?: Buffer,
    options?: PdfOptions,
    pathOfsavedFile?: string,
    done?: boolean
}

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