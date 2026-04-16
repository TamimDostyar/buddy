import { SystemAIService } from "../system/systemService.js";
import { System } from "../config/config.js";
import * as readline from "readline";
import * as path from "path";
import { MemoryManagement } from "../memory/mem.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEMORY_DIR = path.resolve(__dirname, "../../.memoryChatSession");
const memoryManagement = new MemoryManagement();

class SystemCLI {
    async systemRunner(msg: string, history: any[]): Promise<string> {
        const systemService = new SystemAIService();

        // Map history from {user, output} to {role, content}
        const formattedHistory = history.flatMap(entry => [
            { role: "user" as const, content: entry.user },
            { role: "assistant" as const, content: entry.output }
        ]);

        const chat = await systemService.ollamaIntelligence(msg, formattedHistory);
        console.log(chat);
        return chat;
    }
}

export class SystemRunner {
    generateSessionNumber(): number {
        let randomInt = Math.floor(Math.random() * (9000 + 1))
        return randomInt;
    }

    createFile(sessionID: number): string {
        const memoryFile = `${sessionID}.json`;
        const filePath = path.join(MEMORY_DIR, memoryFile);

        const initMemoryForSystem = memoryManagement.initMemory(filePath);

        if (initMemoryForSystem != null) {
            return filePath;
        }
        return "Something went wrong";
    }

    runner() {
        const deviceName = System.SystemName;
        const deviceDesc = System.SystemDesc;
        console.log("This program has been initiated and is using: ", deviceName);
        console.log(deviceDesc);

        const sessionNumbr: number = this.generateSessionNumber();
        const fileSession: string = this.createFile(sessionNumbr);
        console.log("Session initiated, have fun");

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
            console.log("--\nGenerating.....\n--");

            const readData = await memoryManagement.readFiles(fileSession);
            const history = readData || [];

            const cli = new SystemCLI();
            const aiReply = await cli.systemRunner(input, history);
            console.log("");

            await memoryManagement.writeFile(fileSession, input, aiReply);

            messageAsInput.prompt();
        });

        messageAsInput.on('close', () => {
            console.log("Exiting...");
        });
    }
}

const system = new SystemRunner();
system.runner();
console.log(system.generateSessionNumber());