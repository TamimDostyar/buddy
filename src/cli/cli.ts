import { SystemAIService } from "../system/systemService.js";
import { System } from "../config/config.js";
import * as readline from "readline";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { MemoryManagement } from "../memory/mem.js";
import { existsSync } from "fs";
import { start } from "repl";
const MEMORY_DIR = path.resolve(__dirname, "../../.memoryChatSession");


class SystemCLI {
    async systemRunner(msg: string): Promise<void> {
        const systemService = new SystemAIService();
        const chat = await systemService.ollamaIntelligence(msg);
        console.log(chat);
    }
}

export class SystemRunner {
    // every time we run system runner we first create the session number for it
    generateSessionNumber(): number{
        let randomInt = Math.floor(Math.random() * (9000 + 1))
        return randomInt;
    }
    runner() {
        const deviceName = System.SystemName;
        const deviceDesc = System.SystemDesc;
        console.log("This program has been initiated and is using: ", deviceName);
        console.log(deviceDesc);

        const messageAsInput = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });

        messageAsInput.prompt();

        messageAsInput.on('line', async (input: string) => {
            if (input.trim() === ':q') {
                messageAsInput.close();
                return;
            }
            console.log("--")
            console.log("Generating.....")
            console.log("--")

            const cli = new SystemCLI();
            await cli.systemRunner(input);
            console.log("") // just to give some space
            messageAsInput.prompt();
        });

        messageAsInput.on('close', () => {
            console.log("Exiting...");
        });
    }

    readFile(){
        let memoryManagementSystem = new MemoryManagement();
        let startMemory = memoryManagementSystem.initMemory();
        let fullPath: string = MEMORY_DIR + "/" + startMemory;

        if (!existsSync(fullPath)){
            console.log("there was a problem\n");
        }
    }
}

const system = new SystemRunner();
// system.runner();
// console.log(system.generateSessionNumber());
