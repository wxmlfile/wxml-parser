## @wxml/parser

[![npm version](https://img.shields.io/npm/v/@wxml/parser)](https://www.npmjs.com/package/@wxml/parser)
[![CI Status](https://github.com/wxmlfile/wxml-parser/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/wxmlfile/wxml-parser/actions/workflows/ci.yml?query=branch%3Amain)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/wxmlfile/wxml-parser/pulls)
[![Twitter Follow Author](https://img.shields.io/twitter/follow/s_chenlei)](https://twitter.com/chenleidev)

A fast and tolerant wxml parser

## Installation

```bash
## npm
$ npm install @wxml/parser --save-dev
## pnpm
$ pnpm add -D @wxml/parser
## yarn
$ yarn add @wxml/parser --dev
## cnpm (for china user)
$ cnpm install @wxml/parser --save-dev
```

## AST docs
Wanna try high level usage, check our [`AST` docs](https://github.com/wxmlfile/wxml-parser/blob/main/docs/ast.md) first !

## AST explorer
<a href="https://wxmlfile.github.io/explorer">
  <img src="https://raw.githubusercontent.com/wxmlfile/explorer/main/assets/wxml-explorer.png">
</a>

## Basic Usage

```javascript
const { parse } = require("@wxml/parser");
const AST = parse(`
  <view class="search-contianer">
    <view class="search" style="height:{{navHeight}}px;padding-top:{{navTop}}px">
      <view class="search-title" src="../../images/actLogo/ytlogo.png">
        {{mallName}}
      </view>
      <input
        placeholder-class="search-placeholder"
        type="text"
        placeholder="please enter keyword for search"
        disabled
        value="{{name}}"
        bindinput="bindinput"
        bindtap="goSearch">
      </input>
    </view>
  </view>
`);
console.log("AST structure: ", AST);
```

## Try Play Online

<a href="https://npm.runkit.com/%40wxml%2Fparser"><img src="https://funimg.pddpic.com/mobile_piggy/1b725d0e-5a50-4adc-adbd-793f9912cfd8.svg" width="100px" /></a>

Open [RunKit](https://npm.runkit.com/%40wxml%2Fparser) , and then happy coding !
