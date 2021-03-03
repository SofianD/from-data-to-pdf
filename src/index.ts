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
export async function savePDF(path: string, targets: FileBuffer[]): Promise<FileBuffer[]> {
    const targetMax = targets.length;

    for (let i = 0; i < targetMax; i++) {
        try {
            const pdfName = targets[i].name + Date.now().toString() + '.pdf';
            const pdf = await fs.promises.open(pdfName, 'a');
            await pdf.appendFile(targets[i].buffer as Buffer);
            pdf.close();
            delete targets[i].buffer;
            targets[i]['done'] = true;
        } catch (error) {
            delete targets[i].buffer;
            targets[i]['done'] = false;
            continue;
        }
    }

    return targets;
}

export interface FileBuffer {
    name: string,
    url?: string,
    text?: string,
    buffer?: Buffer,
    options?: PdfOptions,
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