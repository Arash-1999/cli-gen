import { NodePlopAPI } from "plop";
import { pageGenerator, serviceGenerator } from "./generators";

// TODO: use prettier after generators
const configPlop = (plop: NodePlopAPI) => {
	// plop generator code
	plop.setGenerator("page", pageGenerator);
	plop.setGenerator("Service", serviceGenerator);
};

export default configPlop;
