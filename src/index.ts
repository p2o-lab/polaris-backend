import {recipe_manager} from "./model/RecipeManager";
import {catMain,} from "./config/logging";
import * as fs from "fs";

async function main() {

    let modulesOptions = JSON.parse(fs.readFileSync('test/modules/modules_achema.json').toString());
    recipe_manager.loadModule(modulesOptions);
    let modulesOptionsCif = JSON.parse(fs.readFileSync('test/modules/module_cif.json').toString());
    recipe_manager.loadModule(modulesOptionsCif);

    catMain.info(`Loaded modules ${recipe_manager.modules.map(module => module.id)}`);

    // await Promise.all(recipe_manager.modules.map(module => module.connect()));
    // catMain.info("All modules connected");

    //recipe_manager.loadRecipeFromPath('test/recipes/recipe_dosierer_only.json');
    //recipe_manager.loadRecipeFromPath('test/recipes/recipe_reactor_only.json');
    //recipe_manager.loadRecipeFromPath('test/recipes/recipe_huber_only.json');
    //recipe_manager.loadRecipeFromPath('test/recipes/recipe_time_local.json');
    recipe_manager.loadRecipeFromPath('test/recipes/recipe_p2o_cif_testmodule.json');

        await recipe_manager.connect();

        let state = await recipe_manager.getServiceStates();
        catMain.info(`States of services: ${JSON.stringify(state)}`);


        catMain.info(`Start recipe ...`);
        recipe_manager.start()
            .on('completed', async () => {
                state = await recipe_manager.getServiceStates();
                catMain.info(`Final state of recipe ${JSON.stringify(state)}`);
                await recipe_manager.close();
            });

}

main();
