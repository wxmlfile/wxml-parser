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

## AST explorer (sxzz/ast-explorer)
<a href="https://ast.sxzz.moe/#eNqrVspRslIqr8jNUdJRKoAydQsSi4pTi4AiyUARIJUPpKprlWoBRA8NdQ==">
  <img src="https://private-user-images.githubusercontent.com/14012511/358136614-33dabd73-1cf2-40f2-b43f-1eae914a9eb1.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjM3MDI1NzYsIm5iZiI6MTcyMzcwMjI3NiwicGF0aCI6Ii8xNDAxMjUxMS8zNTgxMzY2MTQtMzNkYWJkNzMtMWNmMi00MGYyLWI0M2YtMWVhZTkxNGE5ZWIxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA4MTUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwODE1VDA2MTExNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTc2NzVjMzc2MDY1ZjUwMWFjZTRiYTg1MGE1OGYyNmRmOWNlNzQ3YjVjMTU4ZDU0YTc3ZmI0OTIxNmRhOGZkYmEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.OMx8g_UVWeUEH18fVvEFNP4_dGAR7z-uYK14f-rz2AI">
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
