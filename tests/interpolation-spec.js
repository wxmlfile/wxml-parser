/**
 * mustache-style interpolation {{}}
 * 
 * wxml data binding
 * https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/data.html
 */

const { expect } = require("chai");
const _ = require("lodash");
const esquery = require("esquery");

const { parse } = require("../lib");

describe("Interpolation Test Suite", () => {

  // #1 content
  // <view> {{ message }} </view>
  it("can parse WXInterpolation - simple", () => {
    const ast = parse(`
      <view> {{ message }} </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
    const wxInterpolation = matches[0];
    expect(wxInterpolation).to.have.property("value");
    expect(wxInterpolation).to.have.property("rawValue");
    expect(wxInterpolation.rawValue).to.be.equals("{{ message }}");
    expect(wxInterpolation.value).to.be.equals(" message ");
  })

  /**
   * @TODO not support parse WXInterpolation  in "" string yet
   */
  // #2 termplate attr
  // <view id="item-{{id}}"> </view>

  /**
   * @TODO not support parse WXInterpolation  in "" string yet
   */
  // #3 condition 
  // <view wx:if="{{condition}}"> </view>

  /**
   * @TODO not support parse WXInterpolation  in "" string yet
   */
  // #4 keyword
  // <checkbox checked="{{false}}"> </checkbox>

  // #5 Ternary operation
  // <view hidden="{{flag ? true : false}}"> Hidden </view>
  it("can parse WXInterpolation - ternary operation", () => {
    const ast = parse(`
      <view> {{ a > 2 ? : "{{}}" : '</sss />< />' }} </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
    const wxInterpolation = matches[0];
    expect(wxInterpolation.rawValue).to.be.equals("{{ a > 2 ? : \"{{}}\" : '</sss />< />' }}");
    expect(wxInterpolation.value).to.be.equals(" a > 2 ? : \"{{}}\" : '</sss />< />' ");
  })

  // #6 math compute
  // <view> {{a + b}} + {{c}} + d </view>
  it("can parse WXInterpolation - math compute", () => {
    const ast = parse(`
      <view> {{a + b}} + {{c}} + d </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(2);
    const wxInterpolation = matches[0];
    expect(wxInterpolation.rawValue).to.be.equals("{{a + b}}");
    expect(wxInterpolation.value).to.be.equals("a + b");
  })

  /**
   * @TODO not support parse WXInterpolation  in "" string yet
   */
  // #7 logic check
  // <view wx:if="{{length > 5}}"> </view>
  // <view wx:if="{{length < 5}}"> </view>
  // it("can parse WXInterpolation - logic check", () => {
  //   const ast = parse(`
  //     <view wx:if="{{length < 5}}"> </view>
  //   `);
  //   expect(ast.errors).to.be.lengthOf(0);
  //   const matches = esquery(ast, "WXInterpolation");
  //   expect(matches).to.be.lengthOf(1);
  //   const wxInterpolation = matches[0];
  //   expect(wxInterpolation.rawValue).to.be.equals("{{length < 5}}");
  //   expect(wxInterpolation.value).to.be.equals("length < 5");
  // })

  // #8 string compute
  // <view>{{"hello<></>}}{{}}{{" + name}}</view>
  it("can parse WXInterpolation - string compute", () => {
    const ast = parse(`
      <view>{{"hello<></>}}{{}}{{" + name}}</view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
    const wxInterpolation = matches[0];
    expect(wxInterpolation.rawValue).to.be.equals("{{\"hello<></>}}{{}}{{\" + name}}");
    expect(wxInterpolation.value).to.be.equals("\"hello<></>}}{{}}{{\" + name");
  })

  // #9 path compute
  // <view>{{object.key}} {{array[0]}}</view>
  it("can parse WXInterpolation - path compute", () => {
    const ast = parse(`
       <view>{{object.key}} {{array[0]}}</view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(2);
    const wxInterpolation = matches[0];
    const wxInterpolation2 = matches[1];
    expect(wxInterpolation.rawValue).to.be.equals("{{object.key}}");
    expect(wxInterpolation.value).to.be.equals("object.key");
    expect(wxInterpolation2.rawValue).to.be.equals("{{array[0]}}");
    expect(wxInterpolation2.value).to.be.equals("array[0]");
  })

  /**
   * @TODO not support parse WXInterpolation  in "" string yet
   */
  // #10 combine - array
  // <view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>

  /**
   * @TODO not support parse WXInterpolation  in "" string yet
   */
  // #11 combine - object
  // <template is="objectCombine" data="{{for: a, bar: b}}"></template>
  // <template is="objectCombine" data="{{foo, bar}}"></template>
  // <template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>
  // <view wx:for="{{[1,2,3]}} ">

  // #12 multi line
  it("can parse WXInterpolation - multi line", () => {
    const ast = parse(`
       <view>
        {{ OPTIONAL.default === type
           ? "xiaomi"
           : "meizu" }}
      </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
  })

});
