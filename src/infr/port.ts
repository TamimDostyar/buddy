import { System } from "../config/config.js";
import { getPort, checkPort } from "get-port-please";


async function main() {
    const portToCheck = System.DEFAULT_PORT;

    const isAvailable = await checkPort(portToCheck);

    if (typeof portToCheck !== "number") {
        console.log("Port must be number.");
    }

    if (isAvailable) {
        console.log(`Port ${portToCheck} is available.`);
    } else {
        console.log(`Port ${portToCheck} is NOT available.`);
    }

    const port = await getPort(portToCheck);
    console.log(`Using port: ${port}`);
}

main().catch((err) => {
    console.error("Error in port check:", err);
});
