# Sample Linky data app and lib

This app aims to collect your data from the Enedis customer web site and push them to a [Warp 10™](http://www.warp10.io) 
instance.

## Features

- WebSite
 - bulk data fetch and push from Enedis to Warp 10™
 - Consumption history (day / month / year)
 - Load duration curve
 - Month consumption spectrum
- Daily cron to keep data up to date

## Install

    $ yarn install
    
## Configuration

    $ cp src/conf-template.json src/conf.json
    
Don't forget to edit this file with YOUR parameters.
    
## Run
    
    $ yarn start
    
Go to http://127.0.0.1:3000.
    
## Cron command

    $ node src/cron.js

## RoadMap

- Enedis data connect implementation
- More data viz and analysis
