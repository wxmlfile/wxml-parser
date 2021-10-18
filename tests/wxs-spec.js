const { expect } = require("chai");
const _ = require("lodash");

const { parse } = require("../lib");
const { walkAstCountType } = require("./utils");

describe('WXS Test Suite', () => {
  it("should allow set wxs as sub wxml node", () => {
    const ast = parse(`
     <app>
       <wxs module="util" src="../../util.wxs"></wxs>
       <wxs module="func" src="../../func.wxs" />
       <sub>
        <wxs module="sub" src="../../sub.wxs"/>
       </sub>
       <wxs module="convert">
         module.exports = { name: "yunlei" }
       </wxs>
     </app>
    `);
    expect(walkAstCountType(ast, 'WXScript')).to.equals(4);
    expect(ast.errors.length).to.equals(0);
  });

  it("should allow set wxs as top-level wxml node", () => {
    const ast = parse(`
      <wxs module="util" src="../../util.wxs"></wxs>
      <wxs module="func" src="../../func.wxs" />
      <wxs module="func" src="../../func.wxs"/>
      <wxs module="convert">
        module.exports = { name: "yunlei" }
      </wxs>
      <popup></popup>
    `)
    expect(ast.errors.length).to.equals(0);
  });

  it("parse correct wxs node count", () => {
    const ast = parse(`
      <page></page>
      <wxs module="util" src="../../util.wxs"></wxs>
      <wxs module="func" src="../../func.wxs" />
      <wxs module="func" src="../../func.wxs"/>
      <wxs module="convert">
        module.exports = { name: "yunlei" }
      </wxs>
    `)
    const wxsNodes = _.filter(_.get(ast, "body") || [], node => node.type === "WXScript");
    expect(wxsNodes.length).to.equals(4);
  });

  it("inline wxs can use characters of [></]", () => {
    const ast = parse(`
      <wxs module="convert">
        // gt/lt in comment > <, even a tag </wx> 
        // <wxs also ok
        function compare (a, b) {
           return a > b;
        }
        module.exports = { compare: compare }
      </wxs>
    `)
    expect(ast.errors.length).to.equals(0)
  })

  it("not allow write </wxs> in wxs inline js content", () => {
    const ast = parse(`
      <wxs module="convert">
        // </wxs>
        function compare (a, b) {
          return a > b;
        }
        module.exports = { compare: compare }
      </wxs>
    `)
    expect(ast.errors.length).to.gt(0)
  });

})