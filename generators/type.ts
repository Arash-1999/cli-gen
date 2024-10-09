const enum TLayout {
  None = "",
  Normal = "LayoutWrapper",
  Dashboard = 'LayoutWrapper type="dashboard"',
  Faq = 'LayoutWrapper type="faq"',
}
type TLayoutOption = { key: string } & (
  | {
      type: "boolean";
    }
  | {
      type: "list";
      options: string[] | { name: string; value: string }[];
    }
);

interface ILayout {
  name: string;
  options: TLayoutOption[];
}

export type { TLayoutOption, ILayout };
export { TLayout };
