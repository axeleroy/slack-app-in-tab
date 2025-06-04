import fs from "node:fs/promises";
import { JSDOM } from "jsdom";
import { evaluateXPathToString } from "fontoxpath";
import path from "node:path";
import { setOutput } from "@actions/core";

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

const replaceUaString = async (uaString: string): Promise<boolean> => {
    const filePath = path.resolve("../contentScript.js");
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
        throw new Error(`Could not find file ${filePath}`);
    }
    const data = await fs.readFile(filePath, { encoding: "utf8" });
    // Check if the CHROME_UAS string is present
    const matches = data.match(regex);
    if (!matches) {
        throw new Error(`Could match Regex in file ${filePath}`);
    }
    // Check if it has actually changed
    const [_match, _first, prevString] = matches;
    if (prevString === uaString) {
        return false;
    }
    // Replace it if it has changed
    const replaced = data.replace(regex, `$1${uaString}$3`);
    await fs.writeFile(filePath, replaced);
    return true;
};

const fetchAndReplaceUaString = async (): Promise<void> => {
    const htmlPage = await fetchUaPage();
    let uaString = extractUaString(htmlPage);
    const replaced = await replaceUaString(uaString);
    if (replaced) {
        console.log(`User-Agent string has changed to ${uaString}`);
        setOutput("replaced_ua_string", uaString);
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
