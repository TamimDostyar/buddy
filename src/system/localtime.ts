import {exec} from 'child_process'
import { useCallback } from 'react';



abstract class Timer{
    abstract currentTime(localZone: string): string[];
}

class GetLocal extends Timer{

    currentTime(localZone: string): string[]{
        let date :string = new Date().toLocaleDateString("en-US", {timeZone: `${localZone}`});
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: localZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
            });
        
        const formattedTime: string = formatter.format(new Date());
        return [formattedTime, date];
    }

    runShellCommand(cmd: string): Promise<string> {
        if (!cmd) {
            return Promise.reject(new Error("command is not provided"));
        }

        const normalized = cmd.toLocaleLowerCase();
        const allowed = "date";

        if (normalized.localeCompare(allowed) !== 0) {
            return Promise.reject(new Error(`only "${allowed}" is supported`));
        }

        return new Promise((resolve, reject) => {
            exec(normalized, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject(new Error(stderr));
                    return;
                }
                resolve(stdout.trim());
            });
        });
    }


}

// const localTime = new GetLocal();
// // console.log(localTime.currentTime("America/Chicago"));
// // localTime.runShellCommand('date').then(console.log).catch(console.error);

export {GetLocal};
