import BwsSizeBase from "./BwsSizeBase.js";
import BwsTable from "./BwsTable.js";
import {SIZE_DEF} from "./BwsConst.js";


export default class BwsSqlFile extends BwsSizeBase {
    constructor(boxSqlFile){
        super();

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
        this._width = (maxOrderIdx+1) * (SIZE_DEF.TABLE_WIDTH + SIZE_DEF.TABLE_MARGIN.x*2);
        this._height = Math.max(...tableHeights);

        // テーブル、列の名前から位置を取得するマップを作成
        this.posMap = {};
        this.tables.forEach(t => {
            // テーブル名
            this.posMap[joinTableColumn(t.title.text, null)] = {
                isTable: true,
                left: {
                    x: t.title.leftMiddle.x,
                    y: t.title.leftMiddle.y,
                },
                right: {
                    x: t.title.rightMiddle.x,
                    y: t.title.rightMiddle.y,
                },
            };

            // テーブル名+列名
            t.columns.forEach(c => {
                this.posMap[joinTableColumn(t.title.text, c.columnName)] = {
                    isTable: false,
                    left: {
                        x: c.leftMiddle.x,
                        y: c.leftMiddle.y,
                    },
                    right: {
                        x: c.rightMiddle.x,
                        y: c.rightMiddle.y,
                    },
                };
            });
        });
    }
    get width(){
        return this._width;
    }
    get height(){
        return this._height;
    }

    getAllConnections(){
        let conns = [].concat(...this.tables.map(t => {
            // １つのテーブルの元になっているソース(tables, columns)を得る
            let tcSources = t.getSourceDests();

            // tablesより
            let sourceTables = []
            tcSources.tables.forEach(t1 => {
                if (t1.source.table) {
                    sourceTables.push({
                        isTable: true,
                        useColumn: true,
                        source: this.posMap[joinTableColumn(t1.source.table, null)].right,
                        dest: this.posMap[joinTableColumn(t1.dest.table, null)].left,
                    });
                }
            });

            // tablesNoColumnより
            let sourceTables2 = [];
            tcSources.tablesNoColumn.forEach(t1 => {
                if (t1.source.table) {
                    sourceTables2.push({
                        isTable: true,
                        useColumn: false,
                        source: this.posMap[joinTableColumn(t1.source.table, null)].right,
                        dest: this.posMap[joinTableColumn(t1.dest.table, null)].left,
                    });
                }
            });


            // columnsより
            let sourceTableColumns = [];
            tcSources.columns.forEach(c1 => {
                if (c1.source.table) {  // 一番おおもとのテーブルは、元テーブルがnullになっている
                    sourceTableColumns.push(
                        {
                            isTable: false,
                            useColumn: true,
                            source: this.posMap[joinTableColumn(c1.source.table, c1.source.column)].right,
                            dest: this.posMap[joinTableColumn(c1.dest.table, c1.dest.column)].left,
                        }
                    )
                }
            })

            return sourceTables.concat(sourceTables2, sourceTableColumns);
        }));

        return conns;
    }
};

function joinTableColumn(t,c){
    let t1 = (t) ? t: "null";
    let c1 = (c) ? c: "null";
    return t1 + "//" + c1;
}
