// QueryのAstを読んで位置を返す
import {SIZE_DEF} from "./BoxConst.js";

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
    let box = getBox(bsf);

    return box;
}

function getBox(objBoxSqlFile){
    let retBox = null;

    // sqlFile
    retBox = {
        sqlFile: {
            width: getFileWidth(objBoxSqlFile),
            height: getFileHeight(objBoxSqlFile),
            tables: getTablesInfo(objBoxSqlFile),
        },
    };

    console.log(retBox);

    return retBox;
}

function getFileHeight(objBoxSqlFile){
    // tableOrderの順位は同じ列に来る
    // その列ごとのテーブルの合計の高さを求める
    // 一番高い列の高さを返す
    let maxOrderIdx = Math.max(...objBoxSqlFile.tableOrder);
    let tableHights = [...Array(maxOrderIdx+1)].map(_ => SIZE_DEF.FILE_TITLE_HEIGHT);
    
    objBoxSqlFile.tableObjs.forEach((to, i) => {
        tableHights[objBoxSqlFile.tableOrder[i]] +=
            getTableHeight(to) + 
            SIZE_DEF.TABLE_MARGIN.y*2;
    });
    console.log(tableHights);

    return Math.max(...tableHights);
}

// 高さを得る
function getTableHeight(objBoxTable){
    // テーブルの構造
    // - TABLE_PADDING
    // - TABLE_TITLE_HEIGHT
    // - TABLE_PADDING
    // - TABLE_COLUMN_HEIGHT * "column num"
    // - TABLE_PADDING
    return SIZE_DEF.TABLE_PADDING * 3 +
        SIZE_DEF.TABLE_TITLE_HEIGHT + 
        SIZE_DEF.TABLE_COLUMN_HEIGHT * objBoxTable.columns.length;
}

function getFileWidth(objBoxSqlFile){
    let maxOrderIdx = Math.max(...objBoxSqlFile.tableOrder);
    let tableColumnNum = maxOrderIdx + 1;

    return tableColumnNum * (SIZE_DEF.TABLE_WIDTH + SIZE_DEF.TABLE_MARGIN.x*2);
}

function getTablesInfo(objBoxSqlFile){
    let tableColumnNum = Math.max(...objBoxSqlFile.tableOrder) + 1;
    let tablePosY = [...Array(objBoxSqlFile.tableOrder.length + 1)].map(_=>0);
    return objBoxSqlFile.tableObjs.map((to,i)=>{
        let curTableOrder = objBoxSqlFile.tableOrder[i];
        // tableOrderは、一番右端が0で、左に向けてインクリメント
        let x = (tableColumnNum - curTableOrder - 1) * (SIZE_DEF.TABLE_MARGIN.x*2 + SIZE_DEF.TABLE_WIDTH) + SIZE_DEF.TABLE_MARGIN.x;
        let y = SIZE_DEF.FILE_TITLE_HEIGHT + tablePosY[curTableOrder] + SIZE_DEF.TABLE_MARGIN.y;
        let tableInfo = getTableInfo(to, x, y);
        let ret = tableInfo;

        // 作成するtableの分、yを加算更新する
        tablePosY[curTableOrder] += tableInfo.height + SIZE_DEF.TABLE_MARGIN.y*2;

        return ret;
    });
}

function getTableInfo(objBoxTable, x, y){
    let title_pos = {
        x: x + SIZE_DEF.TABLE_PADDING,
        y: y + SIZE_DEF.TABLE_PADDING,
        width: SIZE_DEF.TABLE_WIDTH - SIZE_DEF.TABLE_PADDING*2,
        height: SIZE_DEF.TABLE_TITLE_HEIGHT,
    };
    return {
        x: x,
        y: y,
        width: SIZE_DEF.TABLE_WIDTH,
        height: getTableHeight(objBoxTable),
        tableTitle: {
            ...title_pos,
            name: objBoxTable.name,
            nameDisplay: objBoxTable.name ?
                objBoxTable.name.substr(0,SIZE_DEF.INLINE_ELLIPSIS) + 
                    (objBoxTable.name.length > SIZE_DEF.INLINE_ELLIPSIS ? "...": ""):
                null,
        },
        columns: getColumnsInfo(
            objBoxTable,
            x,
            title_pos.y+title_pos.height + SIZE_DEF.TABLE_PADDING
        ),
    };
}

function getColumnsInfo(objBoxTable, x, y){
    return objBoxTable.columns.map((c, i) => {
        return {
            x: x + SIZE_DEF.TABLE_PADDING,
            y: y + i*SIZE_DEF.TABLE_COLUMN_HEIGHT,
            width: SIZE_DEF.TABLE_WIDTH - SIZE_DEF.TABLE_PADDING*2,
            height: SIZE_DEF.TABLE_COLUMN_HEIGHT,
            name: c.columnName,
        };
    })
}
