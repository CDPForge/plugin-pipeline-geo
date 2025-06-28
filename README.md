# CDP Forge Plugin Pipeline Geo

A plugin for enriching logs with geolocation data based on IP addresses in the CDP Forge Platform.

This plugin enhances log data by adding geographical information derived from IP addresses present in the logs. It integrates with the CDP Forge Platform's data processing pipeline to provide location-based insights.

CDP Forge Plugin Pipeline Geo uses the IP2Location LITE database for [IP geolocation](https://lite.ip2location.com).

## Features

- **IP Geolocation:** Automatically enriches logs with geographical data (country, city, coordinates) based on IP addresses
- **IP2Location Integration:** Uses IP2Location LITE database for accurate geolocation lookups
- **Plugin Pipeline SDK:** Built using the official CDP Forge Plugin Pipeline SDK for seamless integration
- **Kafka Integration:** Leverages Kafka for asynchronous communication and data streaming between pipeline stages
- **TypeScript:** Written in TypeScript for improved code maintainability, type safety, and developer productivity

## Setup

1. Download the IP2Location LITE database from [IP2Location](https://lite.ip2location.com/)
2. Place the database file in the `db` directory with the correct filename
3. Configure the plugin using the configuration files in the `config` directory
4. Implement the `elaborate` function in the `Plugin.ts` class

Note: The IP2Location LITE database is not included in this repository due to licensing restrictions. Users must download it separately from the official IP2Location website.

## Configuration

The plugin uses two configuration files:

### `config/config.yml`
Contains the main plugin configuration including Kafka settings and database file paths.

### `config/plugin.yml`
Contains the plugin-specific configuration including input/output topics and other pipeline settings.

## Plugin Development

The plugin is built using the CDP Forge Plugin Pipeline SDK, which provides:

- **Simplified Configuration:** Automatic configuration management through the SDK
- **Pipeline Integration:** Seamless integration with the CDP Forge pipeline system
- **Error Handling:** Built-in error handling and logging
- **Type Safety:** Full TypeScript support with proper type definitions

### Implementation

To create a new plugin, simply:

1. Extend the base plugin class from the SDK
2. Implement the `elaborate` function with your custom logic
3. Configure the plugin using the YAML configuration files

The SDK handles all the complex pipeline management, Kafka integration, and configuration loading automatically.

## Building and Running

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Start the plugin
npm start
```