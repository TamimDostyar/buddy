import { SystemAIService } from "../system/systemService.js";

class SystemCLI {
    async systemRunner(): Promise<void> {
        const systemService = new SystemAIService();
        const chat = await systemService.ollamaIntelligence("Hello chat!");
        console.log(chat);
    }
}

const cli = new SystemCLI();
void cli.systemRunner();