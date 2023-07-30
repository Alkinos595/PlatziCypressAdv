const { defineConfig } = require("cypress");
//const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin");
const webpack = require("@cypress/webpack-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");

const values = {};

const allureWriter = require('@shelex/cypress-allure-plugin/writer');

async function setupNodeEvents(on, config) {
  // implement node event listeners here
  //addMatchImageSnapshotPlugin(on, config)

  config.env.variable = process.env.NODE_ENV ?? "no hay variable";
  on("task", {
    guardar(valor) {
      //get the key from the valor
      const key = Object.keys(valor)[0];
      //get the value from the valor
      values[key] = valor[key];
      //siempre debes de regresar algo sino va a fallar
      return null;
    },
    obtener(key) {
      console.log("values", values);
      return values[key] ?? "no hay valor";
    },
  });
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        resolve: {
          extensions: [".ts", ".js"],
        },
        module: {
          rules: [
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );
  allureWriter(on, config);
  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  projectId: 'INSERT ID',
/*   reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  }, */
  e2e: {
    specPattern: "**/*.feature",
    supportFile: false,
    setupNodeEvents,
    baseUrl: 'https://pokedexpokemon.netlify.app',
    retries: 2,
    /* retries: {
      // Configure retry attempts for `cypress run`
      // Default is 0
      runMode: 2,
      // Configure retry attempts for `cypress open`
      // Default is 0
      openMode: 0,
    }, */
    /* env: {
      credentials: {
        user: "username",
        password: "password",
      },
    }, */
    /* env: {
      //allure: true, 
      allureReuseAfterSpec: true
    } */
  },
});

//npm uninstall cypress-image-snapshot   
