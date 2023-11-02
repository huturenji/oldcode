
module.exports = {
    root: true,
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "jquery": true
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    "parserOptions": {
        "parser": 'babel-eslint',
        "sourceType": "module",
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "globals": {
        "Mstp": true,
        "PDFObject": true,
        "AlipayJSBridge": true,
        "pako": true,
        "BlobBuilder": true,
        "WebViewJavascriptBridge": true,
        "CommonCrypt": true,
        "CommonKeycloak": true
    },
    "plugins": [
        "vue",
    ],
    "rules": {
        "vue/html-indent": [
            "error",
            4
        ],
        'vue/attributes-order': 0,
        "vue/html-self-closing": 0,
        'vue/attribute-hyphenation': 0,
        "vue/max-attributes-per-line": ["error", {
            "singleline": 3,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        "vue/v-bind-style": 0,
        "vue/no-v-html": 0,
        "vue/no-unused-vars": 'warn',
        "vue/name-property-casing": 0,
        "vue/return-in-computed-property": 0,
        "vue/order-in-components": 0,
        "vue/no-parsing-error": 0,
        "vue/prop-name-casing": 0,
        // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格  
        "array-bracket-spacing": [0, "never"],
        // 在块级作用域外访问块内定义的变量是否报错提示  
        "block-scoped-var": 0,
        // if while function 后面的{必须与if在同一行，java风格。  
        "brace-style": [2, "1tbs", { "allowSingleLine": true }],
        // 双峰驼命名格式  
        "camelcase": 0,
        // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，  
        // always-multiline：多行模式必须带逗号，单行模式不能带逗号  
        "comma-dangle": [0, "never"],
        // 控制逗号前后的空格  
        "comma-spacing": [2, { "before": false, "after": true }],
        // 控制逗号在行尾出现还是在行首出现  
        // http://eslint.org/docs/rules/comma-style  
        "comma-style": [0, "last"],
        // 圈复杂度  
        "complexity": [0, 9],
        // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always  
        "computed-property-spacing": [0, "never"],
        // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示  
        "constructor-super": 0,
        // if else while for do后面的代码块是否需要{ }包围，参数：  
        //    multi  只有块中有多行语句时才需要{ }包围  
        //    multi-line  只有块中有多行语句时才需要{ }包围, 但是块中的执行语句只有一行时，  
        //                   块中的语句只能跟和if语句在同一行。if (foo) foo++; else doSomething();  
        //    multi-or-nest 只有块中有多行语句时才需要{ }包围, 如果块中的执行语句只有一行，执行语句可以零另起一行也可以跟在if语句后面  
        //    [2, "multi", "consistent"] 保持前后语句的{ }一致  
        //    default: [2, "all"] 全都需要{ }包围  
        "curly": [2, "all"],
        // switch语句强制default分支，也可添加 // no default 注释取消此次警告  
        "default-case": 0,
        // 强制object.key 中 . 的位置，参数:  
        //      property，'.'号应与属性在同一行  
        //      object, '.' 号应与对象名在同一行  
        "dot-location": [0, "property"],
        // 强制使用.号取属性  
        //    参数： allowKeywords：true 使用保留字做属性名时，只能使用.方式取属性  
        //                          false 使用保留字做属性名时, 只能使用[]方式取属性 e.g [2, {"allowKeywords": false}]  
        //           allowPattern:  当属性名匹配提供的正则表达式时，允许使用[]方式取值,否则只能用.号取值 e.g [2, {"allowPattern": "^[a-z]+(_[a-z]+)+$"}]  
        "dot-notation": [0, { "allowKeywords": true }],
        // 使用 === 替代 ==  
        "eqeqeq": [0, "allow-null"],
        // 方法表达式是否需要命名  
        "func-names": 0,
        // 方法定义风格，参数：  
        //    declaration: 强制使用方法声明的方式，function f(){} e.g [2, "declaration"]  
        //    expression：强制使用方法表达式的方式，var f = function() {}  e.g [2, "expression"]  
        //    allowArrowFunctions: declaration风格中允许箭头函数。 e.g [2, "declaration", { "allowArrowFunctions": true }]  
        "func-style": 0,
        //强制代码中不能使用console
        "no-console": 0,
        //重复定义
        "no-redeclare": 0,
        //未使用的变量
        'no-unused-vars': 'warn',
        "no-extra-boolean-cast": 0,
        "no-useless-escape": 0,
        "no-debugger": 0
    }
};