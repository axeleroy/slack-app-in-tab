// prettier-ignore
const CHROMEOS_UAS = "Mozilla/5.0 (X11; CrOS x86_64 16640.57.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.250 Safari/537.36";

const scriptTag = document.createElement("script");
scriptTag.type = "text/javascript";
scriptTag.innerText = `Object.defineProperty(window.navigator, "userAgent", { get: () => "${CHROMEOS_UAS}" })`;

document.documentElement.insertBefore(scriptTag, document.documentElement.firstChild);
