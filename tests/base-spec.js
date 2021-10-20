const { expect } = require("chai");
const _ = require("lodash");
const esquery = require("esquery");

const { parse } = require("../lib");

describe("Base Test Suite", () => {
  it("can parse self close WXElement", () => {
    const ast = parse(`
      <element />
    `);
    const matches = esquery(ast, "WXElement");
    const startTagMatches = esquery(ast, "WXStartTag");
    expect(matches).to.be.lengthOf(1);
    const wxElement = matches[0];
    const wxStartTag = startTagMatches[0];
    expect(wxElement).to.have.property("children");
    expect(wxElement).to.have.property("endTag");
    expect(wxElement.endTag).to.be.null;
    expect(wxElement).to.have.property("startTag");
    expect(wxStartTag).to.have.property("selfClosing");
    expect(wxStartTag.selfClosing).to.be.true
  })

  it("can parse WXElement", () => {
    const ast = parse(`
      <element module="home"></element>
    `);
    const matches = esquery(ast, "WXElement");
    const startTagMatches = esquery(ast, "WXStartTag");
    const endTagMatches = esquery(ast, "WXStartTag");
    expect(matches).to.be.lengthOf(1);
    const wxElement = matches[0];
    const wxStartTag = startTagMatches[0];
    const wxEndTag = endTagMatches[0];
    expect(wxElement).to.have.property("children");
    expect(wxElement).to.have.property("endTag");
    expect(wxElement.endTag.name).to.be.equals("element");
    expect(wxElement).to.have.property("startTag");
    expect(wxStartTag).to.have.property("selfClosing");
    expect(wxStartTag.selfClosing).to.be.false
  })

  it("can parse mismatch tag name WXElement", () => {
    const ast = parse(`
      <element module="home">
        <a />
      </other>
    `);
    const matches = esquery(ast, "WXElement");
    const endTagMatches = esquery(ast, "WXEndTag");
    expect(matches).to.be.lengthOf(2);
    const wxElement = matches[0];
    const wxEndTag = endTagMatches[0];
    expect(wxElement).to.have.property("children");
    expect(wxElement).to.have.property("endTag");
    expect(wxEndTag).to.have.property("name");
    expect(wxEndTag.name).to.be.equals("other");
  })

  it("can parse WXStartTag", () => {
    const ast = parse(`
      <wxs module="sss" src="../../util.wxs" />
    `);
    const matches = esquery(ast, "WXStartTag");
    expect(matches).to.be.lengthOf(1);
    const wxStartTag = matches[0];
    expect(wxStartTag).to.have.property("attributes");
    expect(wxStartTag.attributes).to.be.lengthOf(2);
    expect(wxStartTag).to.have.property("selfClosing");
    expect(wxStartTag.selfClosing).to.be.equals(true);
  })

  it("can parse WXEndTag", () => {
    const ast = parse(`
      <app></app>
    `);
    const ast2 = parse(`
      <popup></pop>
    `);
    const matches = esquery(ast, "WXEndTag");
    const matches2 = esquery(ast2, "WXEndTag");
    expect(matches).to.be.lengthOf(1);
    expect(matches2).to.be.lengthOf(1);
    const wxEndTag = matches[0];
    const errWXEndTag = matches2[0];
    expect(wxEndTag).to.have.property("name");
    expect(wxEndTag.name).to.be.equals("app");
    expect(errWXEndTag).to.have.property("name");
    expect(errWXEndTag.name).to.be.equals("pop");
  })

  it("can parse WXAttribute", () => {
    const ast = parse(`
      <popup show main="zhuzhu" quote='single' />
    `);
    const matches = esquery(ast, "WXAttribute");
    expect(matches).to.be.lengthOf(3);
    // show -- WXAttribute without value
    expect(matches[0].key).to.be.equals("show");
    expect(matches[0].value).to.be.null;
    // main -- WXAttribute with double quote
    expect(matches[1].key).to.be.equals("main");
    expect(matches[1]).to.have.property("rawValue");
    expect(matches[1]).to.have.property("value");
    expect(matches[1]).to.have.property("quote");
    expect(matches[1].rawValue).to.be.equals("\"zhuzhu\"");
    expect(matches[1].value).to.be.equals("zhuzhu");
    expect(matches[1].quote).to.be.equals("\"");
    // quote -- WXAttribute with single quote
    expect(matches[2].key).to.be.equals("quote");
    expect(matches[2]).to.have.property("rawValue");
    expect(matches[2]).to.have.property("value");
    expect(matches[2]).to.have.property("quote");
    expect(matches[2].rawValue).to.be.equals("'single'");
    expect(matches[2].value).to.be.equals("single");
    expect(matches[2].quote).to.be.equals("'");
  })

  it("can parse WXComment", () => {
    const ast = parse(`
      <app></app>
      <!-- comment -->
    `);
    const matches = esquery(ast, "WXComment");
    expect(matches).to.be.lengthOf(1);
    const wxComment = matches[0];
    expect(wxComment).to.have.property("value");
    expect(wxComment.value).to.be.equals(" comment ");
  })

  it("can parse multi line WXComment", () => {
    const ast = parse(`
      <app></app>
      <!--
      multi line comment
      -->
      <component />
    `);
    const matches = esquery(ast, "WXComment");
    expect(matches).to.be.lengthOf(1);
    const wxComment = matches[0];
    expect(wxComment).to.have.property("value");
    expect(wxComment.value).to.be.equals("\n      multi line comment\n      ");
  })

  it("can parse WXText", () => {
    const ast = parse(`
      text out side wxml tree
      <app>text in wxml node</app>
      tail text
    `);
    const matches = esquery(ast, "WXText");
    expect(matches).to.be.lengthOf(5);
    const wxText = matches[2];
    expect(wxText).to.have.property("value");
    expect(wxText.value).to.be.equals("text in wxml node")
  });

  it("can parse WXScript", () => {
    const ast = parse(`
      <wxs module="util" src="../../util.wxs" />
    `);
    const matches = esquery(ast, "WXScript");
    const attrMatches = esquery(ast, "WXAttribute");
    expect(matches).to.be.lengthOf(1);
    expect(attrMatches).to.be.lengthOf(2);
    const wxScript = matches[0];
    expect(wxScript).to.have.property("value");
    expect(wxScript.value).to.be.null;
    expect(wxScript).to.have.property("startTag");
    expect(wxScript).to.have.property("endTag");
    expect(wxScript.endTag).to.be.null;
  });

  it("can parse inline WXScript", () => {
    const ast = parse(`
      <wxs module="util" >
        var s = {};
        module.exports = { data: s }
      </wxs>
    `);
    const matches = esquery(ast, "WXScript");
    const wxsProgramMatches = esquery(ast, "WXScriptProgram");
    const attrMatches = esquery(ast, "WXAttribute");
    expect(matches).to.be.lengthOf(1);
    // normal parser not parse inline wxs
    expect(wxsProgramMatches).to.be.lengthOf(0);
    expect(attrMatches).to.be.lengthOf(1);
    const wxScript = matches[0];
    expect(wxScript).to.have.property("value");
    expect(wxScript).to.have.property("startTag");
    expect(wxScript).to.have.property("endTag");
  });

  it("can add blackspace between '<' and start tag name", () => {
    const ast = parse(`
      < comp></comp>
    `);
    const matches = esquery(ast, "WXElement");
    expect(matches).to.be.lengthOf(1);
    const wxElement = matches[0];
    expect(wxElement).to.have.property("name");
    expect(wxElement.name).to.be.equals("comp");
  })

  it("can parse tag which endTag contain white space", () => {
    const ast = parse(`
      <comp></ comp >
      <comp2></ comp2>
      <comp3></comp3 >
    `);
    expect(ast.errors.length).to.be.equals(0)
    const matches = esquery(ast, "WXElement");
    expect(matches).to.be.lengthOf(3);
    expect(matches[0].endTag.name).to.be.equals("comp");
    expect(matches[1].endTag.name).to.be.equals("comp2");
    expect(matches[2].endTag.name).to.be.equals("comp3");
  })

  it("can parse WXAttribute interpolation", () => {
    const ast = parse(`
      <comp wx:if="{{ index < list.length }}" ></comp>
      <mall wx:if="{{ index > list.length }}" ></mall>
    `);
    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(0);
    const matches = esquery(ast, "WXElement");
    expect(matches).to.be.lengthOf(2);
    const attrMatches = esquery(ast, "WXAttribute");
    expect(attrMatches).to.be.lengthOf(2);
    expect(attrMatches[0].value).to.be.equals("{{ index < list.length }}");
    expect(attrMatches[1].value).to.be.equals("{{ index > list.length }}");
  })

  it("can parse WXAttribute interpolation #2", () => {
    const ast = parse(`
      <comp wx:if="{{ index > 5 ? '</ss>' : '<pp />' }}" ></comp>
    `);
    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(0);
    const matches = esquery(ast, "WXElement");
    expect(matches).to.be.lengthOf(1);
    const attrMatches = esquery(ast, "WXAttribute");
    expect(attrMatches).to.be.lengthOf(1);
    expect(attrMatches[0].value).to.be.equals("{{ index > 5 ? '</ss>' : '<pp />' }}");
  })
})
