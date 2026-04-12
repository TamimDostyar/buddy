import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ollama } from "ollama";
import { MODEL } from "../config/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class SystemAIService {
    async readMarkdownFile(filePath: string): Promise<string> {
        const fullPath = path.resolve(__dirname, filePath);
        const content = await readFile(fullPath, "utf-8");
        return content;
    }

    async ollamaIntelligence(userPrompt: string): Promise<string> {
        const mdContent = await this.readMarkdownFile("../../skills/init.md");

        const ollama = new Ollama();
        const response = await ollama.generate({
            model: MODEL,
            system: mdContent,
            prompt: userPrompt,
        });

        return response.response;
    }

    systemService() {
        console.log("System service");
    }
}

export { SystemAIService };