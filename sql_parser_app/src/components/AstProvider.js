import React, { createContext, useState, useContext } from "react";

import ParsedSql from "./ParsedSql.js";

const AstContext = createContext();
export const useAst = () => useContext(AstContext);

export default function AstProvider({ children }) {
    // 複数のASTを持つ
    const [ asts, setAsts ] = useState("");

    const addQuery = (query) => {
        setAsts(ParsedSql(query));
    }

    return (
        <AstContext.Provider value={{ asts, addQuery }}>
            { children }
        </AstContext.Provider>
    );
}
