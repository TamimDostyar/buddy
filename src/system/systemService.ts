import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ollama, type Config } from "ollama";
import { MODEL } from "../config/config.js";
import { GetLocal } from "./localtime.js";
import * as fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

// const ollama = new Ollama();
// const getLocalTime = new GetLocal();
class SystemAIService {
  private ollama = new Ollama();
  private getLocalTime = new GetLocal();
  
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

    const currentTime = await this.getLocalTime.runShellCommand("date");

    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `Current date: ${currentTime}` },
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