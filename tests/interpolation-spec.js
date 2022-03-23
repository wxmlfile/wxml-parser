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

  // #2 termplate attr
  // <view id="item-{{id}}"> </view>
  it("can parse WXInterpolation - literal template", () => {
    const ast = parse(`
      <view id="item-{{id}}"> </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
    const intp = _.get(matches, '[0]');
    expect(intp).to.have.property("value");
    expect(intp).to.have.property("rawValue");
    expect(intp.rawValue).to.be.equals("{{id}}");
    expect(intp.value).to.be.equals("id");
    // raw WXAttribute is also exist
    const matches2 = esquery(ast, "WXAttribute");
    expect(matches2).to.be.lengthOf(1);
    const wxAttr = matches2[0];
    expect(wxAttr).to.have.property("value");
    expect(wxAttr).to.have.property("rawValue");
    expect(wxAttr.rawValue).to.be.equals("\"item-{{id}}\"");
    expect(wxAttr.value).to.be.equals("item-{{id}}");
  })

  // #3 condition 
  // <view wx:if="{{condition}}"> </view>
  it("can parse WXInterpolation - condition", () => {
    const ast = parse(`
    <view wx:if="{{condition}}"> </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
    const intp = _.get(matches, '[0]');
    expect(intp).to.have.property("value");
    expect(intp).to.have.property("rawValue");
    expect(intp.rawValue).to.be.equals("{{condition}}");
    expect(intp.value).to.be.equals("condition");
  })

  // #4 keyword
  // <checkbox checked="{{false}}"> </checkbox>
  it("can parse WXInterpolation - keyword", () => {
    const ast = parse(`
      <checkbox checked="{{false}}"> </checkbox>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
    const intp = _.get(matches, '[0]');
    expect(intp).to.have.property("value");
    expect(intp).to.have.property("rawValue");
    expect(intp.rawValue).to.be.equals("{{false}}");
    expect(intp.value).to.be.equals("false");
  })

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

  // #7 logic check
  // <view wx:if="{{length > 5}}"> </view>
  // <view wx:if="{{length < 5}}"> </view>
  it("can parse WXInterpolation - logic check", () => {
    const ast = parse(`
      <view wx:if="{{length < 5}}"> </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(1);
    const intp = _.get(matches, '[0]');
    expect(intp).to.have.property("value");
    expect(intp).to.have.property("rawValue");
    expect(intp.rawValue).to.be.equals("{{length < 5}}");
    expect(intp.value).to.be.equals("length < 5");
  })

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

  // #10 combine - array
  // <view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>
  it("can parse WXInterpolation - combine array", () => {
    const ast = parse(`
      <view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(2);
    const intp = _.get(matches, '[1]');
    expect(intp).to.have.property("value");
    expect(intp).to.have.property("rawValue");
    expect(intp.rawValue).to.be.equals("{{[zero, 1, 2, 3, 4]}}");
    expect(intp.value).to.be.equals("[zero, 1, 2, 3, 4]");
  })

  // #11 combine - object
  // <template is="objectCombine" data="{{for: a, bar: b}}"></template>
  // <template is="objectCombine" data="{{foo, bar}}"></template>
  // <template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>
  it("can parse WXInterpolation - combine object", () => {
    const ast = parse(`
      <template is="objectCombine" data="  {{for: a, bar: b}}  "></template>
      <template is="objectCombine" data="{{foo, bar}}"></template>
      <template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXAttribute");
    expect(matches[1].interpolations).to.be.lengthOf(1);
    const intp = _.get(matches, '[1].interpolations[0]');
    const intp2 = _.get(matches, '[3].interpolations[0]');
    const intp3 = _.get(matches, '[5].interpolations[0]');
    expect(intp).to.have.property("value");
    expect(intp).to.have.property("rawValue");
    expect(intp.rawValue).to.be.equals("{{for: a, bar: b}}");
    expect(intp.value).to.be.equals("for: a, bar: b");
    expect(intp2.rawValue).to.be.equals("{{foo, bar}}");
    expect(intp2.value).to.be.equals("foo, bar");
    expect(intp3.rawValue).to.be.equals("{{...obj1, ...obj2, e: 5}}");
    expect(intp3.value).to.be.equals("...obj1, ...obj2, e: 5");
  })

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

  // #12 WXAttributeInterpolation count
  it("can parse WXAttributeInterpolation - count correct", () => {
    const ast = parse(`
      <view class="a-{{b}}" style="color: {{color}};">
        {{i}}-{{j}}
      </view>
    `);
    expect(ast.errors).to.be.lengthOf(0);
    const matches = esquery(ast, "WXInterpolation");
    expect(matches).to.be.lengthOf(4);
    const matches2 = esquery(ast, "WXAttributeInterpolation");
    expect(matches2).to.be.lengthOf(2);
  })

});
