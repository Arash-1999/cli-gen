import { type ILayout, TLayout } from "./type";
const config = {
	routerPath: "src/app/router.tsx",
	pagesPath: "pages",
	assetsPath: "public/images",
};

const layoutChoices = [
	{ name: "Without Layout", value: TLayout.None },
	{ name: "Normal Layout", value: TLayout.Normal },
	{ name: "Dashboard Layout", value: TLayout.Dashboard },
	{ name: "FAQ Layout", value: TLayout.Faq },
];
const layoutConfig: Record<TLayout, ILayout> = {
	[TLayout.None]: {
		name: "",
		options: [],
	},
	[TLayout.Normal]: {
		name: "LayoutWrapper",
		options: [
			{ key: "displayFooter", type: "boolean" },
			{ key: "navbarType", type: "list", options: ["full", "minimal"] },
			{
				key: "auth",
				type: "list",
				options: [
					{ name: "Auth", value: "auth" },
					{ name: "No Auth", value: "no-auth" },
					{ name: "Guardless", value: "" },
				],
			},
		],
	},
	[TLayout.Faq]: {
		name: "LayoutWrapper",
		options: [],
	},
	[TLayout.Dashboard]: {
		name: "LayoutWrapper",
		options: [],
	},
};

export { layoutConfig, config, TLayout, layoutChoices };
