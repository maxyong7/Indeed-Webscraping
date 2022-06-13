import puppeteer, { createJSHandle, customQueryHandlerNames, ElementHandle } from 'puppeteer'
import * as secrets from './secrets'
const fs = require('fs')
const cookiesFilePath = './cookies_indeed.json'
const jsonFilePath = './results.json'
const jsonName = 'results.json'


const randomIntFromInterval = (min: number, max: number) => { // min inclusive and max exclusive
    return Math.floor(Math.random() * (max - min) + min);
}

let sleep_for = async (page: puppeteer.Page, min: number, max: number) => {
    let sleep_duration = randomIntFromInterval(min, max);
    console.log('waiting for', sleep_duration / 1000, 'seconds');
    await page.waitForTimeout(sleep_duration);// simulate some quasi human behaviour
}

let sign_in = async (page: puppeteer.Page) => { //To go through list and apply for jobs
    try {
        const sign_in_button = await page.$x(`//div[@data-gnav-element-name="SignIn"]`)
        if (sign_in_button.length > 0) {
            await sign_in_button[0].focus()
            await sign_in_button[0].click()
            await page.waitForXPath(`//input[@id="ifl-InputFormField-3"]`, { timeout: 0 })
            const email_address = await page.$x(`//input[@id="ifl-InputFormField-3"]`)
            await email_address[0].focus()
            await email_address[0].click({ clickCount: 4 })
            await email_address[0].type(secrets.email_address)
            const continue_button = await page.$x(`//button[@data-tn-element="auth-page-email-submit-button"]`)
            await continue_button[0].focus()
            await continue_button[0].click()
            await page.waitForXPath(`//a[@id="auth-page-google-password-fallback"]`, { timeout: 0 })
            const login_with_password_instead = await page.$x(`//a[@id="auth-page-google-password-fallback"]`)
            await login_with_password_instead[0].focus()
            await login_with_password_instead[0].click()
            await page.waitForXPath(`//input[@id="ifl-InputFormField-101"]`, { timeout: 0 })
            const password_input = await page.$x(`//input[@id="ifl-InputFormField-101"]`)
            await password_input[0].focus()
            await password_input[0].click({ clickCount: 4 })
            await password_input[0].type(secrets.password)
            const click_sign_in = await page.$x(`//button[@type="submit"]`)
            await click_sign_in[0].focus()
            await click_sign_in[0].click()
        }
    } catch (e) {
        console.log("Error in Sign In:", e);
    }
}

let scraping = async (page: puppeteer.Page) => {
    try {
        await page.waitForXPath(`//ul[@class="jobsearch-ResultsList"]/li`, { timeout: 0 })

        // Save Session Cookies
        const cookiesObject = await page.cookies()
        // Write cookies to temp file to be used in other profile pages
        fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject),
            function () {
                try {
                    console.log('Session has been successfully saved')
                } catch (e) {
                    console.log('The file could not be written.', e)
                }

            }
        )
        //Check if "Next" button exist
        const next_button = await page.$x(`(//a[@aria-label="Next"])`)
        while (next_button.length != 0) {

            const result_list = await page.$x(`//ul[@class="jobsearch-ResultsList"]/li`)
            const result_list_length = result_list.length
            //Go through each section from results
            for (let i = 0; i < result_list_length; i++) {
                try {
                    await result_list[i].focus()
                    await result_list[i].click()

                    //Wait until iframe is loaded
                    await page.waitForXPath(`//td[@class="is-visible"]`, { timeout: 0 })

                    //Switch to iframe
                    let ElementHandle = await page.waitForXPath(`//iframe[@id="vjs-container-iframe"]`)
                    const i_frame = await ElementHandle!.contentFrame()

                    //Check if "Show more" button exists
                    const show_more_button = await i_frame!.$x(`//button[@class="jm-expand-link"]`)
                    const show_more_button_length = show_more_button.length

                    //Click "Show more" if exists
                    if (show_more_button.length > 0) {
                        for (let i = 0; i < show_more_button_length; i++) {
                            await show_more_button[i].focus()
                            await show_more_button[i].click()
                            // await sleep_for(page, 2500, 3000)
                        }
                    }

                    //Check the number Keyword_Sections (eg: "Experience & Skills", "Education & Certification") 
                    const keywords_list_table = await i_frame!.$x(`//ul[@class="resumeMatch-TileContext-list"]`)
                    const keywords_list_table_length = keywords_list_table.length

                    //If Keyword_Section exist
                    if (keywords_list_table.length > 0) {
                        for (let i = 0; i < keywords_list_table_length; i++) {
                            let json_list: any[] = []
                            //Get Keyword Section's title
                            const keywords_title = await i_frame!.$x(`(//h3[@class="jm-section-title"])[${(i + 1)}]`)
                            const keywords_title_words = await i_frame!.evaluate(name => name.textContent, keywords_title[i]);

                            //Get the total number of keywords in Keyword_Section
                            const keywords_list = await i_frame!.$x(`(//ul[@class="resumeMatch-TileContext-list"])[${(i + 1)}]/li`)
                            const keywords_list_length = keywords_list.length
                            for (let u = 0; u < keywords_list_length; u++) {

                                //Get value of each keywords
                                const words = await i_frame!.$x(`(//ul[@class="resumeMatch-TileContext-list"])[${(i + 1)}]/li[${(u + 1)}]/div/span/text()`)
                                //Convert value of keywords to text
                                const getMsg = await i_frame!.evaluate(name => name.textContent, words[0]);
                                console.log(getMsg)
                                json_list.push(getMsg)
                                //Check if JSON Results exists
                                const previousResultJSON = fs.existsSync(jsonName)
                                const JSONresultsString = fs.readFileSync(jsonName)
                                if (previousResultJSON && JSONresultsString.length !== 0) {
                                    try {
                                        let parsedJSONresults = JSON.parse(JSONresultsString)
                                        //Check if parsed JSON is an array or not (Will not be able to .push if it is not an array)
                                        if (!(parsedJSONresults instanceof Array)) {
                                            parsedJSONresults = [parsedJSONresults]
                                        }
                                        parsedJSONresults.push(getMsg)
                                        fs.writeFile(jsonName, JSON.stringify(parsedJSONresults),
                                            function () {
                                                try {
                                                    console.log('Results JSON has been successfully saved')
                                                } catch (e) {
                                                    console.log('Results JSON could not be written.', e)
                                                }

                                            }
                                        )
                                    }
                                    catch (e) {
                                        console.log('Results JSON could not be written.')
                                        console.log(e)
                                    }
                                }
                                else {
                                    fs.writeFile(jsonFilePath, JSON.stringify(getMsg),
                                        function () {
                                            try {
                                                console.log('Session has been successfully saved')
                                            } catch (e) {
                                                console.log('The file could not be written.', e)
                                            }

                                        }
                                    )
                                }
                            }

                            // // //Check if JSON Results exists
                            // // const previousResultJSON = fs.existsSync(jsonName)
                            // // console.log("Reading JSON")
                            // // const JSONresultsString = fs.readFileSync(jsonName)
                            // // console.log("JSONresultsString: " + JSONresultsString)
                            // // if (previousResultJSON && JSONresultsString.length !== 0) {
                            // //     try {
                            // //         let parsedJSONresults = JSON.parse(JSONresultsString)
                            // //         console.log("parsedJSONresults: " + parsedJSONresults)
                            // //         //Check if parsed JSON is an array or not (Will not be able to .push if it is not an array)
                            // //         if (!(parsedJSONresults instanceof Array)) {
                            // //             parsedJSONresults = [parsedJSONresults]
                            // //         }
                            // //         // var create_array: string[]
                            // //         // create_array = [keywords_title_words + ': ' + json_list]
                            // //         // parsedJSONresults.push(create_array)
                            // //         // parsedJSONresults.push(keywords_title_words + ': ' + json_list)
                            // //         // parsedJSONresults.push(keywords_title_words)
                            // //         parsedJSONresults.push(json_list)
                            // //         fs.writeFile(jsonName, JSON.stringify(parsedJSONresults),
                            // //             function () {
                            // //                 try {
                            // //                     console.log('Results JSON has been successfully saved')
                            // //                 } catch (e) {
                            // //                     console.log('Results JSON could not be written.', e)
                            // //                 }

                            // //             }
                            // //         )
                            // //     }
                            // //     catch (e) {
                            // //         console.log('Results JSON could not be written.')
                            // //         console.log(e)
                            // //     }
                            // // }
                            // // else {
                            // //     // fs.writeFile(jsonFilePath, JSON.stringify(keywords_title_words + ': ' + json_list),
                            // //     fs.writeFile(jsonFilePath, JSON.stringify([json_list]),
                            // //         function () {
                            // //             try {
                            // //                 console.log('Session has been successfully saved')
                            // //             } catch (e) {
                            // //                 console.log('The file could not be written.', e)
                            // //             }

                            // //         }
                            // //     )
                            // // }
                            // fs.readFileSync(jsonFilePath, function (_err: any, data: string) {
                            //     console.log("Done Reading JSON")
                            //     try {
                            //         var json = JSON.parse(data)
                            //         json.push(keywords_title_words + ': ' + json_list)
                            //         fs.writeFile(jsonFilePath, JSON.stringify(json))
                            //         console.log('Results JSON has been successfully saved')
                            //     }
                            //     catch (e) {
                            //         console.log('Results JSONcould not be written.')
                            //     }
                            // })

                        }
                    }
                    console.log("next")

                } catch (e) {
                    try {
                        //If error, will check if there's a pop up and try to close it 
                        close_pop_up(page)
                    } catch (e) {
                        //Skip to next listing if still having any errors
                        console.log("Continued...")
                        continue
                    }
                }
            }
            //Check if "Next" button exist
            const next_button = await page.$x(`(//a[@aria-label="Next"])`)
            if (next_button.length > 0) {
                //Click on "Next" button
                await next_button[0].focus()
                await next_button[0].click()
                await page.waitForXPath(`//ul[@class="jobsearch-ResultsList"]/li`, { timeout: 0 })
            }
            //Stop if "Next" button doesnt exist
            if (next_button.length == 0) {
                console.log("done with EVERYTHING")
                break
            }
        }
        // if (next_button) {
        //     await next_button[0].focus()
        //     await next_button[0].click()
        // }


    } catch (e) {
        console.log("Error in Scraping:", e);
    }
}

let close_pop_up = async (page: puppeteer.Page) => {
    try {
        //Try to click "X" for pop up
        await sleep_for(page, 1000, 1500)
        const close_pop_up_buton = await page.$x(`//button[@class="popover-x-button-close icl-CloseButton"]`)
        await close_pop_up_buton[0].focus()
        await close_pop_up_buton[0].click()
    } catch (e) {

    }
}

let main_actual = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 0 });
        const page = await browser.newPage();
        // const URL = 'https://www.indeed.com/jobs?q=it%20support&l=Remote&sc=0kf%3Aexplvl(ENTRY_LEVEL)%3B&start=40&vjk=afcbbe245a85b5f1&advn=2098661128887081'
        //const URL = 'https://www.indeed.com/jobs?q=software%20engineer%20intern&l=Remote&from=searchOnHP&vjk=31aa17e945d8800a' //Software Engineer Intern
        const URL = 'https://www.indeed.com/jobs?q=software%20engineer%20entry%20level&l=Remote&vjk=d69c73ba0577ad6d' //Software Engineer Entry Level
        await page.setViewport({
            width: 1920, height: 780,
            deviceScaleFactor: 1,
        });
        if (secrets.check_for_cookie_indeed) {
            //Check for Cookies
            const previousSession = fs.existsSync('./cookies_indeed.json')
            if (previousSession) {

                // If file exist load the cookies
                const cookiesString = fs.readFileSync('./cookies_indeed.json');
                const parsedCookies = JSON.parse(cookiesString);
                if (parsedCookies.length !== 0) {
                    for (let cookie of parsedCookies) {
                        await page.setCookie(cookie)
                    }
                    console.log('Session has been loaded in the browser')
                    await page.goto(URL, { waitUntil: 'networkidle2' });
                    await scraping(page)
                }
            }
        }
        else {
            await page.goto(URL, { waitUntil: 'networkidle2' });
            await sign_in(page)
            await scraping(page)
        }
    } catch (e) {
        console.log(e);
    }
}

let main = async () => {
    main_actual()
}

main(); //bootstrap