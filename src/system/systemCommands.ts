import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from "fs";
import * as readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const systemProfileSystem = path.resolve(__dirname, "../../profile/profile.json");

class Default_System{
    updateFile(){
        let fileOutput = this.readFile();
        let amount: number = Object.keys(fileOutput).length

        const rl = readline.createInterface(
        {
        input: process.stdin,
        output: process.stdout
        });
        rl.question(`What would you like to update select based on number: 1 - ${amount}? `, (answer) => {
        const num = Number(answer);

        if (this.isNumber(num)){
            if (num > amount || num < 1){
                console.log(`Number must be between 1 - ${amount}`);
                rl.close();
                return;
            }
            let index = num - 1;
            let chosenNumKey = Object.keys(fileOutput)[index] as string;
            let chosenNumValue = fileOutput[chosenNumKey];
            console.log(`You want to update\n`);
            console.log(`${chosenNumKey} --> ${chosenNumValue}`);
            
            rl.question(`Enter new value for ${chosenNumKey}: `, (newValue) => {
                this.saveData(index, newValue);
                console.log(`Successfully updated ${chosenNumKey} to ${newValue}`);
                rl.close();
            });

        } else{
            console.log("pick a valid number instead")
            rl.close();
        }});

    }
    
    saveData(itemNumber: number, data: unknown) {
        const fileOutput = this.readFile();             
        const keys = Object.keys(fileOutput);           
        const keyToUpdate = keys[itemNumber] as string;         
        fileOutput[keyToUpdate] = data;

        fs.writeFileSync(systemProfileSystem, JSON.stringify(fileOutput, null, 4), "utf-8");
    }

    
    isNumber(answer: unknown): answer is number {
        return typeof answer === 'number' && !isNaN(answer);
    }

    readFile(){
        if (!fs.existsSync(systemProfileSystem)){
            return "File was not found";
        }

        let readFile = fs.readFileSync(systemProfileSystem, "utf-8");
        let data = JSON.parse(readFile);
        return data;
    }
}


let ds = new Default_System();
const allComamands: string[] = ["update"];

class CmdSystem{
    quitSystem(msgAsInput: readline.Interface){
        msgAsInput.close();
    }
    settingsSystem(){
        return "This is the settings";
    }

    profileSystem(input: string){
        input = input.toLocaleLowerCase();
        const isCMD_valid = allComamands.includes(input);

        if (!isCMD_valid){
            return "command not found"
        }

        // if file exist and command is valid
        let profileData = ds.readFile();

        if (input === "update"){
            console.log("========================");
            console.log(profileData);
            console.log("========================");
            console.log("\n");
            console.log("========================");
            console.log("Answer below if you want to get your profile updated");
            console.log("========================");
            ds.updateFile();
        }
        return;
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
system.profileSystem("update");