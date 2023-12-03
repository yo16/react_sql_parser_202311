import BwsSizeBase from "./BwsSizeBase.js";
import BwsColumn from "./BwsColumn.js";
import BwsTableTitle from "./BwsTableTitle.js";
import {SIZE_DEF} from "./BwsConst.js";

export default class BwsTable extends BwsSizeBase {
    constructor(boxTable){
        super();

        this.title = new BwsTableTitle(boxTable);
        this.columns = boxTable.columns.map(boxColumn => {
            return new BwsColumn(boxColumn);
        });

        // columnで使うものだけでなく、where句での参照も含む
        this.sourceTableNames = boxTable.sourceTableNames;
    }

    set x(x){
        super.x = x;

        this.title.x = x + SIZE_DEF.TABLE_PADDING;
        this.columns.forEach(c => {
            c.x = x + SIZE_DEF.TABLE_PADDING;
        });
    }
    set y(y){
        super.y = y;

        this.title.y = y + SIZE_DEF.TABLE_PADDING;
        this.columns.forEach((c, i) => {
            c.y = y + SIZE_DEF.TABLE_PADDING * 2 + SIZE_DEF.TABLE_TITLE_HEIGHT
                + i * SIZE_DEF.TABLE_COLUMN_HEIGHT;
        });
    }
    // なぜかgetterが継承されないようなので直接呼び出す
    get x(){
        return super.x;
    }
    get y(){
        return super.y;
    }

    get height(){
        // テーブルの構造
        // - TABLE_PADDING
        // - TABLE_TITLE_HEIGHT
        // - TABLE_PADDING
        // - TABLE_COLUMN_HEIGHT * "column num"
        // - TABLE_PADDING
        return SIZE_DEF.TABLE_PADDING * 3 +
            SIZE_DEF.TABLE_TITLE_HEIGHT + 
            SIZE_DEF.TABLE_COLUMN_HEIGHT * this.columns.length;
    }

    get width(){
        return SIZE_DEF.TABLE_WIDTH;
    }
    
    getSourceDests(){
        // テーブル(Columnベース)
        let tableNameSources = Array.from(new Set([].concat(...this.columns.map(c => c.getSourceColumns(true)))));
        let tableSources = tableNameSources.map(t => {
            return {
                source: {
                    table: t,
                },
                dest: {
                    table: this.title.text,
                },
            };
        });
        // テーブル(BoxTableのテーブルベース)
        // Columnベースに存在しないものだけ
        let tableNameSources2 = this.sourceTableNames.filter(t => tableNameSources.indexOf(t)<0);
        let tableSources2 = tableNameSources2.map(t => {
            return {
                source: {
                    table: t,
                },
                dest: {
                    table: this.title.text,
                },
            };
        });
        
        // 列
        let columnSources = [].concat(...this.columns.map(c => {
            let columnInfo = c.getSourceColumns();
            return columnInfo.map(cinfo => {
                return {
                    source: {
                        table: cinfo.table,
                        column: cinfo.column,
                    },
                    dest: {
                        table: this.title.text,
                        column: c.columnName,
                    },
                };
            });
        }));

        return {
            tables: tableSources,
            tablesNoColumn: tableSources2,
            columns: columnSources,
        }
    }
};
