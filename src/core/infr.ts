import { readFile } from "node:fs/promises";
import { join } from "node:path";



interface MarkdownFiles{
    filepath: string;
    content: string;
}


class MCPStyle{
    private skills;
    private tasks;
    
    constructor(skill: string, task: string){
        this.skills = skill;
        this.tasks = task;
    }


    readSkillFile(){
        const filepath = join(__dirname, this.skills);

    }


}
    `
        my goal in this ststen function is as followed:
            -> call the main infr -> reads the entire skills no matter what -> decision part(class decide);
            -> if task is given, then it needs to find the specific skill;
            -> otherwise continues
            -? leaving it incomplete for now
    `


class Infrustructure{
    private skill;
    private content;
    constructor(skill: String, content: String){this.skill = skill, this.content = content};

    systemInfr(){
        var infrusture = new MCPStyle(this.skill, this.content);
    }

}