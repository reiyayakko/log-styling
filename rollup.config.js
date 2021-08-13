
// @ts-check

import ts from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const name = "LogStyling";
const banner = `
/**
 * @license
 * ${pkg.name} v${pkg.version}
 * Copyright 2021 rizzzse
 * License MIT
 */`.slice(1);

/** @type {import("rollup").RollupOptions} */
export default ({
    input: "./src/index.ts",
    output: [
        {
            file: `dist/${pkg.name}.es.js`,
            format: "es",
            banner,
        },
        {
            file: `dist/${pkg.name}.umd.js`,
            format: "umd",
            name,
            banner,
        },
        {
            file: `dist/${pkg.name}.umd.min.js`,
            format: "umd",
            name,
            banner,
            plugins: [
                terser({
                    mangle: { properties: { regex: /^_(?!_)/ } }
                }),
            ],
        },
    ],
    plugins: [ts()],
});
