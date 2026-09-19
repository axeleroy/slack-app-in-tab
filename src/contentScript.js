// prettier-ignore
const CHROMEOS_UAS = "Mozilla/5.0 (X11; CrOS x86_64 16765.49.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.7977.129 Safari/537.36";

const scriptTag = document.createElement("script");
scriptTag.type = "text/javascript";
scriptTag.innerText = `Object.defineProperty(window.navigator, "userAgent", { get: () => "${CHROMEOS_UAS}" })`;

document.documentElement.insertBefore(scriptTag, document.documentElement.firstChild);
