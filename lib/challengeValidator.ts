import { Chapter } from "@/types/chapter";

export type ChallengeLanguage = "javascript" | "python";

export interface ValidationResult {
  passed: boolean;
  score: number;
  checks: {
    requirement: string;
    passed: boolean;
  }[];
}

export function validateChallenge(
  chapter: Chapter,
  code: string,
  language: ChallengeLanguage = "javascript"
): ValidationResult {
  const checks =
    language === "python"
      ? getPythonChecks(chapter, code)
      : getJavaScriptChecks(chapter, code);

  const passedChecks = checks.filter((check) => check.passed).length;

  const score =
    checks.length === 0
      ? 0
      : Math.round((passedChecks / checks.length) * 100);

  // A learner passes when they demonstrate at least 70% of the required concepts.
  const passed = score >= 70;

  return {
    passed,
    score,
    checks,
  };
}

// ============================================================
// JavaScript checks
// ============================================================

function getJavaScriptChecks(
  chapter: Chapter,
  code: string
): ValidationResult["checks"] {
  const checks: ValidationResult["checks"] = [];

  const hasConsoleLog = () => /console\s*\.\s*log\s*\(/.test(code);

  const hasNumberValue = () =>
    /(?:const|let)\s+\w+\s*=\s*-?\d+(?:\.\d+)?/.test(code);

  const hasStringValue = () =>
    /(?:const|let)\s+\w+\s*=\s*["'`][\s\S]*?["'`]/.test(code);

  const hasBooleanValue = () =>
    /(?:const|let)\s+\w+\s*=\s*(?:true|false)\b/.test(code);

  const hasArray = () => /(?:const|let)\s+\w+\s*=\s*\[[\s\S]*?\]/.test(code);

  const hasObject = () => /(?:const|let)\s+\w+\s*=\s*\{[\s\S]*?\}/.test(code);

  const hasFunction = () =>
    /function\s+\w+\s*\(/.test(code) ||
    /(?:const|let)\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/.test(code);

  checks.push({
    requirement: "Does not use var",
    passed: !/\bvar\b/.test(code),
  });

  if (chapter.id === 1) {
    checks.push({
      requirement: "Creates variables using let or const",
      passed: /\b(?:let|const)\s+\w+\s*=/.test(code),
    });
    checks.push({ requirement: "Uses a string value", passed: hasStringValue() });
    checks.push({
      requirement: "Uses numeric values",
      passed:
        (code.match(/(?:const|let)\s+\w+\s*=\s*-?\d+(?:\.\d+)?/g)?.length ?? 0) >= 2,
    });
    checks.push({ requirement: "Uses a boolean value", passed: hasBooleanValue() });
    checks.push({ requirement: "Displays variable values", passed: hasConsoleLog() });
    checks.push({ requirement: "Uses typeof", passed: /\btypeof\s+\w+/.test(code) });
    checks.push({
      requirement: "Reassigns a variable",
      passed: (code.match(/^\s*\w+\s*=\s*(?![=])/gm)?.length ?? 0) >= 1,
    });
    checks.push({
      requirement: "Uses appropriate variable declarations",
      passed: /\bconst\s+\w+\s*=/.test(code) && /\blet\s+\w+\s*=/.test(code),
    });
  }

  if (chapter.id === 2) {
    checks.push({ requirement: "Creates a numeric variable", passed: hasNumberValue() });
    checks.push({ requirement: "Uses if statement", passed: /\bif\s*\(/.test(code) });
    checks.push({ requirement: "Uses else if statement", passed: /\belse\s+if\s*\(/.test(code) });
    checks.push({ requirement: "Uses else statement", passed: /\belse\s*\{/.test(code) });
    checks.push({ requirement: "Uses comparison operators", passed: /(?:===|!==|>=|<=|>|<)/.test(code) });
    checks.push({ requirement: "Checks for a high score", passed: /(?:>=\s*90|90\s*<=)/.test(code) });
    checks.push({ requirement: "Checks for a passing score", passed: /(?:>=\s*50|50\s*<=)/.test(code) });
    checks.push({ requirement: "Handles a successful result", passed: /["'`]Passed["'`]/.test(code) });
    checks.push({ requirement: "Handles an excellent result", passed: /["'`]Excellent["'`]/.test(code) });
    checks.push({ requirement: "Handles a failed result", passed: /["'`]Failed["'`]/.test(code) });
  }

  if (chapter.id === 3) {
    checks.push({ requirement: "Uses a for loop", passed: /\bfor\s*\(/.test(code) });
    checks.push({
      requirement: "Initializes a loop counter",
      passed: /for\s*\(\s*(?:let|const)\s+\w+\s*=/.test(code),
    });
    checks.push({
      requirement: "Starts countdown at 5",
      passed: /for\s*\(\s*(?:let|const)\s+\w+\s*=\s*5\b/.test(code),
    });
    checks.push({ requirement: "Uses a countdown condition", passed: /\w+\s*(?:>=|>)\s*1/.test(code) });
    checks.push({
      requirement: "Decreases the counter",
      passed: /\w+\s*--/.test(code) || /\w+\s*-\s*=\s*1/.test(code),
    });
    checks.push({
      requirement: "Prints loop values",
      passed: /console\s*\.\s*log\s*\(\s*\w+\s*\)/.test(code),
    });
    checks.push({
      requirement: "Prints all countdown values",
      passed: /5/.test(code) && /4/.test(code) && /3/.test(code) && /2/.test(code) && /1/.test(code),
    });
    checks.push({ requirement: "Prints Game Started", passed: /["'`]Game Started!["'`]/.test(code) });
  }

  if (chapter.id === 4) {
    checks.push({ requirement: "Defines a function", passed: hasFunction() });
    checks.push({
      requirement: "Function accepts parameters",
      passed:
        /function\s+\w+\s*\(\s*\w+\s*,\s*\w+/.test(code) ||
        /(?:const|let)\s+\w+\s*=\s*\(\s*\w+\s*,\s*\w+/.test(code),
    });
    checks.push({
      requirement: "Uses parameters inside the function",
      passed: /return\s+\w+\s*\+\s*\w+/.test(code),
    });
    checks.push({ requirement: "Uses a return statement", passed: /\breturn\b/.test(code) });
    checks.push({
      requirement: "Returns the combined values",
      passed: /return\s+\w+\s*\+\s*\w+\s*;?/.test(code),
    });
    checks.push({
      requirement: "Calls the function",
      passed:
        /(?:function\s+\w+\s*\([\s\S]*?\})[\s\S]*?\w+\s*\(/.test(code) ||
        /(?:const|let)\s+\w+\s*=\s*\w+\s*\(/.test(code),
    });
    checks.push({
      requirement: "Calls the function more than once",
      passed: (code.match(/\b\w+\s*\([^)]*\)/g)?.length ?? 0) >= 2,
    });
    checks.push({
      requirement: "Stores a returned result",
      passed: /(?:const|let)\s+\w+\s*=\s*\w+\s*\(/.test(code),
    });
    checks.push({ requirement: "Displays the calculated result", passed: hasConsoleLog() });
  }

  if (chapter.id === 5) {
    checks.push({ requirement: "Creates an array", passed: hasArray() });
    checks.push({
      requirement: "Array contains multiple items",
      passed: /(?:const|let)\s+\w+\s*=\s*\[[\s\S]*?,[\s\S]*?\]/.test(code),
    });
    checks.push({ requirement: "Uses push()", passed: /\.push\s*\(/.test(code) });
    checks.push({
      requirement: "Displays the array",
      passed: /console\s*\.\s*log\s*\(\s*\w+\s*\)/.test(code),
    });
    checks.push({ requirement: "Uses the length property", passed: /\b\w+\.length\b/.test(code) });
    checks.push({
      requirement: "Accesses an array element by index",
      passed: /\b\w+\s*\[\s*\d+\s*\]/.test(code),
    });
    checks.push({ requirement: "Uses a for loop", passed: /\bfor\s*\(/.test(code) });
    checks.push({
      requirement: "Loops through an array",
      passed: /\bfor\s*\([\s\S]*?\w+\s*\[[\s\S]*?\]/.test(code),
    });
  }

  if (chapter.id === 6) {
    checks.push({ requirement: "Creates an object", passed: hasObject() });
    checks.push({
      requirement: "Object contains multiple properties",
      passed: /(?:const|let)\s+\w+\s*=\s*\{[\s\S]*?:[\s\S]*?,[\s\S]*?:/.test(code),
    });
    checks.push({
      requirement: "Uses string data in the object",
      passed: /\w+\s*:\s*["'`][\s\S]*?["'`]/.test(code),
    });
    checks.push({
      requirement: "Uses numeric data in the object",
      passed: /\w+\s*:\s*-?\d+(?:\.\d+)?/.test(code),
    });
    checks.push({
      requirement: "Uses boolean data in the object",
      passed: /\w+\s*:\s*(?:true|false)\b/.test(code),
    });
    checks.push({
      requirement: "Accesses object properties",
      passed: /\b\w+\.\w+/.test(code) || /\b\w+\s*\[\s*["'`]\w+["'`]\s*\]/.test(code),
    });
    checks.push({
      requirement: "Displays object information",
      passed: /console\s*\.\s*log\s*\(\s*\w+(?:\.\w+|\[[^\]]+\])/.test(code),
    });
    checks.push({
      requirement: "Modifies an object property",
      passed: /\b\w+\.\w+\s*=\s*(?!==)/.test(code) || /\b\w+\s*\[[^\]]+\]\s*=\s*(?!==)/.test(code),
    });
    checks.push({
      requirement: "Adds an array property",
      passed: /\b\w+\.\w+\s*=\s*\[/.test(code) || /\b\w+\s*\[[^\]]+\]\s*=\s*\[/.test(code),
    });
    checks.push({
      requirement: "Accesses an item from the object's array",
      passed: /\b\w+\.\w+\s*\[\s*\d+\s*\]/.test(code) || /\b\w+\s*\[[^\]]+\]\s*\[\s*\d+\s*\]/.test(code),
    });
  }

  if (chapter.id === 7) {
    checks.push({ requirement: "Creates an array of scores", passed: hasArray() });
    checks.push({ requirement: "Uses filter()", passed: /\.filter\s*\(/.test(code) });
    checks.push({
      requirement: "Filters values using a condition",
      passed: /\.filter\s*\([\s\S]*?(?:>=|<=|>|<|===|!==)/.test(code),
    });
    checks.push({
      requirement: "Filters scores of 50 or higher",
      passed: /\.filter\s*\([\s\S]*?(?:>=\s*50|50\s*<=)/.test(code),
    });
    checks.push({ requirement: "Uses map()", passed: /\.map\s*\(/.test(code) });
    checks.push({
      requirement: "Transforms values",
      passed: /\.map\s*\([\s\S]*?(?:\*|\+|-|\/|\*\*)/.test(code),
    });
    checks.push({
      requirement: "Doubles the values",
      passed: /\.map\s*\([\s\S]*?(?:\*\s*2|2\s*\*)/.test(code),
    });
    checks.push({ requirement: "Uses forEach()", passed: /\.forEach\s*\(/.test(code) });
    checks.push({ requirement: "Uses reduce()", passed: /\.reduce\s*\(/.test(code) });
    checks.push({ requirement: "Displays the calculated result", passed: hasConsoleLog() });
  }

  if (chapter.id === 8) {
    checks.push({ requirement: "Uses querySelector()", passed: /querySelector\s*\(/.test(code) });
    checks.push({
      requirement: "Stores a selected element in a variable",
      passed: /(?:const|let)\s+\w+\s*=\s*document\.querySelector\s*\(/.test(code),
    });
    checks.push({
      requirement: "Selects a button element",
      passed: /querySelector\s*\(\s*["'`](?:button|#\w+|\.\w+)["'`]\s*\)/.test(code),
    });
    checks.push({
      requirement: "Selects a message element",
      passed: (code.match(/querySelector\s*\(/g)?.length ?? 0) >= 2,
    });
    checks.push({ requirement: "Uses addEventListener()", passed: /\.addEventListener\s*\(/.test(code) });
    checks.push({
      requirement: "Listens for a click event",
      passed: /\.addEventListener\s*\(\s*["'`]click["'`]/.test(code),
    });
    checks.push({ requirement: "Uses textContent", passed: /\.textContent\s*=/.test(code) });
    checks.push({
      requirement: "Updates the page with Game Started",
      passed: /["'`]Game Started!["'`]/.test(code),
    });
  }

  if (chapter.id === 9) {
    checks.push({
      requirement: "Defines an async function",
      passed:
        /async\s+function\s+\w+\s*\(/.test(code) || /(?:const|let)\s+\w+\s*=\s*async/.test(code),
    });
    checks.push({ requirement: "Creates a Promise", passed: /new\s+Promise\s*\(/.test(code) });
    checks.push({ requirement: "Uses resolve()", passed: /\bresolve\s*\(/.test(code) });
    checks.push({ requirement: "Resolves with a value", passed: /resolve\s*\(\s*[^)]*\)/.test(code) });
    checks.push({ requirement: "Uses await", passed: /\bawait\b/.test(code) });
    checks.push({
      requirement: "Stores an awaited result",
      passed: /(?:const|let)\s+\w+\s*=\s*await\b/.test(code),
    });
    checks.push({ requirement: "Displays the asynchronous result", passed: hasConsoleLog() });
    checks.push({ requirement: "Calls the async function", passed: /(?:async\s+function\s+)?\w+\s*\(/.test(code) });
    checks.push({ requirement: "Uses the Player Loaded message", passed: /["'`]Player Loaded["'`]/.test(code) });
  }

  if (chapter.id === 10) {
    checks.push({ requirement: "Defines a function", passed: hasFunction() });
    checks.push({
      requirement: "Function accepts a health parameter",
      passed:
        /function\s+\w+\s*\(\s*\w+\s*\)/.test(code) || /(?:const|let)\s+\w+\s*=\s*\(\s*\w+\s*\)\s*=>/.test(code),
    });
    checks.push({ requirement: "Checks for negative health", passed: /\w+\s*<\s*0/.test(code) });
    checks.push({ requirement: "Uses throw", passed: /\bthrow\b/.test(code) });
    checks.push({ requirement: "Creates an Error", passed: /new\s+Error\s*\(/.test(code) });
    checks.push({
      requirement: "Provides an error message",
      passed: /new\s+Error\s*\(\s*["'`][\s\S]+?["'`]\s*\)/.test(code),
    });
    checks.push({ requirement: "Uses try", passed: /\btry\s*\{/.test(code) });
    checks.push({ requirement: "Uses catch", passed: /\bcatch\s*\(/.test(code) });
    checks.push({
      requirement: "Calls the health-checking function",
      passed: /(?:function\s+\w+\s*\([\s\S]*?\})[\s\S]*?\w+\s*\(/.test(code),
    });
    checks.push({ requirement: "Tests with a negative value", passed: /\w+\s*\(\s*-\s*\d+/.test(code) });
    checks.push({
      requirement: "Displays the error message",
      passed: /console\s*\.\s*log\s*\(\s*(?:error|err)\.message\s*\)/.test(code),
    });
  }

  return checks;
}

// ============================================================
// Python checks
// ============================================================

function getPythonChecks(
  chapter: Chapter,
  code: string
): ValidationResult["checks"] {
  const checks: ValidationResult["checks"] = [];

  // Python has no var/let/const, so assignment is just `name = value`.
  // We exclude comparison operators (==, !=, <=, >=) by using a negative
  // lookahead on the character right after the single `=`.
  const assignmentRegex = (valuePattern: string) =>
    new RegExp(`\\b\\w+\\s*=\\s*(?!=)(?:${valuePattern})`);

  const hasPrint = () => /\bprint\s*\(/.test(code);

  const hasNumberValue = () => assignmentRegex("-?\\d+(?:\\.\\d+)?\\b").test(code);

  const hasStringValue = () => assignmentRegex(`["'][\\s\\S]*?["']`).test(code);

  const hasBooleanValue = () => assignmentRegex("(?:True|False)\\b").test(code);

  const hasListValue = () => assignmentRegex("\\[[\\s\\S]*?\\]").test(code);

  const hasDictValue = () => assignmentRegex("\\{[\\s\\S]*?\\}").test(code);

  const hasFunctionDef = () =>
    /def\s+\w+\s*\(/.test(code) || /\b\w+\s*=\s*lambda\b/.test(code);

  const hasClassDef = () => /\bclass\s+\w+/.test(code);

  checks.push({
    requirement: "Uses snake_case-style assignment (no camelCase JS syntax)",
    passed: !/\b(?:var|let|const)\b/.test(code),
  });

  if (chapter.id === 1) {
    checks.push({ requirement: "Creates variables using assignment", passed: /\b\w+\s*=\s*(?!=)/.test(code) });
    checks.push({ requirement: "Uses a string value", passed: hasStringValue() });
    checks.push({
      requirement: "Uses numeric values",
      passed: (code.match(new RegExp(assignmentRegex("-?\\d+(?:\\.\\d+)?\\b").source, "g"))?.length ?? 0) >= 2,
    });
    checks.push({ requirement: "Uses a boolean value", passed: hasBooleanValue() });
    checks.push({ requirement: "Displays variable values", passed: hasPrint() });
    checks.push({ requirement: "Uses type()", passed: /\btype\s*\(/.test(code) });
    checks.push({
      requirement: "Reassigns a variable",
      passed: (code.match(/^\s*\w+\s*=\s*(?!=)/gm)?.length ?? 0) >= 2,
    });
  }

  if (chapter.id === 2) {
    checks.push({ requirement: "Creates a numeric variable", passed: hasNumberValue() });
    checks.push({ requirement: "Uses if statement", passed: /\bif\s+[\s\S]*?:/.test(code) });
    checks.push({ requirement: "Uses elif statement", passed: /\belif\s+[\s\S]*?:/.test(code) });
    checks.push({ requirement: "Uses else statement", passed: /\belse\s*:/.test(code) });
    checks.push({ requirement: "Uses comparison operators", passed: /(?:==|!=|>=|<=|>|<)/.test(code) });
    checks.push({ requirement: "Checks for a high score", passed: /(?:>=\s*90|90\s*<=)/.test(code) });
    checks.push({ requirement: "Checks for a passing score", passed: /(?:>=\s*50|50\s*<=)/.test(code) });
    checks.push({ requirement: "Handles a successful result", passed: /["']Passed["']/.test(code) });
    checks.push({ requirement: "Handles an excellent result", passed: /["']Excellent["']/.test(code) });
    checks.push({ requirement: "Handles a failed result", passed: /["']Failed["']/.test(code) });
  }

  if (chapter.id === 3) {
    checks.push({ requirement: "Uses a for loop", passed: /\bfor\s+\w+\s+in\s+/.test(code) });
    checks.push({ requirement: "Uses range()", passed: /\brange\s*\(/.test(code) });
    checks.push({
      requirement: "Uses a countdown range",
      passed: /range\s*\(\s*5\s*,\s*0\s*,\s*-\s*1\s*\)/.test(code),
    });
    checks.push({
      requirement: "Counts down (uses a negative step)",
      passed: /range\s*\([^)]*,\s*-\s*1\s*\)/.test(code),
    });
    checks.push({ requirement: "Prints loop values", passed: /print\s*\(\s*\w+\s*\)/.test(code) });
    checks.push({
      requirement: "Prints all countdown values",
      passed: /5/.test(code) && /4/.test(code) && /3/.test(code) && /2/.test(code) && /1/.test(code),
    });
    checks.push({ requirement: "Prints Game Started", passed: /["']Game Started!["']/.test(code) });
  }

  if (chapter.id === 4) {
    checks.push({ requirement: "Defines a function", passed: hasFunctionDef() });
    checks.push({
      requirement: "Function accepts parameters",
      passed: /def\s+\w+\s*\(\s*\w+\s*,\s*\w+/.test(code),
    });
    checks.push({
      requirement: "Uses parameters inside the function",
      passed: /return\s+\w+\s*\+\s*\w+/.test(code),
    });
    checks.push({ requirement: "Uses a return statement", passed: /\breturn\b/.test(code) });
    checks.push({
      requirement: "Returns the combined values",
      passed: /return\s+\w+\s*\+\s*\w+/.test(code),
    });
    checks.push({
      requirement: "Calls the function",
      passed: /(?:def\s+\w+\s*\([\s\S]*?)[\s\S]*?\n\s*\w+\s*\(/.test(code) || /\b\w+\s*\(\s*\d/.test(code),
    });
    checks.push({
      requirement: "Calls the function more than once",
      passed: (code.match(/\b\w+\s*\([^)]*\)/g)?.length ?? 0) >= 3, // def(...) counts as one call-shaped match
    });
    checks.push({
      requirement: "Stores a returned result",
      passed: /\b\w+\s*=\s*\w+\s*\(/.test(code),
    });
    checks.push({ requirement: "Displays the calculated result", passed: hasPrint() });
  }

  if (chapter.id === 5) {
    checks.push({ requirement: "Creates a list", passed: hasListValue() });
    checks.push({
      requirement: "List contains multiple items",
      passed: assignmentRegex("\\[[\\s\\S]*?,[\\s\\S]*?\\]").test(code),
    });
    checks.push({ requirement: "Uses append()", passed: /\.append\s*\(/.test(code) });
    checks.push({ requirement: "Displays the list", passed: /print\s*\(\s*\w+\s*\)/.test(code) });
    checks.push({ requirement: "Uses len()", passed: /\blen\s*\(/.test(code) });
    checks.push({
      requirement: "Accesses a list element by index",
      passed: /\b\w+\s*\[\s*\d+\s*\]/.test(code),
    });
    checks.push({ requirement: "Uses a for loop", passed: /\bfor\s+\w+\s+in\s+/.test(code) });
  }

  if (chapter.id === 6) {
    checks.push({ requirement: "Creates a dictionary", passed: hasDictValue() });
    checks.push({
      requirement: "Dictionary contains multiple keys",
      passed: assignmentRegex("\\{[\\s\\S]*?:[\\s\\S]*?,[\\s\\S]*?:").test(code),
    });
    checks.push({
      requirement: "Uses string data in the dictionary",
      passed: /["'][\s\S]*?["']\s*:\s*["'][\s\S]*?["']/.test(code) || /:\s*["'][\s\S]*?["']/.test(code),
    });
    checks.push({
      requirement: "Uses numeric data in the dictionary",
      passed: /:\s*-?\d+(?:\.\d+)?\b/.test(code),
    });
    checks.push({
      requirement: "Uses boolean data in the dictionary",
      passed: /:\s*(?:True|False)\b/.test(code),
    });
    checks.push({
      requirement: "Accesses dictionary values",
      passed: /\b\w+\s*\[\s*["']\w+["']\s*\]/.test(code) || /\.get\s*\(/.test(code),
    });
    checks.push({ requirement: "Displays dictionary information", passed: hasPrint() });
    checks.push({
      requirement: "Modifies a dictionary value",
      passed: /\b\w+\s*\[[^\]]+\]\s*=\s*(?!=)/.test(code),
    });
    checks.push({
      requirement: "Adds a list value",
      passed: /\b\w+\s*\[[^\]]+\]\s*=\s*\[/.test(code),
    });
  }

  if (chapter.id === 7) {
    checks.push({ requirement: "Creates a list of scores", passed: hasListValue() });
    checks.push({
      requirement: "Uses a list comprehension or filter()",
      passed: /\[[\s\S]*?\bfor\s+\w+\s+in\s+[\s\S]*?\]/.test(code) || /\bfilter\s*\(/.test(code),
    });
    checks.push({
      requirement: "Filters scores of 50 or higher",
      passed: /(?:>=\s*50|50\s*<=)/.test(code),
    });
    checks.push({
      requirement: "Uses a list comprehension or map() to transform values",
      passed:
        (/\[[\s\S]*?\bfor\s+\w+\s+in\s+[\s\S]*?\]/.test(code) && /(?:\*|\+|-|\/)/.test(code)) ||
        /\bmap\s*\(/.test(code),
    });
    checks.push({
      requirement: "Doubles the values",
      passed: /(?:\*\s*2|2\s*\*)/.test(code),
    });
    checks.push({ requirement: "Uses a for loop to process results", passed: /\bfor\s+\w+\s+in\s+/.test(code) });
    checks.push({ requirement: "Uses sum()", passed: /\bsum\s*\(/.test(code) });
    checks.push({ requirement: "Displays the calculated result", passed: hasPrint() });
  }

  if (chapter.id === 8) {
    checks.push({ requirement: "Defines a class", passed: hasClassDef() });
    checks.push({ requirement: "Defines an __init__ method", passed: /def\s+__init__\s*\(/.test(code) });
    checks.push({
      requirement: "__init__ accepts custom parameters",
      passed: /def\s+__init__\s*\(\s*self\s*,\s*\w+/.test(code),
    });
    checks.push({ requirement: "Uses self", passed: /\bself\b/.test(code) });
    checks.push({
      requirement: "Stores instance attributes with self.",
      passed: /self\.\w+\s*=\s*(?!=)/.test(code),
    });
    checks.push({
      requirement: "Defines a method besides __init__",
      passed: (code.match(/def\s+\w+\s*\(\s*self\b/g)?.length ?? 0) >= 2,
    });
    checks.push({
      requirement: "Creates an instance of the class",
      passed: /\bPlayer\s*\(/.test(code),
    });
    checks.push({ requirement: "Calls a method on the instance", passed: /\b\w+\.\w+\s*\(/.test(code) });
    checks.push({ requirement: "Displays player information", passed: hasPrint() });
  }

  if (chapter.id === 9) {
    checks.push({ requirement: "Uses open()", passed: /\bopen\s*\(/.test(code) });
    checks.push({ requirement: "Uses the with statement", passed: /\bwith\s+open\s*\(/.test(code) });
    checks.push({
      requirement: "Opens a file in write mode",
      passed: /open\s*\([^)]*["']w["']/.test(code),
    });
    checks.push({ requirement: "Writes to the file", passed: /\.write\s*\(/.test(code) });
    checks.push({
      requirement: "Opens a file in read mode",
      passed: /open\s*\([^)]*["']r["']/.test(code),
    });
    checks.push({
      requirement: "Reads file contents",
      passed: /\.read\s*\(/.test(code) || /\bfor\s+\w+\s+in\s+\w+\s*:/.test(code),
    });
    checks.push({ requirement: "Displays the file contents", passed: hasPrint() });
    checks.push({ requirement: "Loops through the file's lines", passed: /\bfor\s+\w+\s+in\s+\w+\s*:/.test(code) });
  }

  if (chapter.id === 10) {
    checks.push({ requirement: "Defines a function", passed: hasFunctionDef() });
    checks.push({
      requirement: "Function accepts a health parameter",
      passed: /def\s+\w+\s*\(\s*\w+\s*\)/.test(code),
    });
    checks.push({ requirement: "Checks for negative health", passed: /\w+\s*<\s*0/.test(code) });
    checks.push({ requirement: "Uses raise", passed: /\braise\b/.test(code) });
    checks.push({ requirement: "Raises a ValueError", passed: /raise\s+ValueError\s*\(/.test(code) });
    checks.push({
      requirement: "Provides an error message",
      passed: /raise\s+ValueError\s*\(\s*["'][\s\S]+?["']\s*\)/.test(code),
    });
    checks.push({ requirement: "Uses try", passed: /\btry\s*:/.test(code) });
    checks.push({ requirement: "Uses except", passed: /\bexcept\b/.test(code) });
    checks.push({
      requirement: "Calls the health-checking function",
      passed: /\b\w+\s*\(\s*-?\s*\d+\s*\)/.test(code),
    });
    checks.push({ requirement: "Tests with a negative value", passed: /\(\s*-\s*\d+\s*\)/.test(code) });
    checks.push({
      requirement: "Displays the error message",
      passed: /print\s*\(\s*(?:str\s*\(\s*)?(?:error|err|e)\b/.test(code),
    });
  }

  return checks;
}
