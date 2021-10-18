const { expect } = require("chai");
const _ = require("lodash");
const esquery = require("esquery");

const { parseForESLint } = require("../lib");

describe("ESLint Parser Test Suite", () => {
  it("parseForESLint return object type", () => {
    const result = parseForESLint(`
      <app />
    `);
    expect(result).to.be.property("ast");
    expect(result).to.be.property("services");
    expect(result).to.be.property("scopeManager");
    expect(result).to.be.property("visitorKeys");
  });

  it("can parse inline wxs", () => {
    const result = parseForESLint(`
      <wxs module="utils">
        var s = "test case";
        module.exports = { s: s }
      </wxs>
    `);
    expect(esquery(result.ast, 'WXScriptProgram')).to.be.lengthOf(1);
  });

  it("can store wxs js parse error", () => {
    const result = parseForESLint(`
      <wxs module="utils">
        var s = "test case // missing quote(") here
        module.exports = { s: s }
      </wxs>
    `);
    expect(_.get(result, "ast.body[1]")).to.be.property("error");
    expect(_.get(result, "ast.body[1].error.type")).to.be.equals("WXScriptError");
    expect(esquery(result.ast, 'WXScriptError')).to.be.lengthOf(1);
  });

  it("can query wxs estree node via esquery", () => {
    const result = parseForESLint(
      "<wxs module=\"utils\">" +
      "   var s = \"test case\";" +
      "   module.exports = { s: s }" +
      "</wxs>"
     );
    const matchs = esquery(result.ast, "WXScriptProgram");
    const innerMatchs = esquery(result.ast, "MemberExpression");
    expect(matchs).to.be.lengthOf(1);
    expect(innerMatchs).to.be.lengthOf(1);
  });

})