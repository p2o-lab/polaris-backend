import {recipe_manager} from "./model/RecipeManager";
import {catMain,} from "./config/logging";
import * as fs from "fs";

async function main() {


    //recipe_manager.loadRecipeFromPath('test/recipes/recipe_p2o_cif_testmodule.json');


    let modulesOptions = JSON.parse(fs.readFileSync('test/modules/modules_achema.json').toString());
    recipe_manager.loadModule(modulesOptions);

    modulesOptions = JSON.parse(fs.readFileSync('test/modules/module_cif.json').toString());
    recipe_manager.loadModule(modulesOptions);

    recipe_manager.loadRecipeFromPath('test/recipes/recipe_time_local.json');

    catMain.info(`Loaded modules ${recipe_manager.modules}`);
    console.log(recipe_manager.modules);

    await recipe_manager.connect();
    let state = await recipe_manager.getServiceStates();
    catMain.info(JSON.stringify(state));

    recipe_manager.start()
        .on('completed', async () => {
            state = await recipe_manager.getServiceStates();
            catMain.info(`Final state of recipe ${JSON.stringify(state)}`);
            await recipe_manager.close();
        });

}

main();
