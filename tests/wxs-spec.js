const { expect } = require("chai");
const _ = require("lodash");
const esquery = require("esquery");

const { parse } = require("../lib");

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
    const matchs = esquery(ast, "WXScript");
    expect(matchs).to.be.lengthOf(4);
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
    const matchs = esquery(ast, "WXScript");
    expect(matchs).to.be.lengthOf(4);
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
    expect(ast.errors.length).to.be.equals(0)
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
    expect(ast.errors.length).to.be.gt(0)
  });

  it("allow whitespace in wxs end tag </wxs   > or </  wxs >  ", () => {
    const ast = parse(`
      <wxs module="xxxx" >  </wxs>
      <wxs module="convert">
        function compare (a, b) {
          return a > b;
        }
        module.exports = { compare: compare }
      </wxs    
      
      >
      <wxs module="xxxx" >  090</ wxs   > 
      <wxs module="xxxx" >  090</ wxs> 
    `)

    expect(ast.errors.length).to.be.equals(0)
    const matchs = esquery(ast, "WXScript");
    expect(matchs).to.be.lengthOf(4);
  });

  it("empty non-selfClosing wxs tag", () => {
    const ast = parse(`
      <wxs></wxs>
      <wxs> </wxs>
      <wxs>
      
      </wxs>
    `)

    expect(ast.errors.length).to.be.equals(0)
    const matchs = esquery(ast, "WXScript");
    expect(matchs[0].value.replace(/( |\t|\n|\r\n)+/, "")).to.be.equals("");
    expect(matchs[1].value.replace(/( |\t|\n|\r\n)+/, "")).to.be.equals("");
    expect(matchs[2].value.replace(/( |\t|\n|\r\n)+/, "")).to.be.equals("");
  });

  it("WXSxript node should contain `name` property", () => {
    const ast = parse(`
      <wxs> var s = 22; </wxs>
    `)

    expect(ast.errors.length).to.be.equals(0);
    const matchs = esquery(ast, "WXScript");
    expect(matchs[0].name).to.be.equals("wxs");
  });

})
