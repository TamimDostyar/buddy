import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { SystemRunner } from "../cli/cli.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEMORY_DIR = path.resolve(__dirname, "../../.memoryChatSession");

let systemRunner = new SystemRunner();
let sessionID: number = systemRunner.generateSessionNumber();


const memoryFile = `${sessionID}.json`;
const filePath = path.join(MEMORY_DIR, memoryFile);

class MemoryManagement {
    initMemory() {
        if (!fs.existsSync(MEMORY_DIR)) {
            fs.mkdirSync(MEMORY_DIR, { recursive: true });
        }
        
        if (!fs.existsSync(filePath)) {
            console.log("Memory file does not exist. Creating a new one...");
            fs.writeFileSync(filePath, "test", "utf-8");
        } else {
            try {
                const content = fs.readFileSync(filePath, "utf-8");
                if (content === "") {
                    console.log("Memory file exists but is empty.");
                } else {
                    console.log("Memory file exists and contains data.");
                }
            } catch (error) {
                console.error("Error reading the memory file:", error);
            }
        }
        
    }
}


// testing
let memoryManagementTest = new MemoryManagement();
let systemSession = memoryManagementTest.initMemory();