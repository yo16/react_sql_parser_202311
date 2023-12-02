import BwsTable from "./BwsTable.js";
import {SIZE_DEF} from "./BoxConst.js";


export default class BwsSqlFile {
    constructor(boxSqlFile){
        // BwsTableを全部定義
        this.tables = boxSqlFile.tableObjs.map(boxTable => {
            return new BwsTable(boxTable);
        });

        // テーブルの位置を決める
        let maxOrderIdx = Math.max(...boxSqlFile.tableOrder);
        let tableHeights = [...Array(maxOrderIdx+1)].map(_ => SIZE_DEF.FILE_TITLE_HEIGHT);
        for(let i=0; i<this.tables.length; i++){
            let curTblObj = this.tables[i];
            let curOrder = boxSqlFile.tableOrder[i];

            // 位置確定
            // curOrderは、一番右端が0で、左に向けてインクリメント
            curTblObj.x = (maxOrderIdx - curOrder) * (SIZE_DEF.TABLE_MARGIN.x*2 + SIZE_DEF.TABLE_WIDTH) + SIZE_DEF.TABLE_MARGIN.x;
            curTblObj.y = tableHeights[curOrder];
            
            // orderごとに、tableのheightを足していく
            tableHeights[curOrder] += curTblObj.height + SIZE_DEF.TABLE_MARGIN.y*2;
        }

        // SqlFileの幅と高さを決める
        this.width = (maxOrderIdx+1) * (SIZE_DEF.TABLE_WIDTH + SIZE_DEF.TABLE_MARGIN.x*2);
        this.height = Math.max(...tableHeights);

        this._x = 0;
        this._y = 0;
    }

    set x(x){
        this._x = x;
    }
    set y(y){
        this._y = y;
    }
    get x(){return this._x;}
    get y(){return this._y;}
};
