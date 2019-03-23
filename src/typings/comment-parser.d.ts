declare module "comment-parser" {
    export interface Comment {
        tags: Tag[];
        line: number;
        description: string;
        source: string;
    }
    export interface Tag {
        tag: string;
        name: string;
        optional: boolean;
        type: string;
        description: string;
        line: number;
        source: string;
    }
    export interface Options {
        parsers?: [(str: string, data: any) => { source: string, data: any }];
        dotted_names?: boolean;
    }

    export default function parse(str: string, opts?: Options): [Comment];
}