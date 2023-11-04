import React, { createContext, useState } from "react";

import ParsedSql from "./ParsedSql.js";

const AstContext = createContext();

export default function AstProvider({ query, children }) {
    const [ast, setAst] = useState("");
    const setQuery = (query) => {
        setAst(ParsedSql(query));
    }

    return (
        <AstContext.Provider value={{ ast, setQuery }}>
            { children }
        </AstContext.Provider>
    );
}
