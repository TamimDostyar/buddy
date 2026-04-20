import { SystemAIService, UserProfile } from "../system/systemService.js";
import { System } from "../config/config.js";
import * as readline from "readline";
import * as path from "path";
import * as fs from "fs";
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

    async preQuery(): Promise<void> {
        const file_path = path.resolve(__dirname, "../../profile/profile.json");
        const queryProfile = new UserProfile();
        const schema = await queryProfile.createProfile();

        if (typeof schema === "string") {
            console.error("Error loading profile schema:", schema);
            return;
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const ask = (question: string): Promise<string> =>
            new Promise(resolve => rl.question(question, resolve));

        const answers: Record<string, string> = {};
        const fields = ["userProfile", "userRole", "userAIchoice", "useraltChoice"] as const;

        for (const key of fields) {
            const field = (schema as any)[key];
            if (!field) continue;

            let prompt = `\n${field.label}`;
            if (field.help) prompt += `\n  ${field.help}`;

            if (field.type === "select" && Array.isArray(field.options)) {
                field.options.forEach((opt: string, i: number) => {
                    prompt += `\n  ${i + 1}. ${opt}`;
                });
                prompt += "\nEnter number: ";
                const raw = await ask(prompt);
                const idx = parseInt(raw.trim(), 10) - 1;
                answers[key] = field.options[idx] ?? raw.trim();
            } else {
                prompt += "\n> ";
                answers[key] = (await ask(prompt)).trim();
            }
        }

        rl.close();
        fs.mkdirSync(path.dirname(file_path), { recursive: true });
        fs.writeFileSync(file_path, JSON.stringify(answers, null, 2));
        console.log("\nProfile saved! Starting buddy...\n");
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

async function main() {
    const profilePath = path.resolve(__dirname, "../../profile/profile.json");
    const profileContent = fs.existsSync(profilePath)
        ? fs.readFileSync(profilePath, "utf-8")
        : "";

    if (!profileContent || profileContent.trim().length === 0) {
        console.log("Welcome! Let's set up your profile first.");
        await system.preQuery();
    }

    system.runner();
}

main();