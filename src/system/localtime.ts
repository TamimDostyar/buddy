import { fileURLToPath } from 'url';


interface LocationResponse{
    ip: string;
    city: string;
    region: string;
    country_name: string;
    latitude: number;
    longitude: number;
}


abstract class Timer{
    abstract currentTime(): Date;
    abstract getPublicIp(): Promise<string>;
    abstract getLocationFromIP(ipAddress: string): Promise<LocationResponse | null>;
}

class GetLocal extends Timer{

    currentTime(): Date {
        let date :Date = new Date();
        return date;
    }


    getPublicIp = async (): Promise<string> => {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error(`Failed to fetch public IP: ${response.status}`);
        }

        const data = (await response.json()) as { ip?: string };
        if (!data.ip) {
            throw new Error('Public IP not found in response');
        }

        return data.ip;
    };


    async getLocationFromIP(ipAddress: string): Promise<LocationResponse | null> {
        try {
            const response = await fetch(`https://ipapi.com/${ipAddress}/json/`);
            const data: LocationResponse = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching location:', error);
            return null;
        }
    }
}


const localTime = new GetLocal();

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
    void (async () => {
        const location = await localTime.getPublicIp();
        localTime.getLocationFromIP(location).then(location => {
            if (location){
                console.log(`Location: ${location.city}, ${location.country_name}`);
                console.log(`Coords: ${location.latitude}, ${location.longitude}`);
            }
        }
        )
    })();
}

export { localTime };