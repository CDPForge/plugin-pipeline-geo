import type { Config } from '@cdp-forge/plugin-pipeline-sdk';

const config: Config['plugin'] = {
    name: 'geoPlugin',
    priority: 1,
    type: 'blocking',
    dbipv4: 'IP2LOCATION-LITE-DB11.BIN',
    dbipv6: 'IP2LOCATION-LITE-DB11.IPV6.BIN',
    dbDownloadUrl: 'https://www.ip2location.com/download/?token={GEO_DBTOKEN}&file={DATABASE_CODE}',
    dbcode: "DB11LITEBIN",
    dbcodeipv6: "DB11LITEBINIPV6",
    dbToken: process.env.GEO_DBTOKEN
}

export default config;



