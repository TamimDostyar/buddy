import { systemType } from "../infr/device.js";

const device = systemType();

const System = {
    SystemName: device.name, // based on the device name we will open the requested shell
    SystemDesc: device.desc,
    DEFAULT_PORT: 3000, // default port we will use for this system
};

const MODEL: string = "granite4:3b";
export { MODEL, System };