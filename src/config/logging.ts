import {
    Category,
    CategoryConfiguration,
    CategoryLogFormat,
    CategoryServiceFactory,
    LoggerType,
    LogLevel,
    RuntimeSettings
} from "typescript-logging";
import {CustomLogger} from "./CustomLogger";


// Create categories, they will autoregister themselves
export const catRecipe = new Category("recipe");
export const catServer = new Category("server");
export const catModule = new Category("module");
export const catService = new Category("service");
export const catRM = new Category("recipeManager");
export const catOpc = new Category("opcua");


// Custom logging
export const messages: string[] = [];
// Configure to use our custom logger, note the callback which returns our CustomLogger from above.
const config = new CategoryConfiguration(
    LogLevel.Debug, LoggerType.Custom, new CategoryLogFormat(),
    (category: Category, runtimeSettings: RuntimeSettings) => new CustomLogger(category, runtimeSettings, messages)
);
CategoryServiceFactory.setDefaultConfiguration(config);
catRecipe.trace('start logging');

CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info), false);
CategoryServiceFactory.setConfigurationCategory(new CategoryConfiguration(LogLevel.Info), catServer);
