import { PipelinePluginI, Log, Config } from '@cdp-forge/plugin-pipeline-sdk';
import { IP2Location } from 'ip2location-nodejs';
import net from 'net';
import fs from 'fs';
import path from 'path';

export default class MyPlugin implements PipelinePluginI {
    private config: Config;
    private ip2locationIPv4: IP2Location;
    private ip2locationIPv6: IP2Location;
    private ipv4Path: string;
    private ipv6Path: string;
    constructor(config: Config) {
        this.config = config;
        this.ip2locationIPv4 = new IP2Location();
        this.ip2locationIPv6 = new IP2Location();
        this.ipv4Path = path.join(__dirname, 'db', config.dbipv4);
        this.ipv6Path = path.join(__dirname, 'db', config.dbipv6);
    }

    elaborate(log: Log): Promise<Log | null> {
        if (!log.device?.ip) {
            return Promise.resolve(log);
        }

        try {
            const lookup = net.isIP(log.device.ip) === 4 ?
                this.ip2locationIPv4.getAll(log.device.ip) :
                this.ip2locationIPv6.getAll(log.device.ip);

            if (!log.geo) {
                log.geo = {};
            }

            log.geo.zipCode = lookup?.zipCode;
            log.geo.country = lookup?.countryLong;
            log.geo.region = lookup?.region;
            log.geo.city = lookup?.city;
            log.geo.timeZone = lookup?.timeZone;
            log.geo.point = {
                type: 'Point',
                coordinates: [Number(lookup?.longitude), Number(lookup?.latitude)]
            };

            return Promise.resolve(log);
        } catch (error) {
            console.error(`Error looking up IP ${log.device.ip}:`, error);
            return Promise.resolve(log);
        }
    }

    async init(): Promise<void> {
        if (!fs.existsSync(this.ipv4Path)) {
            fs.mkdirSync(path.dirname(this.ipv4Path), { recursive: true });
            await this.downloadDatabase(this.config.dbDownloadUrl.replace('{DATABASE_CODE}', this.config.dbcode), this.ipv4Path);
        }

        if (!fs.existsSync(this.ipv6Path)) {
            fs.mkdirSync(path.dirname(this.ipv6Path), { recursive: true });
            await this.downloadDatabase(this.config.dbDownloadUrl.replace('{DATABASE_CODE}', this.config.dbcodeipv6), this.ipv6Path);
        }
        
        this.ip2locationIPv4.open(this.ipv4Path);
        this.ip2locationIPv6.open(this.ipv6Path);
    }

    async downloadDatabase(url: string, dest: string): Promise<void> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Download fallito: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
    }
}