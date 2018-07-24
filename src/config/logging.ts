import {Category, CategoryConfiguration, CategoryServiceFactory, LogLevel} from "typescript-logging";

// Optionally change default settings, in this example set default logging to Info.
// Without changing configuration, categories will log to Error.
CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Trace));

// Create categories, they will autoregister themselves
export const catRecipe = new Category("recipe");
export const catRM = new Category("recipeManager");
export const catOpc = new Category("opcua");
export const catServer = new Category("server");

// Optionally get a logger for a category, since 0.5.0 this is not necessary anymore, you can use the category itself to log.
// export const log: CategoryLogger = CategoryServiceFactory.getLogger(cat);