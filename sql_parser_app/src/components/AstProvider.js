import React, { createContext, useState, useContext } from "react";

import ParsedSql from "./ParsedSql.js";
import CalcBoxPos from "./calcBox/CalcBoxPos.js";

const AstContext = createContext();
export const useAst = () => useContext(AstContext);

export default function AstProvider({ children }) {
    // 複数のASTを持つ
    const [ fileDefs, setFileDefs ] = useState([]);

    const addQuery = (fileName, query) => {
        const ast = ParsedSql({query});
        setFileDefs(
            [
                ...fileDefs,
                {
                    fileName,
                    ast: ast,
                    query: query,
                    box: CalcBoxPos(ast)
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
