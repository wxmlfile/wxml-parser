const { expect } = require("chai");
const _ = require("lodash");

const { parse } = require("../lib");

describe("Root Program Test Suite", () => {
  it("program node properties check", () => {
    const ast = parse(`
      <app></app>
   `);
    expect(ast).to.be.have.property("type");
    expect(ast).to.be.have.property("tokens");
    expect(ast).to.be.have.property("comments");
    expect(ast).to.be.have.property("errors");
    expect(ast).to.be.have.property("loc");
    expect(ast).to.be.have.property("range");
    expect(ast).to.be.have.property("body");
    expect(ast).to.be.have.property("start");
    expect(ast).to.be.have.property("end");
  })

  it("parse a empty wxml file", () => {
    const ast = parse('');
    expect(ast.type).to.equals('Program');
    // ensure no errors
    expect(ast.errors).to.be.lengthOf(0);
    expect(ast.start).to.be.NaN;
    expect(ast.end).to.be.NaN;
    expect(ast.range[0]).to.be.NaN;
    expect(ast.range[1]).to.be.NaN;
    expect(_.get(ast, 'loc.start.line')).to.be.NaN;
    expect(_.get(ast, 'loc.start.column')).to.be.NaN;
    expect(_.get(ast, 'loc.end.line')).to.be.NaN;
    expect(_.get(ast, 'loc.start.column')).to.be.NaN;
  });

  it("ast must have a Program node", () => {
    const ast = parse(`
     a wxml case
    `);
    expect(ast.type).to.be.equals('Program');
  });

  it("ast must have a Program node even compile failed", () => {
    const ast = parse(`
     a wxml case </wxs> </whatever>
    `);
    expect(ast.type).to.be.equals('Program');
    expect(ast.errors.length).to.be.gt(0);
  });
})