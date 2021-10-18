import { buildAst } from "./ast/build-ast";
import { parse } from "./cst";

// const { cst, tokenVector, lexErrors, parseErrors } = parse(`
// <!-- topline commnet -->
// <wxs module="priceUtil" >

//   var some_msg = "hello world"
//   module.exports = {
//     msg : some_msg
//   }
// </wxs>
// <wxs module="yunlei" src="xxxx" />
// <wxs module="empty wxs" src="xxxx" ></wxs>
// <page name="xxx" >
//   <wxs module="priceUtil" >

//     a < 3;
//     var some_msg = "hello world
//     module.exports = {
//       msg : some_msg
//     }
//   </wxs>
//   <wxs module="yunlei" src="xxxx" />
//   <wxs module="empty wxs" src="xxxx" ></wxs>
// </page>
// <template name="img">
//   <text>

//   你好 {{name}} </text>
//   <!-- yunlei comment -->
//   <view class="thumbWrapper">
//     <img
//     src="{{item.imageUrl}}"
//     width="450"
//       external-class="thumb {{item.hasSoldOut ? 'soldOut' : ''}}"/>
//     <img wx:if="{{item.hasSoldOut}}" src='goods_supplement.png' class='soldOutMask' width="303" />
//     <goods-tag
//       viewTypeMap="{{viewTypeMap}}"
//       wx:if="{{tags.activityDiffAndConfigCell}}"
//       tags="{{tags.activityDiffAndConfigCell.tagList}}"
//       type='imageLeftTop'/>
//   </view>
//   <!--
//       multi line comment
//   -->
// </template>
// zhizhiz
// `);

const { cst, tokenVector, lexErrors, parseErrors } = parse(`
<wxs module="ss">var stylesToStr = require("./style.wxs").stylesToStr;
var allStylesToStr = require("./style.wxs").allStylesToStr;
let x = 34;

function borderWrapperStyle(styles) {
  return stylesToStr(
    ['padding', 'fontSize', 'width', 'marginLeft'],
    styles
  );
}

function borderStyle(styles) {
  return stylesToStr(
    ['borderRadius', 'borderColor'],
    styles
  );
}

module.exports = {
  borderWrapperStyle: borderWrapperStyle,
  borderStyle: borderStyle,
  customStyle: allStylesToStr
};


<import src="text.wxml" />

<template name="Border">
<video />
<image />
<page /
<view
  v-if="xxx"
  class="borderWrapper external-classes"
  style="{{ss.borderWrapperStyle(styles)}};{{ss.customStyle(customStyles)}}"
>
  <view class="border" style="{{ss.borderStyle(styles)}}" />
  <template
    is="Text"
    data="{{ styles, customStyles, text, hasContainer: true }}"
  />
</view>
</template>
`);

const ast = buildAst(cst, tokenVector, lexErrors, parseErrors);

ast;
