const deviceInfo = process.platform;
let message = "";

function systemType(): { name: string, desc: string } {
    if (deviceInfo === "darwin") {
        const devicename = "MacOS";
        message = `system name is ${devicename}`;
        return { name: "Darwin", desc: message };

    } else if (deviceInfo === "win32") {
        const devicename = "Windows";
        message = `system name is ${devicename}`;
        return { name: "Windows", desc: message };
    } else if (deviceInfo === "linux") {
        const devicename = "Linux";
        message = `system name is ${devicename}`;
        return { name: "Linux", desc: message };
    } else {
        message = `Unknown system platform: ${deviceInfo}`;
        return { name: "Unknown", desc: message };
    }
}

export {systemType};

// console.log(systemType());
// console.log(message);
