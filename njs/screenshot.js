// v1.0.0 puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');

if (process.argv.length < 3) {
    console.error('Usage: node screenshot.js {URI}');
    process.exit(1);
}

const uri = process.argv[2];
const screenshot_dir = process.argv[3];

async function headless(uri, filename, args) {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: args,
        // headless: false,
    });
    const page = await browser.newPage();
    page.emulate({
        viewport: {
            width: 1920,
            height: 1080,
        },
        userAgent: "",
    });

    try {
        // timeout at 30 seconds (3 * 10000ms), network idle at 3 seconds
        await page.goto(uri, {
            waitUntil: 'networkidle2',
            timeout: 30000,
        });

        // Take screenshots
        await page.screenshot({
            path: filename,
            //fullPage: true
        });

    } catch (e) {
        console.log(uri,"Failed with error:", e);
        process.exit(1);
    }
    browser.close();
}

// Execute
var args = ['--no-sandbox'];
var filename = screenshot_dir;
filename = filename + ".png";
headless(uri, filename, args).then(v => {
    // Once all the async parts finish this prints.
    console.log("Finished Headless");
    process.exit(1);
});
