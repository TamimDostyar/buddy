import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEMORY_DIR = path.resolve(__dirname, "../../.memoryChatSession");

export class MemoryManagement {
    initMemory(filePath: string): string {
        // if folder is not there create the folder
        if (!fs.existsSync(MEMORY_DIR)) {
            fs.mkdirSync(MEMORY_DIR, { recursive: true });
        } 
        // if file is not there then create the file
        if (!fs.existsSync(filePath)){
            fs.writeFileSync(filePath, "", "utf-8");
            return filePath;
        }
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            if (content === "") {
                console.log("Memory file exists but is empty.");
                return filePath;
            } else {
                console.log("Memory file exists and contains data.");
                return filePath;
            }
        } 
        catch (error) {
            console.error("Error reading the memory file:", error);
            return "There was an error reading the memory";
        }
        
        
    }
    readFiles(filePath: string) {
        if (!filePath.endsWith(".json")) return [];
    
        if (!fs.existsSync(filePath)) return [];
    
        try {
            const content = fs.readFileSync(filePath, "utf-8");
    
            if (!content || content.trim().length === 0) return [];
    
            const parsed = JSON.parse(content);
    
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Error reading or parsing the file:", error);
            return [];
        }
    }

    writeFile(filepath: string, userInput: string, aiOutput: string) {
        const date = new Date();
        const data = {
            user: userInput,
            output: aiOutput,
            time: date.toISOString()
        };
    
        let fileData = [];
        if (fs.existsSync(filepath)) {
            const content = fs.readFileSync(filepath, "utf-8");
            fileData = JSON.parse(content || "[]");
        }
        fileData.push(data);
        fs.writeFileSync(filepath, JSON.stringify(fileData, null, 2));
    }

}



// // testing
// let memoryManagementTest = new MemoryManagement();
// let systemSession = memoryManagementTest.initMemory();