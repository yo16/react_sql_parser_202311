import React, { createContext, useState, useContext } from "react";
import {v4} from "uuid";

import ParsedSql from "./ParsedSql.js";

const AstContext = createContext();
export const useAst = () => useContext(AstContext);

export default function AstProvider({ children }) {
    // 複数のASTを持つ
    const [ asts, setAsts ] = useState([]);

    const addQuery = (fileName, query) => {
        setAsts(
            [
                ...asts,
                {
                    id: v4(),
                    fileName,
                    ast:ParsedSql(query)
                }
            ]
        );
    }

    return (
        <AstContext.Provider value={{ asts, addQuery }}>
            { children }
        </AstContext.Provider>
    );
}
