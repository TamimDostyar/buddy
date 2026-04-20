import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ollama, type Config } from "ollama";
import { MODEL } from "../config/config.js";
import * as fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

class SystemAIService {
  private ollama = new Ollama();

  async readMarkdownFile(filePath: string): Promise<string> {
    const fullPath = path.resolve(__dirname, filePath);
    return await readFile(fullPath, "utf-8");
  }

  async ollamaIntelligence(
    userPrompt: string,
    priorMessages: Message[] = []
  ): Promise<string> {
    const systemPrompt = await this.readMarkdownFile(
      "../../skills/init.md"
    );
    const systemProfile = path.resolve(__dirname, 
      "../../profile/profile.json"
    )
    const readSystemProfile = fs.readFileSync(systemProfile, 'utf-8');
    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      ...priorMessages,
      { role: "system", content: readSystemProfile },
      ...priorMessages,
      { role: "user", content: userPrompt }
    ];

    const response = await this.ollama.chat({
      model: MODEL,
      messages
    });

    return response.message.content;
  }

  systemService() {
    console.log("System service");
  }
}


export { SystemAIService };