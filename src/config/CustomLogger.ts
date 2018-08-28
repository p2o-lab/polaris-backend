import {AbstractCategoryLogger, Category, CategoryLogMessage, RuntimeSettings} from "typescript-logging";

export class CustomLogger extends AbstractCategoryLogger {

    private messages: string[] = [];

    // The first two parameters are required, the 3rd is our parameter
    // where we give this logger an array and log all messages to that array.
    constructor(category: Category, runtimeSettings: RuntimeSettings, messages: string[]) {
        super(category, runtimeSettings);
        this.messages = messages;
    }

    // This is the only thing you really need to implement. In this case
    // we just write the complete message to the array.
    protected doLog(msg: CategoryLogMessage): void {
        // Note: we use createDefaultLogMessage() to spit it out formatted and all
        // however you're free to print in any way you like, the data is all
        // present on the message.
        const message = this.createDefaultLogMessage(msg);
        this.messages.push(message);
        console.log(message);
    }
}
