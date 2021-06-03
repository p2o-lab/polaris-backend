module.exports =  {
    plugins: [
        "@typescript-eslint/eslint-plugin",
        "eslint-plugin-tsdoc"
    ],
    extends:  [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser:  '@typescript-eslint/parser',
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module"
    },
    rules: {
        "tsdoc/syntax": "off",
        '@typescript-eslint/no-namespace': "warn",
        "constructor-super": "off",
        "@typescript-eslint/no-var-requires": "off",
        "no-this-alias": "off",
        quotes: [2, "single", "avoid-escape"],
        semi: ["error", "always"],
        "linebreak-style": [
            "error",
            "unix"
        ]
    },
    env: {
        jest: true,
        node: true,
        commonjs: true,
        es6: true,
        mocha: true
    }
};
