import {recipe_manager} from "./model/RecipeManager";

/*
let condition = Condition.create({
    type: "and",
    conditions:[
        { type: "time", duration: "4"},
        { type: "time", duration: "2"},
        { type: "or", conditions: [
                {type: "time", duration: 3},
                {type: "time", duration: 30}
            ]}
    ]
});
catRecipe.info(`Listening ${condition}`);
condition.listen((status) => {
    catRecipe.info(`Status: ${status}`)
    if (status)
        condition.clear();
});
*/

//const rm = new RecipeManager();

recipe_manager.loadRecipeFromPath('test/recipes/recipe_time_local.json');

recipe_manager.start();



/*

fs.readFile('test/recipes/recipe_p20_cif_testmodule.json', (err, file) =>{

    let json = JSON.parse(file.toString());

    let recipe = new Recipe(json);

    recipe.modules.forEach(async module => {
        try {
            await module.connect();

            await module.check_services();

            await module.disconnect();
        } catch (err) {
            catRecipe.error("something bad", err);
        }

    });
});

*/