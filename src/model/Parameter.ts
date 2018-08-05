export interface ParameterOptions {
    name: string;
    // default: "VExt" für variable wenn nicht angegeben
    variable: string;
    value: any;
}


export class Parameter {
    name: string;
    variable: string = "VExt";
    value: any;
}