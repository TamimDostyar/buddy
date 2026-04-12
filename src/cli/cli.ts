import { SystemAIService } from "../system/systemService.js";
import { System } from "../config/config.js";
import * as readline from "readline";

class SystemCLI {
    async systemRunner(msg: string): Promise<void> {
        const systemService = new SystemAIService();
        const chat = await systemService.ollamaIntelligence(msg);
        console.log(chat);
    }
}

class SystemRunner {
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
            console.log("Thinking..... 😂")
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
}

const system = new SystemRunner();
system.runner();
