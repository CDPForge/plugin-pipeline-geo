import MyPlugin from '../src/plugin/Plugin';
import { Log } from '../src/types';
import { IP2Location } from 'ip2location-nodejs';

// Mock IP2Location
jest.mock('ip2location-nodejs');

describe('MyPlugin', () => {
    let plugin: MyPlugin;
    let mockIP2Location: jest.Mocked<IP2Location>;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Create mock instance
        mockIP2Location = new IP2Location() as jest.Mocked<IP2Location>;
        (IP2Location as jest.Mock).mockImplementation(() => mockIP2Location);
        
        // Create plugin instance
        plugin = new MyPlugin();
    });

    it('should return unmodified log when no IP is present', async () => {
        const log: Log = {
            client: 1,
            date: '2024-03-20',
            device: { id: 'test-device' },
            event: 'test-event',
            instance: 1,
            page: { title: 'test-page' },
            session: 'test-session'
        };

        const result = await plugin.elaborate(log);
        expect(result).toEqual(log);
        expect(mockIP2Location.getAll).not.toHaveBeenCalled();
    });

    it('should enrich log with IPv4 geolocation data', async () => {
        const mockLookup = {
            ip: '8.8.8.8',
            ipNo: '134744072',
            countryShort: 'IT',
            countryLong: 'Italy',
            region: 'Lazio',
            city: 'Rome',
            isp: 'Google LLC',
            domain: 'google.com',
            zipCode: '00100',
            timeZone: 'Europe/Rome',
            latitude: '41.9028',
            longitude: '12.4964',
            netSpeed: 'T1',
            iddCode: '39',
            areaCode: '6',
            weatherStationCode: 'ITRM0008',
            weatherStationName: 'Rome',
            mcc: '222',
            mnc: '01',
            mobileBrand: 'TIM',
            elevation: '21',
            usageType: 'DCH',
            addressType: 'Anycast',
            category: 'Search Engine',
            district: 'Rome',
            as: 'AS15169 Google LLC',
            asn: '15169'
        };

        mockIP2Location.getAll.mockReturnValue(mockLookup);

        const log: Log = {
            client: 1,
            date: '2024-03-20',
            device: { id: 'test-device' },
            event: 'test-event',
            instance: 1,
            page: { title: 'test-page' },
            session: 'test-session',
            ip: '8.8.8.8'
        };

        const result = await plugin.elaborate(log);

        expect(result?.geo).toEqual({
            country: 'Italy',
            region: 'Lazio',
            city: 'Rome',
            zipCode: '00100',
            timeZone: 'Europe/Rome',
            point: {
                type: 'Point',
                coordinates: [12.4964, 41.9028]
            }
        });
    });

    it('should handle lookup errors gracefully', async () => {
        mockIP2Location.getAll.mockImplementation(() => {
            throw new Error('Lookup failed');
        });

        const log: Log = {
            client: 1,
            date: '2024-03-20',
            device: { id: 'test-device' },
            event: 'test-event',
            instance: 1,
            page: { title: 'test-page' },
            session: 'test-session',
            ip: '8.8.8.8'
        };

        const result = await plugin.elaborate(log);
        expect(result).toEqual(log);
    });

    it('should use IPv6 database for IPv6 addresses', async () => {
        const mockLookup = {
            ip: '2001:4860:4860::8888',
            ipNo: '42541956123769884636017138956568135816',
            countryShort: 'US',
            countryLong: 'United States',
            region: 'California',
            city: 'Mountain View',
            isp: 'Google LLC',
            domain: 'google.com',
            zipCode: '94043',
            timeZone: 'America/Los_Angeles',
            latitude: '37.4056',
            longitude: '-122.0775',
            netSpeed: 'T1',
            iddCode: '1',
            areaCode: '650',
            weatherStationCode: 'USCA0746',
            weatherStationName: 'Mountain View',
            mcc: '310',
            mnc: '120',
            mobileBrand: 'Sprint',
            elevation: '32',
            usageType: 'DCH',
            addressType: 'Anycast',
            category: 'Search Engine',
            district: 'Santa Clara',
            as: 'AS15169 Google LLC',
            asn: '15169'
        };

        mockIP2Location.getAll.mockReturnValue(mockLookup);

        const log: Log = {
            client: 1,
            date: '2024-03-20',
            device: { id: 'test-device' },
            event: 'test-event',
            instance: 1,
            page: { title: 'test-page' },
            session: 'test-session',
            ip: '2001:4860:4860::8888'
        };

        const result = await plugin.elaborate(log);

        expect(result?.geo).toEqual({
            country: 'United States',
            region: 'California',
            city: 'Mountain View',
            zipCode: '94043',
            timeZone: 'America/Los_Angeles',
            point: {
                type: 'Point',
                coordinates: [-122.0775, 37.4056]
            }
        });
    });
}); 