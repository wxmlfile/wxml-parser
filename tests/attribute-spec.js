const { expect } = require("chai");
const _ = require("lodash");
const esquery = require("esquery");

const { parse } = require("../lib");

describe("Attribute Value", () => {
  it("no attribute Value, and as simple string", () => {
    const ast = parse(`
      <popup show main="zhuzhu" quote='single' />
    `);
    const matches = esquery(ast, "WXAttributeValue");
    expect(matches).to.be.lengthOf(2);
    expect(matches[0]).to.have.property("rawValue");
    expect(matches[0]).to.have.property("value");
    expect(matches[0]).to.have.property("quote");
    expect(matches[0].rawValue).to.be.equals('"zhuzhu"');
    expect(matches[0].value).to.be.equals("zhuzhu");
    expect(matches[0].quote).to.be.equals('"');
    expect(matches[1]).to.have.property("rawValue");
    expect(matches[1]).to.have.property("value");
    expect(matches[1]).to.have.property("quote");
    expect(matches[1].rawValue).to.be.equals("'single'");
    expect(matches[1].value).to.be.equals("single");
    expect(matches[1].quote).to.be.equals("'");
  });

  it("mixed with WXAttributeValInterpolation", () => {
    const ast = parse(
      `<popup class="class1 {{toggle ? 'classA' : 'classB'}} class2" />`
    );
    const attribValMatches = esquery(ast, "WXAttributeValue");
    expect(attribValMatches).to.be.lengthOf(1);
    expect(attribValMatches[0].value).to.be.length(3);
    expect(attribValMatches[0].value[0].type).to.be.equals("WXText");
    expect(attribValMatches[0].value[1].type).to.be.equals(
      "WXAttributeValInterpolation"
    );
    expect(attribValMatches[0].value[2].type).to.be.equals("WXText");
    expect(attribValMatches[0].value[0].value).to.be.equals("class1 ");
    expect(attribValMatches[0].value[1].value).to.be.equals(
      "toggle ? 'classA' : 'classB'"
    );
    expect(attribValMatches[0].value[2].value).to.be.equals(" class2");
    const attribValInterMatches = attribValMatches[0].value[1];
    expect(attribValInterMatches).to.have.property("rawValue");
    expect(attribValInterMatches).to.have.property("value");
    expect(attribValInterMatches.rawValue).to.be.equals(
      "{{toggle ? 'classA' : 'classB'}}"
    );
  });

  it("WXAttributeValInterpolation with '<'", () => {
    const ast = parse(`<comp wx:if="{{ index < list.length }}" ></comp>`);
    const attribValMatches = esquery(ast, "WXAttributeValue");
    expect(attribValMatches).to.be.lengthOf(1);
    expect(attribValMatches[0].value).to.be.length(1);
    expect(attribValMatches[0].value[0].type).to.be.equals(
      "WXAttributeValInterpolation"
    );
    expect(attribValMatches[0].value[0].value).to.be.equals(
      " index < list.length "
    );
    const attribValInterMatches = attribValMatches[0].value[0];
    expect(attribValInterMatches).to.have.property("rawValue");
    expect(attribValInterMatches).to.have.property("value");
    expect(attribValInterMatches.rawValue).to.be.equals(
      "{{ index < list.length }}"
    );
  });

  it("WXAttributeValInterpolation with complete '>' & '<'", () => {
    const ast = parse(
      `<comp wx:if="{{ index > 5 ? '</ss>' : '<pp />' }}" ></comp>`
    );
    const attribValMatches = esquery(ast, "WXAttributeValue");
    expect(attribValMatches).to.be.lengthOf(1);
    expect(attribValMatches[0].value).to.be.length(1);
    expect(attribValMatches[0].value[0].type).to.be.equals(
      "WXAttributeValInterpolation"
    );
    expect(attribValMatches[0].value[0].value).to.be.equals(
      " index > 5 ? '</ss>' : '<pp />' "
    );
    const attribValInterMatches = attribValMatches[0].value[0];
    expect(attribValInterMatches).to.have.property("rawValue");
    expect(attribValInterMatches).to.have.property("value");
    expect(attribValInterMatches.rawValue).to.be.equals(
      "{{ index > 5 ? '</ss>' : '<pp />' }}"
    );
  });

  it("illegal double left curly", () => {
    const ast = parse(
      `<comp wx:if="{{" ></comp>`
    );
    const errorMatches = _.get(ast, 'errors') || [];
    expect(errorMatches).to.be.lengthOf(2);
    expect(errorMatches[0].type).to.be.equals('WXLexerError');
    expect(errorMatches[1].type).to.be.equals('WXParseError');
    expect(errorMatches[1].value).to.be.equals('wx interpolation in attribute value unexpected end');
  });
});
