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

    const selectColumn = (tableName, columnName) => {
        // すべてのbswSqlFileから、tableName.columnNameを探してselectedの状態にする、それ以外の要素も選択解除するため全更新・・・。
        fileDefs.forEach(d => {
            d.bwsSqlFile.tables.forEach(t => {
                t.columns.forEach(c => {
                    c.selected = (t.title.text===tableName)&&(c.columnName===columnName);
                });
            });
        });
        setFileDefs([...fileDefs]);     // 全部の要素を書き換えてるから、イケてない・・・objectだから仕方ないのか。配列にすればよかったか。
    }

    return (
        <AstContext.Provider value={{ fileDefs, addQuery, selectColumn }}>
            { children }
        </AstContext.Provider>
    );
}
