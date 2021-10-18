const { expect } = require("chai");
const _ = require("lodash");
const esquery = require("esquery");

const { parse } = require("../lib");

describe("Error Test Suite", () => {
  it("mismatchedTokenException error", () => {
    const ast = parse(`
      <app >
    `);

    // @wxml/parser try to lookup missing endTag
    // <app > </
    //        ↑↑↑↑ 

    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);

    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("MismatchedTokenException");
  });

  it("inline wxs missing endTag error", () => {
    const ast = parse(`
      <wxs module="inline"> var s = 23;
    `);

    // @wxml/parser try to lookup missing WXS_TEXT
    // <wxs module="inline"> var s = 23; balabale </wxs>
    //                       ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);

    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("MismatchedTokenException");
  });

  it("wx attrs missing value but contain a equals character error", () => {
    const ast = parse(`
      <a-pop a= ></a-pop>
    `);

    // @wxml/parser will respect it as WXAttribute but no value
    // <a-pop a= ></a-pop>
    //       ↑↑↑↑

    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);

    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("MismatchedTokenException");
    expect(parseError).to.have.property("value");
    expect(parseError.value).to.be.equals("wx attributes missing value");

    // check WXAttribute
    const attrsMatchs = esquery(ast, "WXAttribute")
    expect(attrsMatchs).to.be.lengthOf(1);
    const attr = attrsMatchs[0];
    expect(attr).to.have.property("key");
    expect(attr.key).to.be.equals("a");
    // all value relative val should be null
    expect(attr.quote).to.be.null;
    expect(attr.value).to.be.null;
    expect(attr.rawValue).to.be.null;
  });

  it("start tag missing name error", () => {
    const ast = parse(`
      <app>
        <></name>
      </app>
    `);

    // @wxml/parser try to lookup missing start tag name
    // <></name>
    //  ↑
    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);
    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("MismatchedTokenException");
    expect(parseError).to.have.property("value");
    expect(parseError.value).to.be.equals("Expecting token of type --> NAME <-- but found --> '>' <--");

    // tolerant parse
    const elementMatchs = esquery(ast, "WXElement");
    expect(elementMatchs).to.be.lengthOf(2);
  });

  it("start tag missing '>' close character error", () => {
    const ast = parse(`
      <app>
        <a-pop show  </a-pop>
      </app>
    `);

    // @wxml/parser try to lookup missing clsoe '>'
    // <a-pop show > </a-pop>
    //             ↑
    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);
    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("NoViableAltException");
    expect(parseError).to.have.property("value");
    expect(parseError.value).to.be.equals("Expecting: one of these possible Token sequences:\n  1. [CLOSE]\n  2. [SLASH_CLOSE]\nbut found: '</'");

    // tolerant parse
    const elementMatchs = esquery(ast, "WXElement");
    expect(elementMatchs).to.be.lengthOf(2);
    const brokenElement = elementMatchs[1];
    expect(brokenElement.startTag).to.be.null;
    expect(brokenElement.endTag).to.be.null;
  });

  it("end tag missing close character '>' error", () => {
    const ast = parse(`
      <a-pop ></a
    `);

    // @wxml/parser try to lookup missing close character '>'
    // <a-pop ></a>
    //            ↑
    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);
    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("MismatchedTokenException");
    expect(parseError).to.have.property("value");
    expect(parseError.value).to.be.equals("wx element missing end close '>'");

    // tolerant parse
    const elementMatchs = esquery(ast, "WXElement");
    expect(elementMatchs).to.be.lengthOf(1);
    const element = elementMatchs[0];
    expect(element).to.have.property("name");
    expect(element.name).to.be.equals("a-pop");
  });

  it("end tag missing name error", () => {
    const ast = parse(`
      <app>
        <a-pop show ></>
      </app>
    `);

    // @wxml/parser try to lookup missing end tag name
    // <a-pop ></>
    //           ↑
    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);
    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("MismatchedTokenException");
    expect(parseError).to.have.property("value");
    expect(parseError.value).to.be.equals("wx element missing end tag name");

    // tolerant parse
    const elementMatchs = esquery(ast, "WXElement");
    expect(elementMatchs).to.be.lengthOf(2);
  });

  it("end tag missing '</' slash open error", () => {
    const ast = parse(`
      <app>
        <a-pop show > age>
      </app>
    `);

    // @wxml/parser try to lookup missing slash open
    // <a-pop show > </age>
    //               ↑↑
    const parseErrorMatchs = _.get(ast, 'errors') || [];
    expect(parseErrorMatchs).to.be.lengthOf(1);
    const parseError = parseErrorMatchs[0];
    expect(parseError).to.have.property("rawType");
    expect(parseError.rawType).to.be.equals("MismatchedTokenException");
    expect(parseError).to.have.property("value");
    expect(parseError.value).to.be.equals("wx element missing slash open '</'");

    // tolerant parse
    const elementMatchs = esquery(ast, "WXElement");
    expect(elementMatchs).to.be.lengthOf(2);
    const attrsMatchs = esquery(ast, "WXAttribute");
    expect(attrsMatchs).to.be.lengthOf(1);
  });

})
