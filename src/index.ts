import {TypedJSON} from "typedjson-npm";
import * as fs from 'fs';
import { Recipe} from "./model/Recipe";

fs.readFile('test/recipe_huber_only.json', (err, file) =>{

    let json = JSON.parse(file.toString());
    //console.log(json, "modules", json.modules);

    let recipe = new Recipe(json);

    recipe.test();

    console.log("Final Recipe", recipe.steps.get("S1").transitions[0]);
    /*
    let b = TypedJSON.parse(file.toString(), Recipe);

    console.log(b);

    b.test();
    */

});

