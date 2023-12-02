import BwsColumn from "./BwsColumn.js";
import BwsTableTitle from "./BwsTableTitle.js";
import {SIZE_DEF} from "./BoxConst.js";

export default class BwsTable {
    constructor(boxTable){
        this._x = 0;
        this._y = 0;

        this.title = new BwsTableTitle(boxTable);
        this.columns = boxTable.columns.map(boxColumn => {
            return new BwsColumn(boxColumn);
        });
    }

    set x(x){
        this._x = x;

        this.title.x = x + SIZE_DEF.TABLE_PADDING;
        this.columns.forEach(c => {
            c.x = x + SIZE_DEF.TABLE_PADDING;
        });
    }
    set y(y){
        this._y = y;

        this.title.y = y + SIZE_DEF.TABLE_PADDING;
        this.columns.forEach((c, i) => {
            c.y = y + SIZE_DEF.TABLE_PADDING * 2 + SIZE_DEF.TABLE_TITLE_HEIGHT
                + i * SIZE_DEF.TABLE_COLUMN_HEIGHT;
        });
    }
    get x(){return this._x;}
    get y(){return this._y;}

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
};
