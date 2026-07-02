import { FunctionDefinition } from './query-bar';

export const functions: FunctionDefinition[] = [
    {
        "name": "abs",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "acos",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "allmatch",
        "kind": "scalar",
        "parameters": [],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": "Do all elements in the array match the expressions\n`all_match(array(T), function(T, boolean)) -> boolean`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "anymatch",
        "kind": "scalar",
        "parameters": [],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": "Does any element in the array match the expressions\n`any_match(array(T), function(T, boolean)) -> boolean`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "anyvalue",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "approxdistinct",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "approximatepercentile",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "percentile",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "array",
        "kind": "scalar",
        "parameters": [
            {
                "name": "terms",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": null
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "arrayagg",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "arraydistinct",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "array",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "ascii",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Unicode code point of the first character. `ascii(string) -> int`.\n\nTrino spells this `codepoint` and rejects multi-character input, so the first character\nis sliced out to match PostgreSQL/Spark `ascii`, which take the first character of any\nstring.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "asin",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "atan",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "atan2",
        "kind": "scalar",
        "parameters": [
            {
                "name": "y",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "x",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Arc tangent of y/x using the signs of both to pick the quadrant. `atan2(y, x) -> double`.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "avg",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "float",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "avg",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "float",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "base64",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Base64-encode a string, without the line breaks PostgreSQL inserts.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "bitand",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "int",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "bitor",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "int",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "bitwiseand",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "other",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "`bitwise_and(x, y) -> int`. Operator `&` on PostgreSQL/Spark.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "bitwisenot",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "`bitwise_not(x) -> int`. Operator `~` on PostgreSQL/Spark.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "bitwiseor",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "other",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "`bitwise_or(x, y) -> int`. Operator `|` on PostgreSQL/Spark.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "bitwisexor",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "other",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "`bitwise_xor(x, y) -> int`. XOR operator differs: `#` on PostgreSQL, `^` on Spark.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "bitxor",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "int",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "booland",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "bool",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "boolor",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "bool",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "btrim",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "chars",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Trim a set of characters (default whitespace) from both ends. ``btrim(string[, chars]) -> string``.\n\nTrino has no ``btrim``: the whitespace form maps to ``trim`` and the character-set form to\na regex-replace so the character-set semantics match PostgreSQL/Spark.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "cardinality",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "array",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "cast",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "any",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "as_type",
                "types": "literal_string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "cbrt",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Cube root. `cbrt(x) -> double`. Native on all three engines; handles negative inputs.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "ceil",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Returns x rounded up to the nearest integer. `ceil(x: numeric) -> int`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "chr",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Returns the Unicode code point n as a single character string.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "coalesce",
        "kind": "scalar",
        "parameters": [
            {
                "name": "default_values",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 2,
                "maxRepeat": null
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "concat",
        "kind": "scalar",
        "parameters": [
            {
                "name": "terms",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "value",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "concatws",
        "kind": "scalar",
        "parameters": [
            {
                "name": "terms",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 2,
                "maxRepeat": null
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Concatenates its arguments using the first argument as the separator, skipping nulls.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "contains",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "array",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "value",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": "Contains function, for arrays\n`contains(x, element)`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "corr",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term1",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "term2",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "cos",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "cosh",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "cot",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Cotangent. `cot(x) -> double`. Trino has no `cot`, so it is emulated as ``1 / tan(x)``.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "count",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "any",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Returns the number of input rows. `count(*) -> bigint`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "count",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "countif",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "covarpop",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term1",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "term2",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "covarsamp",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term1",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "term2",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "curdate",
        "kind": "scalar",
        "parameters": [],
        "output": {
            "types": "date",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "curtimestamp",
        "kind": "scalar",
        "parameters": [],
        "output": {
            "types": "timestamp",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "date",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "timestamp",
                    "date"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "date",
            "description": null
        },
        "description": "Converts x to a date. `date(x) -> date`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "dateadd",
        "kind": "scalar",
        "parameters": [
            {
                "name": "date_part",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "interval",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "term",
                "types": "date",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "date",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "datediff",
        "kind": "scalar",
        "parameters": [
            {
                "name": "start_date",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "end_date",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Returns timestamp2 - timestamp1 expressed in days\n`date_diff(timestamp1, timestamp2) → bigint`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "datetrunc",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "literal_string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "format",
                "types": "timestamp",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "timestamp",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "day",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "degrees",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Radians to degrees. `degrees(x) -> double`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "denserank",
        "kind": "analytic",
        "parameters": [],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": true,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "distinct",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "elementat",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "array",
                    "map"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "key",
                "types": [
                    "literal_int",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "endswith",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "suffix",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": "`ends_with(string, suffix) -> boolean`.\n\nOnly Spark has a native function (`endswith`). PostgreSQL and Trino have none, so the\nsuffix is compared against the tail of the string instead.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "every",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "bool",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "exp",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Euler's number raised to x. `exp(x) -> double`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "firstvalue",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": "`first_value(value) -> type(value)`.",
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": true
    },
    {
        "name": "flatten",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "array",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "floor",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Returns x rounded down to the nearest integer. `floor(x: numeric) -> int`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "fromiso8601date",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "timestamp",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "fromiso8601timestamp",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "timestamp",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "fromunixtime",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "timestamp",
            "description": null
        },
        "description": "Convert Unix epoch seconds to a timestamp. ``from_unixtime(seconds) -> timestamp``.\n\nThe engines diverge on spelling and -- crucially -- on return type: Spark's own\n``from_unixtime`` returns a *formatted string*, so we use ``timestamp_seconds`` to get a real\ntimestamp. PostgreSQL has no ``from_unixtime`` and spells it ``to_timestamp(double)``.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "greatest",
        "kind": "scalar",
        "parameters": [
            {
                "name": "terms",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 2,
                "maxRepeat": null
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": "Row-wise maximum of its arguments. `greatest(...) -> common type`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "hex",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Hex-encode a string as a lower-case hex string.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "hour",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "initcap",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Upper-case the first letter of each word and lower-case the rest. ``initcap(string) -> string``.\n\nTrino has no ``initcap``; it is emulated with a regex-replace lambda. Word boundaries are\nnon-alphanumeric on PostgreSQL/Trino but whitespace-only on Spark.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "ipincidr",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "cidr",
                "types": "literal_string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "kurtosis",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "lag",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "offset",
                "types": "literal_int",
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": "`lag(value[, offset]) -> type(value)`. Default-value (3rd) arg is deferred.",
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": true,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "lastvalue",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": "`last_value(value) -> type(value)`.",
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": true
    },
    {
        "name": "lead",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "offset",
                "types": "literal_int",
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": "`lead(value[, offset]) -> type(value)`. Default-value (3rd) arg is deferred.",
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": true,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "least",
        "kind": "scalar",
        "parameters": [
            {
                "name": "terms",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 2,
                "maxRepeat": null
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": "Row-wise minimum of its arguments. `least(...) -> common type`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "left",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "length",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "First ``n`` characters. ``left(string, n) -> string``.\n\nTrino has no ``left``; it is emulated with ``substr``.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "length",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "ln",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Natural logarithm. `ln(x) -> double`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "log",
        "kind": "scalar",
        "parameters": [
            {
                "name": "base",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Logarithm of x to base b. `log(base, x) -> double`. All three engines take (base, value).",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "log10",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Base-10 logarithm. `log10(x) -> double`. Always emitted as ``log10`` — bare ``log`` means\nbase-10 on PostgreSQL but natural log on Spark, so it is never used.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "lower",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "lpad",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "length",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "pad",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Left-pads a string to a given width with an optional pad string (default space).",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "ltrim",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Removes leading whitespace. `ltrim(string) -> string`.\n\nScoped to the single-argument (whitespace) form: Trino has no two-argument\n`ltrim(string, chars)`, and Spark's two-argument form reverses the argument order.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "mapagg",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "key_term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "value_term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "map",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "mapkeys",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "map",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "mapkeys",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "map",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "mapunion",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": "map",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "map",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "mapvalues",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "map",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "max",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "max",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "md5",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "MD5 digest of a string as a lower-case hex string.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "min",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "min",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "any",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "minute",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "mod",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "modulus",
                "types": "literal_int",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "month",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "ntile",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": "literal_int",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "`ntile(n) -> int` — distributes rows into n buckets. n is an integer literal.",
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": true,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "nullif",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "condition",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "overlay",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "replacement",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "start",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "length",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Replaces `length` characters of `term` starting at 1-based `start` with `replacement`.\n`overlay(string, replacement, start[, length]) -> string`.\n\nPostgreSQL accepts only the SQL-standard `OVERLAY(... PLACING ... FROM ... FOR ...)`\nkeyword form; Spark accepts only the comma function form; Trino has neither, so it is\ncomposed from `substr`. When `length` is omitted it defaults to the length of the\nreplacement (matching PostgreSQL/Spark).",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "pow",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "exponent",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "radians",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Degrees to radians. `radians(x) -> double`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "random",
        "kind": "scalar",
        "parameters": [],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Uniform random double in [0, 1). `random() -> double`. Spark spells it `rand`.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "rank",
        "kind": "analytic",
        "parameters": [],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": true,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "regexpcount",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "pattern",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Count the number of matches of a regex pattern in a string.\n``regexp_count(string, pattern) -> integer``. Native on PostgreSQL (15+), Spark and Trino.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "regexpextract",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "pattern",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "group",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Extract a capture group from the first regex match.\n``regexp_extract(string, pattern[, group]) -> string`` — group ``0`` (default) is the whole\nmatch, group ``N`` the Nth capture group.\n\nPostgreSQL spells this ``regexp_substr`` (PG15+) and selects the group via its ``subexpr``\nargument.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "regexplike",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "pattern",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "modifiers",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "regexpreplace",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "pattern",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "replacement",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Replaces all matches of a regex pattern with a replacement string.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "regrintercept",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term1",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "term2",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "regrslope",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term1",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "term2",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "repeat",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "count",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Repeat a string ``n`` times. ``repeat(string, n) -> string``.\n\nTrino's ``repeat`` returns an array, so the repeated string is reassembled with\n``array_join``.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "replace",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "find_string",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "replace_with",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "reverse",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "right",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "length",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Last ``n`` characters. ``right(string, n) -> string``.\n\nTrino has no ``right``; it is emulated with ``substr`` and a negative start (counts from\nthe end), so ``n`` must be positive.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "rollup",
        "kind": "scalar",
        "parameters": [
            {
                "name": "terms",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "round",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "precision",
                "types": "literal_int",
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": "Rounds x to an optional number of decimal places, preserving its numeric type.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "rownumber",
        "kind": "analytic",
        "parameters": [],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": true,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "rpad",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "length",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "pad",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 0,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Right-pads a string to a given width with an optional pad string (default space).",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "rtrim",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Removes trailing whitespace. `rtrim(string) -> string`.\n\nScoped to the single-argument (whitespace) form: Trino has no two-argument\n`rtrim(string, chars)`, and Spark's two-argument form reverses the argument order.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "second",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sequence",
        "kind": "scalar",
        "parameters": [
            {
                "name": "start",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "stop",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "step",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sha256",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "SHA-256 digest of a string as a lower-case hex string.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sha512",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "SHA-512 digest of a string as a lower-case hex string.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "shiftleft",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "bits",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Bitwise left shift. `shift_left(value, n) -> int`. PostgreSQL `<<`, Spark `shiftleft`,\nTrino `bitwise_left_shift`.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "shiftright",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "bits",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Bitwise (arithmetic) right shift. `shift_right(value, n) -> int`. PostgreSQL `>>`, Spark\n`shiftright`, Trino `bitwise_right_shift`.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sign",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Returns the sign of x as -1, 0, or 1. `sign(x: numeric) -> double`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sin",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sinh",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "skewness",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "splitpart",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "delimiter",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "index",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sqrt",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": "Returns the square root of x. `sqrt(x: numeric) -> double`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "startswith",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "prefix",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "bool",
            "description": null
        },
        "description": "`starts_with(string, prefix) -> boolean`. Spark spells it `startswith`.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "stddev",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "stddev",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "stddevpop",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "stddevpop",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "stddevsamp",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "stddevsamp",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "strpos",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "substring",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "1-based index of the first occurrence of a substring, or 0 if not found.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "substring",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "start",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "stop",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sum",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "sum",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "any",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "tan",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "tanh",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "todate",
        "kind": "scalar",
        "parameters": [
            {
                "name": "value",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "date",
            "description": null
        },
        "description": "Parse an ISO-8601 date string to a date, rendered per engine.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "transform",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "array",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "element_term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "string",
                    "literal_string",
                    "date",
                    "timestamp",
                    "bool",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "array",
            "description": null
        },
        "description": "Transform all elements in the array.\n`Transform(Field('foo'), Cast(Field('x'), 'Integer'))\n==\n`transform(foo, x -> CAST(x AS <type>))`",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "translate",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "from_chars",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "to_chars",
                "types": [
                    "string",
                    "literal_string"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": "Per-character substitution: each character of `term` that occurs in `from_chars` is\nreplaced by the character at the same position in `to_chars` (surplus `from_chars` are\ndeleted). `translate(string, from, to) -> string`. Native and identical on all three.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "trim",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "upper",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": "string",
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "string",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "variance",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "variance",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "varpop",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "varpop",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "varsamp",
        "kind": "aggregate",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "varsamp",
        "kind": "analytic",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "double",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": true,
        "requiresOrderBy": false,
        "supportsFrame": true,
        "supportsIgnoreNulls": false
    },
    {
        "name": "widthbucket",
        "kind": "scalar",
        "parameters": [
            {
                "name": "operand",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "low",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "high",
                "types": [
                    "decimal",
                    "double",
                    "float",
                    "tinyint",
                    "int",
                    "long",
                    "smallint",
                    "literal_int",
                    "literal_numeric"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            },
            {
                "name": "count",
                "types": [
                    "int",
                    "literal_int"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": "Histogram bucket index of operand in `count` equal-width buckets over [low, high].\n`width_bucket(operand, low, high, count) -> int`. Identical on all three engines.",
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    },
    {
        "name": "year",
        "kind": "scalar",
        "parameters": [
            {
                "name": "term",
                "types": [
                    "date",
                    "timestamp"
                ],
                "description": null,
                "minRepeat": 1,
                "maxRepeat": 1
            }
        ],
        "output": {
            "types": "int",
            "description": null
        },
        "description": null,
        "dialects": null,
        "isAnalytic": false,
        "requiresOrderBy": false,
        "supportsFrame": false,
        "supportsIgnoreNulls": false
    }
];
