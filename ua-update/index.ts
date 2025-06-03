import fs from "node:fs/promises";
import { JSDOM } from "jsdom";
import { evaluateXPathToString } from "fontoxpath";
import path from "node:path";

const fetchUaPage = async (): Promise<string> => {
    const result = await fetch("https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome-os");
    if (!result.ok) {
        console.error(`Fetch failed with status ${result.status} and body ${await result.text()}`);
        throw new Error("Fetch failed");
    }
    return result.text();
};

const extractUaString = (html: string): string => {
    const dom = new JSDOM(html);
    const selectedValue = evaluateXPathToString("//table/tbody/tr[1]/td[2]/ul/li[1]", dom.window.document);
    if (!selectedValue) {
        throw new Error("XPath extract failed to find desired path");
    }
    return selectedValue;
};

const regex = /(CHROMEOS_UAS = ")([^"]+)(")/;

const replaceUaString = async (uaString: string): Promise<void> => {
    const filePath = "contentScript.js";
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
        throw new Error(`Could not find file ${path.resolve(filePath)}`);
    }
    const data = await fs.readFile(filePath, { encoding: "utf8" });
    const replaced = data.replace(regex, `$1${uaString}$3`);
    await fs.writeFile(filePath, replaced);
};

const fetchAndReplaceUaString = async (): Promise<string> => {
    const htmlPage = await fetchUaPage();
    let uaString = extractUaString(htmlPage);
    await replaceUaString(uaString);
    return uaString;
};

fetchAndReplaceUaString().then((uaString) => console.log(`Updated contentScript with ${uaString}`));
