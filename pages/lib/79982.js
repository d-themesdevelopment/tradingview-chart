const symbols = [
    { d: "E-Mini S&P 500", t: "ES" },
    { d: "E-Mini Nasdaq 100", t: "NQ" },
    { d: "Gold", t: "GC" },
    { d: "Silver", t: "SI" },
    { d: "Crude Oil WTI", t: "CL" },
    { d: "Natural Gas", t: "NG" },
    { d: "Australian Dollar", t: "6A" },
    { d: "Australian Dollar (Floor)", t: "AD" },
    { d: "Euro FX", t: "6E" },
    { d: "Euro FX (Floor)", t: "EC" },
    { d: "Corn", t: "ZC" },
    { d: "Corn (Floor)", t: "C" },
    { d: "Eurodollar", t: "GE" },
    { d: "Eurodollar (Floor)", t: "ED" },
  ];
  
  class Token {
    constructor(value) {
      this.value = value;
    }
  
    toString() {
      return this.value;
    }
  }
  
  class SymbolToken extends Token {
    constructor(value) {
      super(value);
      this._exchange = null;
      this._ticker = null;
      this._root = null;
      this._contract = null;
    }
  
    parse() {
      const match = /^'?(?:([A-Z0-9_]+):)?(.*?)'?$/.exec(this.value);
      if (match[1]) {
        this._exchange = match[1];
      }
      this._ticker = match[2];
    }
  
    parseAsFutures() {
      if (!this._ticker) {
        this.parse();
      }
      for (let i = 2; i >= 1; i--) {
        const root = this._ticker.slice(0, i);
        if (symbols.some((symbol) => symbol.t === root)) {
          this._root = root;
          this._contract = this._ticker.slice(i);
          break;
        }
      }
    }
  
    exchange(value) {
      if (!this._ticker) {
        this.parse();
      }
      if (arguments.length === 0) {
        return this._exchange;
      }
      if (value === null) {
        delete this._exchange;
      } else {
        this._exchange = value.toString();
      }
    }
  
    ticker(value) {
      if (!this._ticker) {
        this.parse();
      }
      if (arguments.length === 0) {
        return this._ticker;
      }
      if (value === null) {
        delete this._ticker;
      } else {
        this._ticker = value.toString();
        delete this._root;
        delete this._contract;
      }
    }
  
    root(value) {
      if (!this._root) {
        this.parseAsFutures();
      }
      if (arguments.length === 0) {
        return this._root;
      }
      if (value === null) {
        delete this._root;
      } else {
        this._root = value.toString();
        if (this._root) {
          this._ticker = this._root + (this._contract || "");
        }
      }
    }
  
    contract(value) {
      if (!this._contract) {
        this.parseAsFutures();
      }
      if (arguments.length === 0) {
        return this._root;
      }
      if (value === null) {
        delete this._contract;
      } else {
        this._contract = value.toString();
        if (this._root) {
          this._ticker = this._root + this._contract;
        }
      }
    }
  }
  
  class NumberToken extends Token {
    parse() {
      this._normalizedValue = this.value
        .replace(/^0+|\.0*$/g, "")
        .replace(/(\.\d*?)0+$/, "$1")
        .replace(/^(\.|$)/, "0$1");
    }
  
    toString() {
      return this._normalizedValue || this.value;
    }
  }
  
  class BinaryOperatorToken extends Token {}
  
  class OpenBraceToken extends Token {}
  
  class CloseBraceToken extends Token {}
  
  class IncompleteSymbolToken extends SymbolToken {
    constructor() {
      super("");
    }
  
    get isIncomplete() {
      return true;
    }
  
    incompleteSuggest() {
      if (this.value !== "'") {
        return "'";
      }
    }
  }
  
  class DotToken extends NumberToken {
    isIncomplete = true;
  }
  
  const tokenTypes = [
    { pattern: "(", ctor: OpenBraceToken },
    { pattern: ")", ctor: CloseBraceToken },
    { pattern: "+", ctor: BinaryOperatorToken },
    { pattern: "-", ctor: BinaryOperatorToken },
    { pattern: "*", ctor: BinaryOperatorToken },
    { pattern: "/", ctor: BinaryOperatorToken },
    { pattern: "^", ctor: BinaryOperatorToken },
    {
      pattern: /\d+(?:\.\d*|(?![a-zA-Z0-9_!:.&]))|\.\d+/,
      ctor: NumberToken,
    },
    { pattern: /\./, ctor: DotToken },
    {
      pattern: /'[^']*/,
      ctor: SymbolToken,
    },
    {
      pattern: /[a-zA-Z0-9_\u0370-\u1FFF_\u2E80-\uFFFF^][a-zA-Z0-9_\u0020\u0370-\u1FFF_\u2E80-\uFFFF_!:.&]*|'.+?'/,
      ctor: SymbolToken,
    },
    { pattern: /[\0-\x20\s]+/, ctor: Token },
  ];
  
  function tokenize(input, options) {
    const tokens = [];
    let match;
    let incompleteTokenIndex;
    const regex = new RegExp(
      tokenTypes
        .map((type) =>
          `(${typeof type.pattern === "string" ? type.pattern.replace(/[\^$()[\]{}*+?|\\]/g, "\\$&") : type.pattern.source})`
        )
        .concat(".")
        .join("|"),
      "g"
    );
  
    while ((match = regex.exec(input))) {
      for (let i = 0; i < tokenTypes.length; i++) {
        if (match[i + 1]) {
          if (tokenTypes[i].ctor) {
            const token = new tokenTypes[i].ctor(match[i + 1]);
            token._offset = match.index;
            tokens.push(token);
          }
          continue;
        }
      }
  
      const lastToken = new Token(match[0]);
      lastToken._offset = match.index;
      tokens.push(lastToken);
    }
  
    if (options?.recover) {
      let incompleteTokenStartIndex;
      for (let i = tokens.length - 1; i >= 0; i--) {
        const token = tokens[i];
        if (token instanceof NumberToken || token instanceof SymbolToken) {
          if (incompleteTokenStartIndex !== undefined) {
            const newToken = new SymbolToken("");
            const removedTokens = tokens.splice(incompleteTokenStartIndex, i - incompleteTokenStartIndex + 1, newToken);
            newToken.value = removedTokens.map((token) => token.value).join("");
          }
          incompleteTokenStartIndex = undefined;
        } else if (token instanceof IncompleteSymbolToken) {
          if (incompleteTokenStartIndex === undefined) {
            incompleteTokenStartIndex = i;
          }
        } else {
          incompleteTokenStartIndex = undefined;
        }
      }
    }
  
    return tokens;
  }
  
  function validate(tokens) {

    let currentState = "init";
    const braces = [];
    var c = {isEmpty: true,
        warnings: [],
        errors: [],
    };
  
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
  
      if (!(token instanceof Token)) {
        delete c.isEmpty;
  
        if (token.isIncomplete) {
          const incompleteWarning = {
            status: "incomplete",
            reason: "incomplete_token",
            offset: token._offset,
            token: token,
          };
          if (token.incompleteSuggest) {
            incompleteWarning.recover = {
              append: token.incompleteSuggest(),
            };
          }
          if (errors.length === 0 || i !== tokens.length - 1) {
            incompleteWarning.status = "error";
          }
          warnings.push(incompleteWarning);
          continue;
        }
  
        if (token instanceof SymbolToken || token instanceof NumberToken) {
          if (currentState === "var") {
            errors.push({
              status: "error",
              reason: "unexpected_token",
              offset: token._offset,
              token: token,
            });
            continue;
          }
          currentState = "var";
        } else if (token instanceof BinaryOperatorToken) {
          if (currentState !== "var") {
            errors.push({
              status: "error",
              reason: "unexpected_token",
              offset: token._offset,
              token: token,
            });
            continue;
          }
          currentState = "operator";
        } else if (token instanceof OpenBraceToken) {
          if (currentState === "var") {
            errors.push({
              status: "error",
              reason: "unexpected_token",
              offset: token._offset,
              token: token,
            });
            continue;
          }
          braces.push({ minPrecedence: Infinity, openBraceIndex: i });
          currentState = "init";
        } else if (token instanceof CloseBraceToken) {
          if (currentState !== "var") {
            errors.push({
              status: "error",
              reason: "unexpected_token",
              offset: token._offset,
              token: token,
            });
            continue;
          }
          const lastBrace = braces.pop();
          if (!lastBrace) {
            errors.push({
              status: "error",
              reason: "unbalanced_brace",
              offset: token._offset,
              token: token,
              recover: { prepend: new OpenBraceToken() },
            });
          } else {
            const nextToken = tokens[i + 1];
            if (nextToken instanceof BinaryOperatorToken && nextToken.precedence > lastBrace.minPrecedence) {
              errors.push({
                status: "error",
                reason: "unexpected_token",
                offset: token._offset,
                token: token,
              });
            } else if (lastBrace.minPrecedence !== Infinity) {
              warnings.push(lastBrace.openBraceIndex, i);
              if (braces.length && braces[braces.length - 1].minPrecedence > lastBrace.minPrecedence) {
                braces[braces.length - 1].minPrecedence = lastBrace.minPrecedence;
              }
            }
          }
          currentState = "var";
        } else if (token instanceof SymbolToken) {
          errors.push({
            status: "error",
            reason: "unparsed_entity",
            offset: token._offset,
            token: token,
          });
        }
      }
    }
  
    const braceBalance = braces.length;
    if (currentState !== "var") {
      c.warnings.push({ status: "incomplete" });
    }
  
    for (const brace of braces) {
      const incompleteWarning = {
        status: "incomplete",
        reason: "unbalanced_brace",
        offset: tokens[brace.openBraceIndex]._offset,
        token: tokens[brace.openBraceIndex],
      };
      if (currentState === "var") {
        incompleteWarning.recover = { append: new CloseBraceToken() };
      }
      c.warnings.push(incompleteWarning);
    }
  
    if (c.warnings.length === 0) {
      delete c.warnings;
    }
    if(errors.length === 0) {
      delete c.errors;
    }
  
    return {
      currentState: currentState,
      warnings: c.warnings,
      errors: c.errors,
      isEmpty: c.isEmpty,
      braceBalance: braceBalance,
    };
  }
  
  function factorOutBraces(tokens) {
    tokens = tokens.filter((token) => !(token instanceof OpenBraceToken || token instanceof CloseBraceToken));
    const bracePairs = [];
  
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
  
      if (token instanceof BinaryOperatorToken) {
        if (bracePairs.length && bracePairs[bracePairs.length - 1].minPrecedence > token.precedence) {
          bracePairs[bracePairs.length - 1].minPrecedence = token.precedence;
        }
      } else if (token instanceof OpenBraceToken) {
        bracePairs.push({ minPrecedence: Infinity, openBraceIndex: i });
      } else if (token instanceof CloseBraceToken) {
        const lastBrace = bracePairs.pop();
        if (lastBrace) {
          tokens.splice(lastBrace.openBraceIndex, i - lastBrace.openBraceIndex + 1);
          tokens.splice(lastBrace.openBraceIndex, 0, new OpenBraceToken());
          tokens.splice(i, 0, new CloseBraceToken());
          if (bracePairs.length && bracePairs[bracePairs.length - 1].minPrecedence > lastBrace.minPrecedence) {
            bracePairs[bracePairs.length - 1].minPrecedence = lastBrace.minPrecedence;
          }
        }
      }
    }
  
    return tokens;
  }
  
  function normalizeTokens(tokens) {
    for (const token of tokens) {
      if (typeof token.parse === "function") {
        token.parse();
      }
    }
    return tokens;
  }
  
  function flip(expression) {
    const tokens = normalizeTokens(tokenize(expression));
    const factorizedTokens = factorOutBraces(tokens) || [new NumberToken("1"), new BinaryOperatorToken(), new OpenBraceToken(), ...tokens, new CloseBraceToken()];
    return factorOutBraces(factorizedTokens);
  }
  
  function hasBatsSymbols(expression) {
    const tokens = normalizeTokens(tokenize(expression));
    return tokens.some((token) => token instanceof SymbolToken && token.exchange() === "BATS");
  }
  
  function hasEodSymbols(expression) {
    const token = getExchange(expression);
    return token && token.toUpperCase().includes("_EOD");
  }
  
  function hasChxjpySymbols(expression) {
    const tokens = normalizeTokens(tokenize(expression));
    return tokens.some((token) => token instanceof SymbolToken && token.exchange() === "CHXJPY");
  }
  
  function hasFreeDelaySymbols(expression) {
    const tokens = normalizeTokens(tokenize(expression));
    const exchanges = symbols.map((symbol) => symbol.t);
    return tokens.some((token) => token instanceof SymbolToken && exchanges.includes((token || "").toUpperCase() + "_DLY"));
  }
  
  function getExchange(expression) {
    const tokens = normalizeTokens(tokenize(expression));
    const exchangeTokens = tokens.filter((token) => token instanceof SymbolToken).map((token) => token.exchange());
    return exchangeTokens.length === 1 ? exchangeTokens[0] : null;
  }
  
  function getExchanges(expression) {
    const tokens = normalizeTokens(tokenize(expression));
    return tokens.filter((token) => token instanceof SymbolToken).map((token) => token.exchange()).filter((exchange) => exchange);
  }
  
  function isExchange(expression, prefix) {
    const token = getExchange(expression);
    return token && token.substring(0, prefix.length) === prefix;
  }
  
  function shortName(expression) {
    const tokens = factorOutBraces(normalizeTokens(tokenize(expression))) || [new NumberToken("1"), new BinaryOperatorToken(), new OpenBraceToken(), ...tokens, new CloseBraceToken()];
    tokens.forEach((token) => {
      if (token instanceof SymbolToken) {
        token.exchange(null);
      }
    });
    return tokens.join("");
  }
  
  function normalize(expression) {
    const tokens = factorOutBraces(normalizeTokens(tokenize(expression))) || [new NumberToken("1"), new BinaryOperatorToken(), new OpenBraceToken(), ...tokens, new CloseBraceToken()];
    return tokens.join("");
  }