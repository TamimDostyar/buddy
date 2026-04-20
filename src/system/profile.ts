import path from "node:path";
import * as fs from "fs";
import { parse } from 'yaml';



interface ProfileQueries{
    name: string;
    userRole: string;
    userAIchoice: [];
    userAltChoice: string;
  };


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

export {UserProfile};