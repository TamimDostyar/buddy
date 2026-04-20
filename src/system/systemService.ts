import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ollama, type Config } from "ollama";
import { MODEL } from "../config/config.js";
import * as fs from "fs";
import { parse } from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
interface ProfileQueries{
  name: string;
  userRole: string;
  userAIchoice: [];
  userAltChoice: string;
};


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

class UserProfile{

  async createProfile(){

    let file_path = path.resolve(__dirname, 
      "../../profile/profile.json"
    )

    let profileQuestions = path.resolve(
      __dirname, "profile.yml"
    )
    if (!fs.existsSync(profileQuestions)){
      return "File path for the profile question is not valid"
    };

    // If profile.json doesn't exist or is empty, return the yml schema for questionnaire
    if (!fs.existsSync(file_path)) {
      const profileFile = fs.readFileSync(profileQuestions, 'utf-8');
      const config: ProfileQueries = parse(profileFile);
      return config;
    }

    let readProfileJson = fs.readFileSync(file_path, 'utf-8');

    if (!readProfileJson || readProfileJson.trim().length === 0) {
      const profileFile = fs.readFileSync(profileQuestions, 'utf-8');
      const config: ProfileQueries = parse(profileFile);
      return config;
    } else {
      const profileFile = fs.readFileSync(file_path, 'utf-8');
      const config: ProfileQueries = JSON.parse(profileFile);
      return config;
    }
  }
}

export { SystemAIService, UserProfile };