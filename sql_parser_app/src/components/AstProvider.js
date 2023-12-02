import React, { createContext, useState, useContext } from "react";

import ParsedSql from "./ParsedSql.js";
//import CalcBoxPos from "./calcBox/CalcBoxPos.js";
import BoxSqlFile from "./Box/BoxSqlFile.js";
import BwsSqlFile from "./BoxWithSize/BwsSqlFile.js";

const AstContext = createContext();
export const useAst = () => useContext(AstContext);

export default function AstProvider({ children }) {
    // 複数のASTを持つ
    const [ fileDefs, setFileDefs ] = useState([]);

    const addQuery = (fileName, query) => {
        const ast = ParsedSql({query});
        // いったんすべての情報を読み込む
        const rawBoxSqlFile = new BoxSqlFile(ast);
        // 読み込んだ情報をもとにサイズを決定する
        const bwsSqlFile = new BwsSqlFile(rawBoxSqlFile);

        setFileDefs(
            [
                ...fileDefs,
                {
                    fileName,
                    ast: ast,
                    query: query,
                    rawBox: rawBoxSqlFile,
                    bwsSqlFile: bwsSqlFile,
                }
            ]
        );
    }

    return (
        <AstContext.Provider value={{ fileDefs, addQuery }}>
            { children }
        </AstContext.Provider>
    );
}
