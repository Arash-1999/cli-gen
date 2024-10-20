import { PlopGeneratorConfig } from "plop";
import { directorySelect } from "../core";
import { readdirSync } from "fs";
import { config } from "../config";

type TServices = "rest-api" | "icon";
interface IServicePrompts {
	name: string;
	path: string;
	serviceTypes: Set<TServices>;
	imagesPath: string;
}
const serviceGenerator: PlopGeneratorConfig = {
	description: "create service",
	prompts: async (inquirer): Promise<IServicePrompts> => {
		const result: IServicePrompts = {
			path: "",
			name: "",
			serviceTypes: new Set<TServices>(),
			imagesPath: "",
		};

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
		result.imagesPath = path.replace("/src/pages", "");

		if (filename) {
			result.name = filename;
		} else {
			const name = await inquirer.prompt({
				type: "input",
				name: "name",
			});

			result.name = name.name;
		}

		const services = await inquirer.prompt({
			message: "Select types of serivces: ",
			name: "types",
			type: "checkbox",
			choices: [
				{ name: "Icon", value: "icon" },
				{ name: "Rest API", value: "rest-api" },
			],
			validate: (value) => {
				if (
					(Array.isArray(value) && value.length === 0) ||
					!Array.isArray(value)
				) {
					return "Select at least one types of service";
				}
				return true;
			},
		});
		result.serviceTypes = new Set<TServices>(...services.types);

		return Promise.resolve(result);
	},
	actions: [
		/*** create servcies folder (start) ***/
		{
			type: "add",
			path: "{{ path }}/services/index.ts",
			template: "",
		},
		/*** create servcies folder (end) ***/

		/*** Rest API section (start) ***/
		{
			type: "addMany",
			base: "generators/service/templates/module",
			destination: "{{ path }}/services",
			templateFiles: "generators/service/templates/module/**",
			stripExtensions: ["hbs"],
			skip: (data: IServicePrompts) => {
				return !data.serviceTypes.has("rest-api");
			},
		},
		{
			type: "append",
			skip: (data: IServicePrompts) => {
				return !data.serviceTypes.has("rest-api");
			},
			template:
				"export { {{ pascalCase name }}ApiService } from './api.service.ts';",
		},
		/*** Rest API section (end) ***/

		/*** icon service (start) ***/
		{
			type: "append",
			skip: (data: IServicePrompts) => {
				return !data.serviceTypes.has("icon");
			},
			template:
				"export { {{ pascalCase name }}Vecotr } from './vector.service.ts';",
		},
		{
			type: "add",
			templateFile: "generators/service/templates/vector.svg",
			path: `${config.assetsPath}/{{ imagesPath }}/{{ dashCase name }}.vector.svg`,
		},
		{
			type: "add",
			templateFile: "generators/service/templates/iocn.service.hbs",
			path: "{{ path }}/services/icon.service.ts",
		},
		/*** icon service (end) ***/
	],
};

export default serviceGenerator;
