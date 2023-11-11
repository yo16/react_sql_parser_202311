// QueryのAstを読んで位置を返す
/*
SQL
    Table
        Title
        Columns
            Column

box : {
    top,
    bottom,
    left,
    right,
    width,
    height,
    text,
}
*/

import BoxSqlFile from "./BoxSqlFile.js";


export default function CalBoxPos(oneAst) {
    // astを解釈して、変数に入れる
    // 一度クラスで整理してから、dict化する

    // クラス化
    let bsf = new BoxSqlFile(oneAst);
    console.log({bsf});

    // dict化
    


    return {a:1};
}
