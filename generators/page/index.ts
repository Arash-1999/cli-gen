import type { PlopGeneratorConfig } from "plop";
import { config, layoutConfig, TLayout } from "../config";

const pageGenerator: PlopGeneratorConfig = {
  description: "Create Empty Page",
  prompts: async (inquirer) => {
    const result: Record<string, any> = {
      layout: { type: TLayout.None, config: {} },
    };
    result.path = await inquirer.prompt({
      type: "input",
      name: "path",
      message: "Page Url: ",
    });
    result.path = result.path.path;

    result.layout = await inquirer.prompt({
      type: "list",
      name: "type",
      message: "Choose Page Layout",
      choices: [
        { name: "Without Layout", value: TLayout.None },
        { name: "Normal Layout", value: TLayout.Normal },
        { name: "Dashboard Layout", value: TLayout.Dashboard },
        { name: "FAQ Layout", value: TLayout.Faq },
      ],
    });

    const layoutOptions = layoutConfig[result.layout.type];
    result.layout.config = {};
    result.layout.props = " ";

    for (let i = 0, len = layoutOptions.options.length; i < len; i++) {
      const option = layoutOptions.options[i];
      const answer = await inquirer.prompt({
        name: option.key,
        ...(option.type === "boolean"
          ? {
              type: "confirm",
              message: `Add '${option.key}'?`,
            }
          : option.type === "list"
            ? {
                type: "list",
                choices: option.options,
              }
            : {}),
      });
      result.layout.config[option.key] = answer[option.key];

      switch (option.type) {
        case "boolean":
          result.layout.props += `${option.key}${Boolean(answer[option.key]) ? "" : "={false}"} `;
          break;
        case "list":
          if (answer[option.key] !== "") {
            result.layout.props += `${option.key}='${answer[option.key]}' `;
          }
          break;
      }
    }
    result.name = result.path.split("/").at(-1);

    return Promise.resolve(result);
  },
  actions: [
    {
      type: "append",
      path: config.routerPath,
      pattern: /.* Lazy Imports \(start\) .*/i,
      template: `const {{ pascalCase name }} = lazy(() => import('${config.pagesPath}/{{path}}'))`,
    },
    {
      type: "append",
      pattern: /.* Routes \(start\) .*/i,
      path: config.routerPath,
      templateFile: "generators/page/templates/append-route.hbs",
    },
    {
      type: "addMany",
      // FIX: base path doesn't work
      base: "/page/templates/module",
      destination: "src/pages/{{path}}",
      templateFiles: "generators/page/templates/module/**",
      stripExtensions: ["hbs"],
    },
  ],
};

export default pageGenerator;
