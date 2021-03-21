import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import * as fs from "fs";
import * as pathModule from "path"

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
 * @param { string } [path]
 * @returns {Promise<FileBuffer>}
 */
export async function generateBuffer(browser: Browser, targets: FileBuffer[], path?: string): Promise<FileBuffer[]> {
    try {
        const page = await browser.newPage();
        const targetMax: number = targets.length;

        for (let i = 0; i < targetMax; i++) {
            if (!targets[i].name) {
                if (targets[i].url) delete targets[i].url;
                else if (targets[i].text) delete targets[i].text;
                else if (targets[i].options) delete targets[i].options
                targets[i]['error'] = new Error('Projects need name.')
                continue;
            }
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
                    printBackground: true,
                    preferCSSPageSize: true,
                    displayHeaderFooter: true
                };
            }

            if (path) {
                const pdfName = pathModule.join(path, (targets[i].name.split(' ').join('-') + Date.now().toString() + '.pdf'));
                (targets[i].options as puppeteer.PDFOptions)['path'] = pdfName;

                if (targets[i].url) delete targets[i].url;
                else if (targets[i].text) delete targets[i].text;

                await page.pdf(targets[i].options as puppeteer.PDFOptions);
                targets[i]['pathOfsavedFile'] = pdfName;

                delete targets[i].options;
            } 
            else {
                targets[i]['buffer'] = await page.pdf(targets[i].options as puppeteer.PDFOptions);
                delete targets[i].options;
            }
        }
        return targets;
    }
    catch (error) {
        throw new Error(error);
    }
}

/**
 * @author DOUAL Sofian
 * @description Save the buffer as a PDF file in <My project>/temp/generatedPDF/.
 *
 * @export
 * @param { FileBuffer[] } targets
 * @returns { Promise<FileBuffer[]> }
 */
export async function savePDF(targets: FileBuffer[]): Promise<FileBuffer[]> {
    const targetMax = targets.length;

    for (let i = 0; i < targetMax; i++) {
        try {
            if (!targets[i].name) throw new Error("Projects need name."); 

            let path: any= __filename.split('\\node_modules');
            path = (path.length > 1 ? path[0] : path[0].split('\\dist')[0]) + '/temp/generatedPDF/';
            
            const pdfName = path + targets[i].name.split(' ').join('-') + Date.now().toString() + '.pdf';
            const pdf = await fs.promises.open(pdfName, 'a');
            await pdf.appendFile(targets[i].buffer as Buffer);
            pdf.close();

            targets[i]['pathOfsavedFile'] = pdfName;
            delete targets[i].buffer;
        } catch (error) {
            delete targets[i].buffer;
            targets[i]['error'] = error;
            continue;
        }
    }

    return targets;
}

/**
 * @author DOUAL Sofian
 * @description Create folders ./temp, ./temp/target, ./temp/generatedPDF
 *
 * @returns { Promise<boolean> }
 */
export async function initDefaultFolder(): Promise<boolean> {
    try {
        let folderRoot: any= __filename.split('\\node_modules');
        folderRoot = (folderRoot.length > 1 ? folderRoot[0] : folderRoot[0].split('\\dist')[0]);
        

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
 * @description Converts HTML files to string.
 *
 * @param { HTMLTarget[] } data
 * @param { string } [path]
 * @returns { Promise<FileBuffer[]> }
 */
export async function fromHtmlFileToString(data: HTMLTarget[], path?: string): Promise<FileBuffer[]> {
    try {
        const folderRoot: string = setPath(path ?? undefined);
        
        const countProjects: number = data.length;

        if (countProjects > 0) {
            const res: FileBuffer[] = [];

            for(let i = 0; i < countProjects; i++) {
                if (data[i].projectName && data[i].fileName) {
                    let project: FileBuffer = {
                        name: data[i].projectName,
                        options: data[i].pdfOptions
                    };

                    if (folderRoot === setPath()) {
                        project['text'] = await fs.promises.readFile(
                            pathModule.join(folderRoot, '/temp/target/', data[i].fileName),
                            {encoding: 'utf-8'}
                        );
                    } else {
                        project['text'] = await fs.promises.readFile(
                            pathModule.join(folderRoot, data[i].fileName),
                            {encoding: 'utf-8'}
                        );
                    }

                    res.push(project);
                    delete data[i];
                }
                else {
                    let project: FileBuffer = {
                        name: data[i].projectName,
                        error: new Error('Projects need name && file name.')
                    };
                    res.push(project);
                    delete data[i];
                }
            }

            return res;
        } else {
            throw 'No project detected.'
        }
    } catch (error) {
        throw new Error(error);
    }
}


// Scripts

/**
 * @author DOUAL Sofian
 * @description Carries out the process without to save pdf.
 *
 * @export
 * @param { FileBuffer[] } targets
 * @param { boolean } [save]
 * @returns { Promise<FileBuffer[]> }
 */
export async function getPdf(targets: FileBuffer[], save: boolean = false): Promise<FileBuffer[]> {
    const browser = await initBrowser();
    if (save) {

        await initDefaultFolder();

        let folderToSavePdf: any= __filename.split('\\node_modules');
        folderToSavePdf = (folderToSavePdf.length > 1 ? folderToSavePdf[0] : folderToSavePdf[0].split('\\dist')[0]) + '/temp/generatedPDF/';
        
        targets = await generateBuffer(browser, targets, folderToSavePdf);
    }
    else {
        targets = await generateBuffer(browser, targets);
    }
    // targets = await generateBuffer(browser, targets);
    await closeBrowser(browser);
    return targets;
}

/**
 * @author DOUAL Sofian
 * @description Get html files and carries out the process.
 *
 * @export
 * @param { HTMLTarget[] } files
 * @param { boolean } save
 * @param { string } [path]
 * @returns { Promise<FileBuffer[]> }
 */
export async function fromHtmlFileToPdf(files: HTMLTarget[], save: boolean, path?: Path): Promise<FileBuffer[]> {
    let formatedFiles: FileBuffer[] = await fromHtmlFileToString(files, path?.toGetFiles ?? undefined);
    const browser: Browser = await initBrowser();
    if (save) {
        let folderToSavePdf: string = setPath(path?.toSaveFiles ?? undefined);
        if (!path?.toSaveFiles) {
            await initDefaultFolder();
            folderToSavePdf = pathModule.join(folderToSavePdf, '/temp/generatedPDF/');
        }
        formatedFiles = await generateBuffer(browser, formatedFiles, folderToSavePdf);
    }
    else {
        formatedFiles = await generateBuffer(browser, formatedFiles);
    }
    await closeBrowser(browser);

    return formatedFiles;
}

/**
 * @author DOUAL Sofian
 * @description It returns the path of the app directory if path param does not exists.
 *  Else if path param exists and it is a relative path, this method joins it with the path of app directory to finally returns the result as string.
 *  Else if path param exists and it is an absolute path, this methods return it.
 *
 * @param { string } [path]
 * @returns { string }
 */
export function setPath(path?: string): string{
    try {
        if(path) {
            if (pathModule.isAbsolute(path)) {
                return path;
            } else {
                let dirPath: any= __filename.split('\\node_modules');
                dirPath = (dirPath.length > 1 ? dirPath[0] : dirPath[0].split('\\dist')[0]);
                return pathModule.join(dirPath, path);
            }
        } else {
            let dirPath: any= __filename.split('\\node_modules');
            dirPath = (dirPath.length > 1 ? dirPath[0] : dirPath[0].split('\\dist')[0]);
            return dirPath;
        }
    } catch (error) {
        throw new Error(error);
    }
}

// MODELS

export interface HTMLTarget {
    projectName: string,
    fileName: string,
    pdfOptions: puppeteer.PDFOptions,
}

export interface FileBuffer {
    name: string,
    url?: string,
    text?: string,
    buffer?: Buffer,
    options?: puppeteer.PDFOptions,
    pathOfsavedFile?: string,
    error?: any,
}

interface Path {
    toGetFiles: string;
    toSaveFiles: string;
}
