import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let systemProfileSystem = path.resolve(__dirname, "../../profile/profile.json");

class Default_System{
    updateFile(){
        return "update file"
    }
}


let ds = new Default_System();
let allComamands: string[] = ["quit", "update"]

class CmdSystem{
    quitSystem(msgAsInput: any){
        msgAsInput.close();
    }
    settingsSystem(){
        return "This is the settings";
    }

    profileSystem(input: string){
        input = input.toLocaleLowerCase();
        const isCMD_valid = allComamands.includes(input) ? true: false
        if (isCMD_valid === false){
            return "command not found"
        }
        if (!fs.existsSync(systemProfileSystem)){
            return "File was not found";
        }

        // if file exist and command is valid
        let readFile = JSON.parse(fs.readFileSync(systemProfileSystem, "utf-8"))

        // data from the file;
        if (input === "update"){
            ds.updateFile();
        }


        
        return readFile;
    }

    historySystem(){
        return "History is here";
    }

    agenticSystem(){
        return "agentic system";
    }

    skillsSystem(){
        return "skills";
    }
}


// commander("quit");

export {CmdSystem};

let system = new CmdSystem();
console.log(system.profileSystem("settings"))