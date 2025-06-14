# CDP Forge Plugin Pipeline Geo

A plugin for enriching logs with geolocation data based on IP addresses in the CDP Forge Platform.

This plugin enhances log data by adding geographical information derived from IP addresses present in the logs. It integrates with the CDP Forge Platform's data processing pipeline to provide location-based insights.

CDP Forge Plugin Pipeline Geo uses the IP2Location LITE database for [IP geolocation](https://lite.ip2location.com).

## Features

- **IP Geolocation:** Automatically enriches logs with geographical data (country, city, coordinates) based on IP addresses
- **IP2Location Integration:** Uses IP2Location LITE database for accurate geolocation lookups
- **Plugin Pipeline:** Seamlessly integrates into the CDP Forge Platform's data processing pipeline

## Setup

1. Download the IP2Location LITE database from [IP2Location](https://lite.ip2location.com/)
2. Place the database file in the appropriate directory (see configuration)
3. Configure the `config.yml` file with your settings

Note: The IP2Location LITE database is not included in this repository due to licensing restrictions. Users must download it separately from the official IP2Location website.