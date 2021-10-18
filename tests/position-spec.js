const fs = require("fs");
const path = require("path");

const { expect } = require("chai");
const _ = require("lodash");
const esquery = require("esquery");

const { parse, parseForESLint } = require("../lib");

/**
 * Read Fixtures folder wxml file
 * 
 * @param {string} name 
 * @returns  {stirng}
 */
function readFixtureFile(name) {
  return fs.readFileSync(path.join(__dirname, `./fixtures/${name}`),{ encoding: "utf8" });
}

describe("Position Test Suite", () => {
  it("wxs entire tag position match", () => {
    const sourceCode = readFixtureFile("wxs-position.wxml");
    const ast = parse(sourceCode);
    const wxsMatchs = esquery(ast, "WXScript");
    const wxsNode = wxsMatchs[0];
    expect(wxsNode).to.have.property("loc");
    expect(wxsNode.loc).to.have.deep.property('start', { line: 2, column: 1 });
    expect(wxsNode.loc).to.have.deep.property('end', { line: 6, column: 6 });
  });

  it("normal tag position match", () => {
    const sourceCode = readFixtureFile("tag-position.wxml");
    const ast = parse(sourceCode);
    const wxsMatchs = esquery(ast, "WXElement");
    const wxsNode = wxsMatchs[0];
    expect(wxsNode).to.have.property("loc");
    expect(wxsNode.loc).to.have.deep.property('start', { line: 3, column: 4 });
    expect(wxsNode.loc).to.have.deep.property('end', { line: 5, column: 12 });
  });

  it("wxs inline js estree node position match", () => {
    const sourceCode = readFixtureFile("eslint-wxs-position.wxml");
    const result = parseForESLint(sourceCode);

    // entire wxs js block
    const wxsProgramMatchs = esquery(result.ast, "WXScriptProgram");
    const wxsProgram = wxsProgramMatchs[0];
    expect(wxsProgram).to.have.property("loc");
    expect(_.get(wxsProgram, 'loc.start.line')).to.be.equals(6);
    expect(_.get(wxsProgram, 'loc.start.column')).to.be.equals(4);
    expect(_.get(wxsProgram, 'loc.end.line')).to.be.equals(11);
    expect(_.get(wxsProgram, 'loc.end.column')).to.be.equals(5);

    // query single js grammer node
    // #1 js comment
    const wxsCommentMatchs = esquery(result.ast, "line");
    const wxsComment = wxsCommentMatchs[0];
    expect(_.get(wxsComment, 'loc.start.line')).to.be.equals(5);
    expect(_.get(wxsComment, 'loc.start.column')).to.be.equals(4);
    expect(_.get(wxsComment, 'loc.end.line')).to.be.equals(5);
    expect(_.get(wxsComment, 'loc.end.column')).to.be.equals(31);

    // #2 js MemberExpression
    const wxsMemberExpressionMatchs = esquery(result.ast, "MemberExpression");
    const wxsMember = wxsMemberExpressionMatchs[0];
    expect(_.get(wxsMember, 'loc.start.line')).to.be.equals(9);
    expect(_.get(wxsMember, 'loc.start.column')).to.be.equals(4);
    expect(_.get(wxsMember, 'loc.end.line')).to.be.equals(9);
    expect(_.get(wxsMember, 'loc.end.column')).to.be.equals(18);
  });

  it("wxs inline js estree node position match #2", () => {
    const sourceCode = readFixtureFile("eslint-wxs-position-2.wxml");
    const result = parseForESLint(sourceCode);
    
    // entire js block
    const wxsProgramMatchs = esquery(result.ast, "WXScriptProgram");
    const wxsProgram = wxsProgramMatchs[0];
    expect(_.get(wxsProgram, 'loc.start.line')).to.be.equals(3);
    expect(_.get(wxsProgram, 'loc.start.column')).to.be.equals(32);
    expect(_.get(wxsProgram, 'loc.end.line')).to.be.equals(8);
    expect(_.get(wxsProgram, 'loc.end.column')).to.be.equals(5);

    // Block comment
    const blockMatchs = esquery(result.ast, "Block");
    const block = blockMatchs[0];
    expect(_.get(block, 'loc.start.line')).to.be.equals(3);
    expect(_.get(block, 'loc.start.column')).to.be.equals(8);
    expect(_.get(block, 'loc.end.line')).to.be.equals(3);
    expect(_.get(block, 'loc.end.column')).to.be.equals(31);
  });

})
