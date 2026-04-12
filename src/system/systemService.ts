import { Ollama } from "ollama";
import { MODEL } from "../config/config.js";

class SystemAIService {

    async ollamaIntelligence(userPrompt: string) {
        const ollama = new Ollama();
        const response = await ollama.generate({
            model: MODEL,
            prompt: userPrompt
        });

        return response.response;
    }

    systemService() {
        console.log("System service");
    }
}

export { SystemAIService };