import {recipe_manager} from "./model/RecipeManager";
import {catMain,} from "./config/logging";

async function main() {

    //recipe_manager.loadRecipeFromPath('test/recipes/recipe_time_local.json');
    recipe_manager.loadRecipeFromPath('test/recipes/recipe_p2o_cif_testmodule.json');

    await recipe_manager.connect();
    let state = await recipe_manager.getState();
    catMain.info(JSON.stringify(state));
    recipe_manager.start()
        .on('completed', async () => {
            state = await recipe_manager.getState();
            catMain.info(`Final state of recipe ${JSON.stringify(state)}`);
            await recipe_manager.close();
        });
}

main();
