process.env.NODE_ENV = process.env.NODE_ENV || "test";

const { findArgsFromCli } = require("../lib/args");

// Make sure this is called before "paths" is imported.
findArgsFromCli();

const { log } = require("../lib/logger");
const { getCraPaths, test, getReactScriptVersionInformation } = require("../lib/cra");
const { overrideJest } = require("../lib/features/jest/override");
const { loadCracoConfigAsync } = require("../lib/config");

log("Override started with arguments: ", process.argv);
log("For environment: ", process.env.NODE_ENV);

const context = {
    env: process.env.NODE_ENV
};

loadCracoConfigAsync(context).then(cracoConfig => {
    context.paths = getCraPaths(cracoConfig);

    const { isSupported, version } = getReactScriptVersionInformation(cracoConfig);
    if (!isSupported) {
        throw new Error(
            `Your current version of react-scripts(${version}) is not supported by this version of CRACO. Please try updating react-scripts to the latest version:\n\n` +
                `   $ yarn upgrade react-scripts\n\n` +
                "Or:\n\n" +
                `   $ npm update react-scripts\n\n` +
                `If that doesn't work or if you can't, refer to the following table to choose the right version of CRACO.\n` +
                "https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#backward-compatibility"
        );
    }
    overrideJest(cracoConfig, context);
    test(cracoConfig);
});
