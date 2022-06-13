### <ins> Web Scraping Keywords Script for "Indeed"

- Utilized: ```Typescript, Puppeteer, Chrome DevTools, XPath, JSON, Cookies Session```

It can:
> 1. Automatically **login** to user's Indeed account 
> 2. **Save cookie** session in **JSON** file to **prevent re-login**
> 3. Go through each job listing and **extract keywords** from each categories such as _"Skills & Experience"_ and _"Education & Certifications"_
> 4. Click "See More" to **expand the categories** before extraction
> 5. **Store all keyword extraction** into **JSON** file
  
Then what?
> JSON file can be imported into Microsoft Excel for data analysis 
> 
  ```Example: Calculate the count of repeated keywords (To get an overview of skill demands in the market) ```

<br />
<br />
        
###  <ins> **Helpful resources:**
#### 1. **XPath CheatSheet** 
- https://devhints.io/xpat
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

#### 2. To find elements with no IDs
- https://stackoverflow.com/questions/53165242/how-do-i-click-a-button-that-has-no-id-using-apifys-puppeteer
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

#### 3. Get the nth number of index in XPATH
- https://stackoverflow.com/questions/4007413/xpath-query-to-get-nth-instance-of-an-element
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 4. To click on checkbox
- https://www.youtube.com/watch?v=IkZSNrWKlqk&ab_channel=KanielOutis
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 5. To check if checkbox OR anything is "Checked/Existed" before executing. Will skip if its "Checked/Existed"
https://stackoverflow.com/a/18833267
```
Example:

let self_identity_disability = await page.$x(`//input[@id="67772ae36794100008ef69bccb3e00b4"][@aria-checked="false"]`)
        if (self_identity_disability.length > 0) {
            await self_identity_disability[0].focus()
            await self_identity_disability[0].click()
        } 
```
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 6. Upload File
- https://blog.executeautomation.com/fileupload-testing-with-puppeteer/
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 7. Clear Inputs
- https://evanhalley.dev/post/clearing-input-field-puppeteer/ 
```
PS: (You need to await ".focus" before ".click")
``` 
if (element instanceof ElementHandle)
- https://stackoverflow.com/questions/46204003/trigger-click-in-typescript-property-click-does-not-exist-on-type-element
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 8. Clear Inputs (Second method, by selecting all)
- https://github.com/segmentio/nightmare/issues/810#issuecomment-493570444
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 9. Use XPath to find div locations (Works when querySelector doesnt work and showing ...is not a valid selector error)
- https://www.youtube.com/watch?v=27ILXN6Z7D0&t=1516s&ab_channel=CodingwithIndy (Time: 27:26 - 28:45)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 10. Get the value after [0] from Xpath location
- https://stackoverflow.com/questions/32310645/how-to-select-the-second-element-with-same-attribute-id-in-an-xpath
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 11. To click on the XPath location 
- https://stackoverflow.com/questions/58087966/how-to-click-element-in-puppeteer-using-xpath
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 12. To click on dropdown with XPath location
- https://stackoverflow.com/questions/50542570/select-dropdown-using-xpath-in-puppeteer
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 13. Save session with cookies
- https://stackoverflow.com/questions/48608971/how-to-manage-log-in-session-through-headless-chrome#:~:text=There%20is%20an%20option%20to,things%20related%20to%20launching%20chrome.&text=This%20is%20the%20easiest%20way,data%20than%20what%20you%20need.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 14. Check disabled
- https://stackoverflow.com/questions/24826130/how-to-include-an-attribute-in-an-xpath-selection
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 15. Check text 
- https://stackoverflow.com/questions/10177169/finding-a-span-with-specific-content-using-xpath
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 16. Console log the @href (links) value
- https://stackoverflow.com/questions/53564374/get-all-links-with-xpath-in-puppeteer-pausing-or-not-working/53568112#53568112
- https://stackoverflow.com/questions/63324784/get-attribute-values-matching-xpath
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 17. Create New Tab and Switch Tabs
- (https://stackoverflow.com/questions/48564298/switching-between-tabs-with-puppeteer)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 18. Select iframe (if XPath doesnt show up until you inspect element)
- https://stackoverflow.com/questions/56420047/how-to-select-elements-within-an-iframe-element-in-puppeteer
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 19. If typescript saying null or undefined
- https://stackoverflow.com/questions/40349987/how-to-suppress-error-ts2533-object-is-possibly-null-or-undefined
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 20. Skip one iteration in "for loop" for Typescript
- https://www.codegrepper.com/code-examples/javascript/javascript+for+loop+skip+one+iteration
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 21. Add element to an array for Typescript
- https://www.codegrepper.com/code-examples/typescript/append+a+list+in+typescript
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
#### 22. JSON .push (showing error)
- https://stackoverflow.com/questions/29960410/push-is-not-a-function-using-javascript-and-localstorage
