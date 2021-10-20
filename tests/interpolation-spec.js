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

  // #2 termplate attr
  // <view id="item-{{id}}"> </view>

  // #3 condition 
  // <view wx:if="{{condition}}"> </view>

  // #4 keyword
  // <checkbox checked="{{false}}"> </checkbox>

  // #5 Ternary operation
  // <view hidden="{{flag ? true : false}}"> Hidden </view>

  // #6 math compute
  // <view> {{a + b}} + {{c}} + d </view>

  // #7 logic check
  // <view wx:if="{{length > 5}}"> </view>
  // <view wx:if="{{length < 5}}"> </view>

  // #8 string compute
  // <view>{{"hello<></>}}{{}}{{" + name}}</view>

  // #9 path compute
  // <view>{{object.key}} {{array[0]}}</view>

  // #10 combine - array
  // <view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>

  // #11 combine - object
  // <template is="objectCombine" data="{{for: a, bar: b}}"></template>
  // <template is="objectCombine" data="{{foo, bar}}"></template>
  // <template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>
  // <view wx:for="{{[1,2,3]}} ">

});