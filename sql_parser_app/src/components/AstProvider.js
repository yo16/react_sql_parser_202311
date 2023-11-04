import React, { createContext, useState, useContext } from "react";

const AstContext = createContext();

export default function AstProvider({ children }) {
    const [ast, setAst] = useState(1);

    return (
        <AstContext.Provider value={{ ast, setAst }}>
            { children }
        </AstContext.Provider>
    );
}
