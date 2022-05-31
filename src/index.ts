import { getAsyncLifecycle } from "@openmrs/esm-framework";

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-cohort-builder";

  const options = {
    featureName: "cohort-builder",
    moduleName,
  };

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./cohort-builder"), options),
        route: "cohort-builder",
      },
    ],
    extensions: [
      {
        id: "Red box",
        load: getAsyncLifecycle(
          () => import("./boxes/extensions/red-box"),
          options
        ),
        slot: "Boxes",
      },
      {
        id: "Blue box",
        load: getAsyncLifecycle(
          () => import("./boxes/extensions/blue-box"),
          options
        ),
        slot: "Boxes",
        // same as `slots: ["Boxes"],`
      },
      {
        id: "Brand box",
        load: getAsyncLifecycle(
          () => import("./boxes/extensions/brand-box"),
          options
        ),
        slot: "Boxes",
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
