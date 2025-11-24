import { describe, it, expect, assert, vi, beforeEach } from "vitest";
import { extractPrettyVersion, extractUaString, replaceUaString } from "./index";
import { fs, vol } from "memfs";
import path from "node:path";

vi.mock("node:fs/promises");

beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset();
    process.chdir("/");
    vol.mkdirSync("/src");
});

describe("extractUaString", () => {
    it("should extract the User Agent string from the given HTML", () => {
        // GIVEN
        const html = `
        <!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <link rel="stylesheet preload prefetch" as="style" type="text/css" href="https://cdn.whatismybrowser.com/prod-website/static/main/css/site.min.css?time=1763340399" /> <title>What are the latest user agents for ChromeOS?</title> <meta name="description" content="The latest user agents for ChromeOS, including the various platforms it runs on. This can be helpful when you need to change your user agent." /> <!-- Mobile meta tags --> <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" /> <meta name="mobile-web-app-capable" content="yes" /> <meta name="HandheldFriendly" content="true" /> <meta name="format-detection" content="telephone=no" /> <!-- Open Graph meta tags --> <meta property="og:site_name" content="WhatIsMyBrowser.com" /> <meta property="og:type" content="Website" /> <meta property="og:title" content="What are the latest user agents for ChromeOS?" /> <meta property="og:image" content="https://cdn.whatismybrowser.com/prod-website/static/main/images/icons/chrome-os.png" /> <meta property="og:description" content="The latest user agents for ChromeOS, including the various platforms it runs on. This can be helpful when you need to change your user agent." /> <meta property="og:url" content="https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome-os" /> <meta property="article:section" content="Technology" /> <meta property="article:published_time" content="2019-07-06T00:00:00" /> <meta property="article:modified_time" content="2025-11-24T00:00:00" /> <!-- Twitter --> <meta name="twitter:card" content="summary"> <meta name="twitter:site" content="@whatismybrowser"> <meta name="twitter:creator" content="@whatismybrowser"> <meta name="twitter:title" content="What are the latest user agents for ChromeOS?"> <meta name="twitter:description" content="The latest user agents for ChromeOS, including the various platforms it runs on. This can be helpful when you need to change your user agent."> <meta name="twitter:image" content="https://cdn.whatismybrowser.com/prod-website/static/main/images/icons/chrome-os.png"> <!-- Favicon --> <link rel="shortcut icon" href="https://cdn.whatismybrowser.com/prod-website/static/favicon.ico" type="image/x-icon" /> <link rel="apple-touch-icon" sizes="152x152" href="https://cdn.whatismybrowser.com/prod-website/static/main/images/logo/apple-touch-icon.png" /> <link rel="icon" sizes="192x192" href="https://cdn.whatismybrowser.com/prod-website/static/main/images/logo/wimb-192.png"> <!-- Misc --> <meta name="msapplication-config" content="none"/> <meta name="theme-color" content="#428bae"> <!-- The Canonical URL for this page --> <link rel="canonical" href="https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome-os" /> <!-- The only translation --> <link rel="alternate" hreflang="en" href="https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome-os" /> <link rel="alternate" hreflang="x-default" href="https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome-os" /> <!-- Preload javascript (it's added at the end of the page) --> <link rel="preload prefetch" href="https://cdn.whatismybrowser.com/prod-website/static/main/js/site.min.js?cb=1727350264" as="script"> <!-- Google AdSense --> <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8548565564007782" crossorigin="anonymous"></script> <!-- Structured Data - For the whole site: Organization and the Website itself --> <script type="application/ld+json"> { "@context": "https://schema.org", "@type": "Organization", "name": "WhatIsMyBrowser.com", "url": "https://www.whatismybrowser.com", "foundingDate": "2010-11-10", "founder": { "@type": "Person", "name": "Brett Harris", "givenName": "Brett", "familyName": "Harris", "url": "https://www.whatismybrowser.com/about/team/brett-harris" }, "logo": { "@type": "ImageObject", "url": "https://cdn.whatismybrowser.com/prod-website/static/main/images/logo/logo-words-blue-black-transparent.png", "width": 600, "height": 600 }, "sameAs": [ "https://twitter.com/whatismybrowser", "https://github.com/whatismybrowser/" ] } </script> <script type="application/ld+json"> { "@context": "https://schema.org", "@type": "WebSite", "name": "WhatIsMyBrowser.com", "url": "https://www.whatismybrowser.com", "image": { "@type": "ImageObject", "url": "https://cdn.whatismybrowser.com/prod-website/static/main/images/logo/open-graph-homepage.png", "width": 600, "height": 600 }, "potentialAction": { "@type": "SearchAction", "target": "https://www.whatismybrowser.com/search/?q={search_term}", "query-input": "required name=search_term" }, "sameAs": [ "https://twitter.com/whatismybrowser", "https://github.com/whatismybrowser/" ] } </script> </head> <body class=" section_guides section_the-latest-user-agent section_content page lang-en"> <nav id="site" aria-label="Heading and navigation"> <div id="top-logo-and-name"> <a href="/" aria-label="My Browser"> <div id="top-logo"></div> </a> <div id="top-name"><a href="/"><span id="top-name-site">WhatIsMyBrowser.com</span></a></div> </div> <ul id="main-nav"> <li class="homepage"><a href="/">My browser</a></li> <li class="guides active"><a href="/guides/">Guides</a></li> <li class="detect"><a href="/detect/">Detect my settings</a></li> <li class="developers-tools"><a href="/developers/tools/">Tools</a></li> </ul> </nav> <div id="content-base"> <section class="section-block section-block-main-only" id="breadcrumbs"> <div class="corset"> <div class="content-block-main"> <nav aria-label="Breadcrumb"> <ol vocab="http://schema.org/" typeof="BreadcrumbList"> <li property="itemListElement" typeof="ListItem"> <a property="item" typeof="WebPage" href="/"> <span property="name"> Homepage </span> </a> <meta property="position" content="1"> </li> <li property="itemListElement" typeof="ListItem"> <a property="item" typeof="WebPage" href="/guides/"> <span property="name"> Guides </span> </a> <meta property="position" content="2"> </li> <li property="itemListElement" typeof="ListItem"> <a property="item" typeof="WebPage" href="/guides/the-latest-user-agent/"> <span property="name"> Latest browser user agents </span> </a> <meta property="position" content="3"> </li> <li property="itemListElement" typeof="ListItem" class="current" aria-current="page"> <a property="item" typeof="WebPage" href="/guides/the-latest-user-agent/chrome-os"> <span property="name"> What are the latest user agents for ChromeOS? </span> </a> <meta property="position" content="4"> </li> </ol> </nav> </div> </div> </section> <section class="section-block section-block-main-extra"> <div class="corset"> <div class="content-block-main"> <h1>The latest user agents for web browsers on ChromeOS</h1> <p class="page-date page-updated-at">Updated at: Nov 24, 2025</p> <p><a href="https://www.google.com/chromebook/chrome-os/">ChromeOS</a> is Google's Operating System for <a href="https://www.google.com/chromebook/">Chromebooks</a>.</p> <aside class="intended-audience"> <h2>Notice - this article is for the Techies!</h2> <p>The information on this page is of a more technical nature, and might not be what you're after. You only need the info here if you really know what you're doing.</p> </aside> <p>Explore our huge <a href="https://explore.whatismybrowser.com/useragents/explore/">user agent listing</a>, <a href="https://developers.whatismybrowser.com/useragents/database/">download our user agents database</a>, (or you can <a href="https://developers.whatismybrowser.com/api/features/database-search">search it</a>) if you're curious about other user agents.</p> <h2>Get latest user agents for ChromeOS via API</h2> <p>Our <a href="https://developers.whatismybrowser.com/api/docs/v2/integration-guide/#software-version-numbers">Web Browser/Operating System Version Numbers API</a> endpoint will provide you with the latest user agents for all sorts of popular web browsers and operating systems.</p> <table class="table table-striped table-hover listing-of-useragents"> <thead class="thead-dark"> <tr> <th title="The platform or grouping for each set of user agents">Platform</th> <th>Latest ChromeOS User Agents</th> </tr> </thead> <tbody> <tr> <td> <b>Chrome</b> on ChromeOS </td> <td> <ul> <li><span class="code">Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36</span></li> <li><span class="code">Mozilla/5.0 (X11; CrOS armv7l 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36</span></li> <li><span class="code">Mozilla/5.0 (X11; CrOS aarch64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36</span></li> </ul> </td> </tr> <tr> <td> <b>X86_64</b> on ChromeOS </td> <td> <ul> <li><span class="code">Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36</span></li> </ul> </td> </tr> <tr> <td> <b>Armv7l</b> on ChromeOS </td> <td> <ul> <li><span class="code">Mozilla/5.0 (X11; CrOS armv7l 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36</span></li> </ul> </td> </tr> <tr> <td> <b>Aarch64</b> on ChromeOS </td> <td> <ul> <li><span class="code">Mozilla/5.0 (X11; CrOS aarch64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36</span></li> </ul> </td> </tr> </tbody> </table> <h3>Experiment with different user agents</h3> <p>You can use our <a href="https://explore.whatismybrowser.com/useragents/parse/">User Agent Parser</a> page to try out different user agent varieties, or to test if your user agent switcher is working properly.</p> <div class="content-cta"> <h2>Database of user agents</h2> <p>If you're interested in our database of many millions of user agents, please check out our API which provides access to our <a href="https://developers.whatismybrowser.com/useragents/database/">user agent database</a>. You can perform very detailed and specific queries on it to find user agents that match your exact criteria - version numbers, hardware types, platforms and so on.</p> </div> </div> <div class="content-block-extra"> <div class="fun fun-adsense fun-responsive"> <div class="fun-inner"> <!-- WIMB: Extra A --> <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8548565564007782" data-ad-slot="5510985125" data-ad-format="auto" data-full-width-responsive="true"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script> </div> <div class="fun-info-footer">Ads by Google</div> </div> <section class="link-group related-articles"> <h2><a href="/guides/how-to-update-your-browser/">Update my web browser</a></h2> <ul> <li> <h3><a href="/">Do I need to update my browser?</a></h3> <p>Find out if your browser is out of date <br /><a href="/" class="read-more">Is my browser out of date?</a> </p> </li> <li> <h3><a href="/guides/how-to-update-your-browser/faq/why-should-i-update-my-web-browser">Why should I update my browser?</a></h3> <p>There are very good reasons to, find out here! <br /><a href="/guides/how-to-update-your-browser/faq/why-should-i-update-my-web-browser" class="read-more">Why update your browser?</a> </p> </li> <li> <h3><a href="/guides/how-to-update-your-browser/faq/is-it-free-to-update-chrome">Is it free to update Chrome?</a></h3> <p>Find out about the cost of updating Chrome... <br /><a href="/guides/how-to-update-your-browser/faq/is-it-free-to-update-chrome" class="read-more">Does Chrome cost anything?</a> </p> </li> </ul> <div class="link-group-footer"> <a href="/guides/how-to-update-your-browser/faq/">Read more about updating your browser...</a> </div> </section> <section class="link-group related-articles"> <h2><a href="/guides/">Get help with our guides</a></h2> <ul> <li> <h3><a href="/guides/how-to-enable-javascript/">How to enable JavaScript</a></h3> <p>Change your JavaScript settings <br /><a href="/guides/how-to-enable-javascript/" class="read-more">Guide to enabling Javascript</a> </p> </li> <li> <h3><a href="/guides/how-to-enable-cookies/">How to enable Cookies</a></h3> <p>Configure your cookie settings for privacy <br /><a href="/guides/how-to-enable-cookies/" class="read-more">Guide to enabling cookies</a> </p> </li> </ul> </section> <div class="fun fun-adsense fun-responsive"> <div class="fun-inner"> <!-- WIMB: Extra B --> <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8548565564007782" data-ad-slot="2818370829" data-ad-format="auto" data-full-width-responsive="true"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script> </div> <div class="fun-info-footer">Ads by Google</div> </div> <section class="link-group related-articles"> <h2><a href="/guides/">Related articles</a></h2> <ul> <li> <h3><a href="/guides/ai/web-browsers-without-ai/">Web Browsers without AI</a></h3> <p>Some web browsers manufacturers have started adding AI features to their browsers, others have decided not to. <br /><a href="/guides/ai/web-browsers-without-ai/" class="read-more">Which web browsers don&#x27;t have AI in them?</a> </p> </li> <li> <h3><a href="/guides/troubleshooting/website/cant-log-in">I can&#x27;t log in to a website.</a></h3> <p>We've got a detailed guide to help you solve login problems <br /><a href="/guides/troubleshooting/website/cant-log-in" class="read-more">How to fix website log in problems</a> </p> </li> <li> <h3><a href="/guides/how-to-enable-cookies/faq/why-do-websites-use-cookies">Why do websites use cookies?</a></h3> <p>Why are cookies useful? Do you need them? <br /><a href="/guides/how-to-enable-cookies/faq/why-do-websites-use-cookies" class="read-more">What&#x27;s the deal with cookies?</a> </p> </li> <li> <h3><a href="/guides/clear-cache-history-cookies/">Clear Cache, Cookies and History</a></h3> <p>How to reset your browsing history <br /><a href="/guides/clear-cache-history-cookies/" class="read-more">How to reset your browser</a> </p> </li> <li> <h3><a href="/guides/how-to-try-a-different-web-browser/">Try a different web browser</a></h3> <p>Different web browsers have different features - try a different one to see if you prefer it. <br /><a href="/guides/how-to-try-a-different-web-browser/" class="read-more">Experiment a bit!</a> </p> </li> <li> <h3><a href="https://go.nordvpn.net/aff_c?offer_id=252&amp;aff_id=8126" target="_blank">Use a VPN to hide your IP address</a></h3> <p>We recommend <a href="https://nordvpn.com/what-is-a-vpn/" target="_blank" >NordVPN</a> to hide your IP address or to unblock websites. <br /><a href="https://go.nordvpn.net/aff_c?offer_id=252&amp;aff_id=8126" class="read-more" target="_blank">Hide your IP Address</a> </p> </li> </ul> </section> </div> </div> </section> </div><!-- end of #content-base --> <footer aria-label="Page footer, contains various helpful links."> <div class="main-columns"> <div class="col"> <h2><a href="/guides/">Guides</a></h2> <ul> <li><a href="/guides/clear-cache-history-cookies/">Clear Cache, History and Cookies</a></li> <li><a href="/search/">Search whatismybrowser.com</a></li> <li><a href="/guides/">Guides about the Internet</a></li> <li><a href="/guides/how-to-update-your-browser/faq/why-should-i-update-my-web-browser">Why update my browser?</a></li> </ul> </div> <div class="col"> <h2><a href="/developers/tools/">Tools</a></h2> <ul> <li><a href="/developers/tools/iframe/">Use our IFrame on your site</a></li> <li><a href="https://explore.whatismybrowser.com/useragents/parse/">User agent parser</a></li> <li><a href="/developers/tools/send-to-tech-help/">Send browser info via email</a></li> <li><a href="/minimum-system-requirements/">Minimum System Requirements</a></li> </ul> </div> <div class="col"> <h2><a href="https://developers.whatismybrowser.com/">Developers</a></h2> <ul> <li><a href="/guides/the-latest-user-agent/">Latest user agents</a></li> <li><a href="https://developers.whatismybrowser.com/api/">User Agent Parsing API</a></li> <li><a href="https://explore.whatismybrowser.com/useragents/explore/">Explore User Agents</a></li> <li><a href="/faq/">Frequently Asked Questions</a></li> </ul> </div> <div class="col"> <h2>Connect</h2> <ul> <li><a href="/about/">About Us</a></li> <li><a href="/about/contact/">Contact Us</a></li> <li><a href="https://status.whatismybrowser.com/">Status</a></li> <li><a href="/about/media/">Media Kit</a></li> </ul> </div> </div> <section class="section-block section-block-main-only section-choose-language"> <div class="corset"> <div class="content-block-main"> <h2>Other languages</h2> <ul id="translation-options"> <li><a href="/">What is my browser?</a></li> <li><a href="/fr/">Quel est mon navigateur ?</a></li> <li><a href="/de/">Was ist mein Browser?</a></li> <li><a href="/es/">¿Cual es mi navegador?</a></li> <li><a href="/pt/">Qual é o meu navegador?</a></li> <li><a href="/sk/">Aký mám prehliadač?</a></li> </ul> </div> </div> </section> <div class="info"> <a href="/about/accessibility/">Accessibility Statement</a> <a href="/about/security/">Security Statement</a> </div> <div class="legal"> <a href="/">WhatIsMyBrowser.com</a> &copy; 2010 - 2025. <a href="/about/legal/">Legal</a><br /> </div> </footer> <!-- Values from the parse, to help the frontend detection --> <!-- Please don't scrape these, use the API! You'll get even more detail and you'll also help the project! --> <script> var detection_helper_software_name_code = "firefox"; var detection_helper_software_name = "Firefox"; var detection_helper_operating_system_name_code = "linux"; var detection_helper_operating_system_name = "Linux"; </script> <script> var third_party_domain = "webbrowsertests.com"; // which server do third-party checks use? </script> <script defer src="https://cdn.whatismybrowser.com/prod-website/static/main/js/site.min.js?cb=1727350264"></script> </body></html>
        `;

        // WHEN
        const result = extractUaString(html);

        // THEN
        expect(result).toBe(
            "Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36",
        );
    });

    it("should throw if it cannot find the User Agent string", () => {
        // GIVEN
        const html = `
        <html><body></body></html>
        `;

        // WHEN
        // THEN
        assert.throws(() => extractUaString(html), "XPath extract failed to find desired path");
    });
});

describe("replaceUaString", () => {
    it("should replace the UA string if it changed, and return the new value", async () => {
        // GIVEN
        fs.writeFileSync(
            "/src/contentScript.js",
            `const CHROMEOS_UAS = "Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36";`,
        );
        const uaString =
            "Mozilla/5.0 (X11; CrOS x86_64 16463.20.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.28 Safari/537.36";

        // WHEN
        const result = await replaceUaString(uaString);

        // THEN
        expect(result).toBe(true);
        const fileData = fs.readFileSync("/src/contentScript.js", "utf-8");
        expect(fileData).toBe(
            `const CHROMEOS_UAS = "Mozilla/5.0 (X11; CrOS x86_64 16463.20.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.28 Safari/537.36";`,
        );
    });
    it("should return false and don't change the file if the UA string hasn't changed", async () => {
        // GIVEN
        const originalData = `const CHROMEOS_UAS = "Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36";`;
        fs.writeFileSync("/src/contentScript.js", originalData);
        const uaString =
            "Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36";

        // WHEN
        const result = await replaceUaString(uaString);

        // THEN
        expect(result).toBe(false);
        const fileData = fs.readFileSync("/src/contentScript.js", "utf-8");
        expect(fileData).toBe(originalData);
    });
    it("should throw an Error if the file does not exist", async () => {
        // GIVEN
        // WHEN
        // THEN
        await expect(async () => await replaceUaString("foo")).rejects.toThrow(
            "Could not find file /src/contentScript.js",
        );
    });
    it("should throw an Error if the UA string could not be find in the file", async () => {
        // GIVEN
        fs.writeFileSync("/src/contentScript.js", "");

        // WHEN
        // THEN
        await expect(async () => await replaceUaString("foo")).rejects.toThrow(
            "Could not find CHROME_UAS in file /src/contentScript.js",
        );
    });
});

describe("extractPrettyVersion", () => {
    it("should return the Chrome version number", () => {
        // GIVEN
        const uaString =
            "Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.198 Safari/537.36";

        // WHEN
        const result = extractPrettyVersion(uaString);

        // THEN
        expect(result).toBe("Chrome 134");
    });
    it("should throw an error if the Chrome version cannot be found", () => {
        // GIVEN
        const uaString = "Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko)";

        // WHEN
        // THEN
        expect(() => extractPrettyVersion(uaString)).throws(`Could not find Chrome version in User Agent ${uaString}`);
    });
});
