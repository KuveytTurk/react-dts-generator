declare module "react-docgen" {
	export interface ComponentInfo {
		displayName: string;
		props: Props;
		methods: Method[];
	}

	export interface Props {
		[key: string]: Prop
	}

	export interface Prop {
		required: boolean;
		type: Type;
		description: string;
	}

	export interface Type {
		name: string;
	}

	export interface Method {
		params: Param[];
		returns: Returns;
		name: string;
	}

	export interface Param {
		type: Type;
		name: string;
	}

	export interface Returns {
		type: Type;
	}

	export function parse(content: string): ComponentInfo;
}
