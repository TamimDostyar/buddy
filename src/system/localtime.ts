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


}

// const localTime = new GetLocal();
// console.log(localTime.currentTime("America/Chicago"));

export {GetLocal};
