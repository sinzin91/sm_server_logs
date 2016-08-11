# Scripts to scan Wiser topology server logs
These scripts provide an overview of how a scraper is performing.

## setup
- Download this repo: `git clone https://github.com/sinzin91/sm_server_logs.git`
- install node packages: `npm i`
- These scripts SSH into the servers so you'll need to configure your `~/.ssh/config`.  
Set the hostname to `prod1, prod2, prod3` for production servers 1 through 3 respectively.

## check_prod_log.js
This script scans the latest production log

Usage: `node check_prod_log.js {scraper_class_name}`   

Example: `node check_prod_log poolzoom.com_poolsupplyunltd`

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
