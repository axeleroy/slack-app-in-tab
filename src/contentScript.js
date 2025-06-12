// prettier-ignore
const CHROMEOS_UAS = "Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36 FIXME";

const scriptTag = document.createElement("script");
scriptTag.type = "text/javascript";
scriptTag.innerText = `Object.defineProperty(window.navigator, "userAgent", { get: () => "${CHROMEOS_UAS}" })`;

document.documentElement.insertBefore(scriptTag, document.documentElement.firstChild);
