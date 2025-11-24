import fs from "node:fs/promises";
import { JSDOM } from "jsdom";
import { evaluateXPathToString } from "fontoxpath";
import path from "node:path";
import { setOutput } from "@actions/core";

const fetchUaPage = async (): Promise<string> => {
    const result = await fetch("https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome-os");
    if (!result.ok) {
        const body = await result.text();
        console.error(`Fetch failed with status ${result.status} and body ${body}`);
        throw new Error("Fetch failed");
    }
    return result.text();
};

export const extractUaString = (html: string): string => {
    const dom = new JSDOM(html);
    const selectedValue = evaluateXPathToString("//table/tbody/tr[1]/td[2]/ul/li[1]", dom.window.document);
    if (!selectedValue) {
        throw new Error("XPath extract failed to find desired path");
    }
    return selectedValue;
};

const uasRegex = /(CHROMEOS_UAS = ")([^"]+)(")/;

export const replaceUaString = async (uaString: string): Promise<boolean> => {
    const filePath = path.resolve("src/contentScript.js");
    try {
        await fs.access(filePath);
    } catch (e) {
        throw new Error(`Could not find file ${filePath}`);
    }
    const data = await fs.readFile(filePath, { encoding: "utf8" });
    // Check if the CHROME_UAS string is present
    const matches = data.match(uasRegex);
    if (!matches) {
        throw new Error(`Could not find CHROME_UAS in file ${filePath}`);
    }
    // Check if it has actually changed
    const [_match, _first, prevString] = matches;
    const compareResult = uaString.localeCompare(prevString);
    if (compareResult <= 0) {
        return false;
    }
    // Replace it if it has changed
    const replaced = data.replace(uasRegex, `$1${uaString}$3`);
    await fs.writeFile(filePath, replaced);
    return true;
};

const versionRegex = /Chrome\/(\d+)/;

export const extractPrettyVersion = (uaString: string): string => {
    const matches = uaString.match(versionRegex);
    if (!matches) {
        throw new Error(`Could not find Chrome version in User Agent ${uaString}`);
    }
    const [_match, version] = matches;
    return `Chrome ${version}`;
};

const fetchAndReplaceUaString = async (): Promise<void> => {
    const htmlPage = await fetchUaPage();
    let uaString = extractUaString(htmlPage);
    const replaced = await replaceUaString(uaString);
    if (replaced) {
        console.log(`User-Agent string has changed to ${uaString}`);
        setOutput("chrome_version", extractPrettyVersion(uaString));
    } else {
        console.log("User-Agent string has not changed");
    }
};

fetchAndReplaceUaString()
    .then(() => console.log(`Finished without error`))
    .catch((e: Error) => {
        console.error(e.message);
        process.exit(1);
    });
