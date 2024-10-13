import { PlopGeneratorConfig } from "plop";
import { directorySelect } from "../core";
import { readdirSync } from "fs";

interface IServicePrompts {
	name: string;
	path: string;
}
const serviceGenerator: PlopGeneratorConfig = {
	description: "create service",
	prompts: async (inquirer): Promise<IServicePrompts> => {
		const result = { path: "", name: "" };

		const path = await directorySelect({
			basePath: "./src/pages",
			message: "Choose Your Page Module: ",
			validate: (path: string) => {
				const dir = readdirSync(path, { withFileTypes: true });
				return dir.findIndex((dirent) => dirent.name === "index.ts") !== -1;
			},
		});
		result.path = path;
		const filename = path.split("/").at(-1);

		if (filename) {
			result.name = filename;
		} else {
			const name = await inquirer.prompt({
				type: "input",
				name: "name",
			});

			result.name = name.name;
		}

		return Promise.resolve(result);
	},
	actions: [
		{
			type: "addMany",
			// TODO: create templates for service and implement addMany action to copy them
			base: "generators/service/templates/module",
			destination: "{{ path }}/services",
			templateFiles: "generators/service/templates/module/**",
			stripExtensions: ["hbs"],
			skip: (data: IServicePrompts) => {
				console.log(data.name);
				return true;
			},
		},
	],
};

export default serviceGenerator;
