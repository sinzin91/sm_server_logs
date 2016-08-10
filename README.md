# Scripts to scan Wiser topology server logs

## setup
- Download this repo: `git clone https://github.com/sinzin91/sm_server_logs.git`
- install node packages: `npm i`

## check_prod_log.js
This script scans the latest production log

Usage: `node check_prod_log.js {scraper_class_name}`   

Example: `node check_prod_log poolzoom.com_poolsupplyunltd`

Output example:   
```ssh prod1 'sudo ls -lt /mint/logs/topologies | grep "\spoolzoom.com_poolsupplyunltd"'
The log file is in prod1.
Latest matching log file: poolzoom.com_poolsupplyunltd-production-cG9vbHpvb20uY29tX3Bvb2xzdXBwbHl1bmx0ZC1wcm9kdWN0aW9u.log
The last scrape time was: per    5038987 Aug 10 20:01 UTC
Fail emit...: 0
Can not do request without proxy: 0
Error communicating with the remote browser: 0
Total output messages: 1000
Page content contains CAPTCHA: 0
CSS selector was not found: 0
HTTP Status 400: 0
HTTP Status 407: 0
Prices pulled: 551
Unable to connect to Redis: 0
I/O exception: 2
```

## check_prod_log_cached.js
This does the same thing as check_prod_log.js, but finds the log from yesterday since the current log might not be complete if scrape just started.

Usage: `node check_prod_log_cached {scraper_class_name}`   

Example: `node check_prod_log_cached poolzoom.com_poolsupplyunltd`

## check_prod_log_promise_array.js
This takes an input csv within one column containing scraper class names and iterates through every scraper_class_name returning output.csv with information on each scraper log.

Usage: `node check_prod_log_promise_array {input csv}`   

Example: `node check_prod_log_promise_array input.csv`

Output: output.csv

## Output explanation

The output reports the number of times each metric was found in a given log  

`Priced pulled`: how many prices we actually got  
`HTTP Status 400`: url couldn’t load for whatever reason  
`HTTP Status 407`: url couldn't load due to  proxy issue  
`Can not do request without proxy`: we couldn’t get a proxy  
`Unable to connect to Redis`: couldn’t connect to the Redis queue  
`Page content contains CAPTCHA`: blocked by captcha on the site  
`I/O exception`: SM issue  
`Fail emit...`: usually scraper issue causing leading to no output message  
`CSS selector was not found`: scraper could not find a CSS selector   
`Error communicating with browser`: cant connect to site   
`Interaction failed during execution`: there was an issue while rendering the page with PhantomJS  
`Unable to get PhantomJS`: SM was unable to get a PhantomJS instance  
`Total output messages`: number of times SM  got messages, usually tied to # of SKUs in store unless scraper is attached to multiple
