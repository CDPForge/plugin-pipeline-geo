import PipelinePluginI from "./PipelinePluginI";
import { Log } from '../types';
import { IP2Location } from 'ip2location-nodejs';
import Config from "../config";
import net from 'net';

export default class MyPlugin implements PipelinePluginI {
    private ip2locationIPv4: IP2Location;
    private ip2locationIPv6: IP2Location;

    constructor() {
        this.ip2locationIPv4 = new IP2Location();
        this.ip2locationIPv6 = new IP2Location();
        this.ip2locationIPv4.open(__dirname + `/db/${Config.getInstance().config.dbipv4}`);
        this.ip2locationIPv6.open(__dirname + `/db/${Config.getInstance().config.dbipv6}`);
    }

    elaborate(log: Log): Promise<Log | null> {
        if (!log.ip) {
            return Promise.resolve(log);
        }

        try {
            const lookup = net.isIP(log.ip) === 4 ? this.ip2locationIPv4.getAll(log.ip) : this.ip2locationIPv6.getAll(log.ip);
            
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
            console.error(`Error looking up IP ${log.ip}:`, error);
            return Promise.resolve(log);
        }
    }
}