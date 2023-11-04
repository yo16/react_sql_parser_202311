import React, { createContext, useState, useContext } from "react";

import ParsedSql from "./ParsedSql.js";

const AstContext = createContext();
export const useAst = () => useContext(AstContext);

export default function AstProvider({ children }) {
    const [ ast, setAst ] = useState("");

    const setQuery = (query) => {
        setAst(ParsedSql(query));
    }

    return (
        <AstContext.Provider value={{ ast, setQuery }}>
            { children }
        </AstContext.Provider>
    );
}
