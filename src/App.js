import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

const hasDuplicates = (array) => new Set(array).size !== array.length;

const Obj = {
  fnArr: [
    {
      startOuter: `function outerFunction(){`,
      outerBody: `  
      // outerFunction body will be here....
      `,
      nestedStart: `function innerFunction(){`,
      nestedBody: `   
        // innerFunction body will be here....
      `,
      nestedEnd: `  }//end of innerFunction function `,

      nestedFnCall: `
      innerFunction();`,

      endOuter: `
    }//end of outerFunction function 
      `
    },
    {
      startOuter: `function outerFunctionBD(){`,
      outerBody: `  
        // outerFunction body will be here....
        `,
      endOuter: `}//end of outerFunction function outerFunctionBD
      `
    }
  ],
  disabledFnKeys: ["startOuter", "nestedStart", "nestedEnd", "endOuter"],
  rules: { fnNames: ["abcOuter", "cbaOuter"] } // for preventing same name fnc
};

const preDefinedFunctions = (Obj) => {
  let initOnLoadFns = ``;
  for (let i = 0; i < Obj.fnArr.length; i++) {
    for (const obj in Obj.fnArr[i]) {
      initOnLoadFns +=
        `
      ` + `${Obj.fnArr[i][obj]}`;
    }
  }
  return initOnLoadFns;
};

const disabledFnArrCre = (Obj) => {
  let disabledOnLoadFns = [];
  for (let i = 0; i < Obj.fnArr.length; i++) {
    for (const obj in Obj.fnArr[i]) {
      //console.log({ obj });
      Obj.disabledFnKeys.find((el) => {
        if (el === obj) {
          disabledOnLoadFns.push(Obj.fnArr[i][obj]);
        }
      });
    }
  }
  return disabledOnLoadFns;
};

const disabledFnArray = disabledFnArrCre(Obj);
const intialCode = preDefinedFunctions(Obj);

function App() {
  const qvalueRef = useRef(intialCode);
  const [qvalue, setQValue] = useState(intialCode);

  function handleEditorChange(value, event) {
    /****** */
    let result = value.split(/\r?\n/);
    result = result.filter((element) => element.trim().startsWith("function"));
    result = result.map((element) => element.trim());
    console.log({ result });
    if (hasDuplicates(result)) {
      setQValue(null);
      setQValue((prev) => qvalueRef.current);
      return;
    }
    /**** */

    for (let i = 0; i < disabledFnArray.length; i++) {
      if (value.includes(disabledFnArray[i]) === false) {
        setQValue(null);
        setQValue((prev) => qvalueRef.current);
        return;
      }
    }

    setQValue(value);
    qvalueRef.current = value;
  }
  return (
    <>
      {qvalue ? (
        <Editor
          height="90vh"
          onChange={handleEditorChange}
          defaultLanguage="javascript"
          defaultValue={qvalue}
          qvalueRef={qvalueRef}
        />
      ) : null}
    </>
  );
}

export default App;
