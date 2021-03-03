import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";

export async function initBrowser(): Promise<Browser> {
    try {
        // console.log('BROWSER IS INIT');
        return await puppeteer.launch();
    }
    catch (error) {
        throw new Error(error);
    }
}

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

export async function generateBuffer(browser: Browser, targets: FileBuffer[]): Promise<FileBuffer[]> {
    try {
        const page = await browser.newPage();
        const targetMax: number = targets.length;
        const res: [] = [];

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

export interface FileBuffer {
    url?: string,
    text?: string,
    buffer?: Buffer,
    options?: PdfOptions
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