import BwsSizeBase from "./BwsSizeBase.js";
import {SIZE_DEF} from "./BwsConst.js";

export default class BwsColumn extends BwsSizeBase {
    constructor(boxColumn){
        super();

        this.columnName = boxColumn.columnName;
        this.columnNameShort = adjustLongText(boxColumn.columnName);
        this.sourceColumns = [...boxColumn.sourceColumns];
        //console.log("sourceColumns");
        //console.log(this.sourceColumns.length>0 ? "-- " + this.sourceColumns[0].table + "//"+this.sourceColumns[0].column: undefined);
        this.columnType = undefined;
        
        this.selected = false;
    }
    get width(){
        return SIZE_DEF.TABLE_WIDTH - SIZE_DEF.TABLE_PADDING*2;
    }
    get height(){
        return SIZE_DEF.TABLE_COLUMN_HEIGHT;
    }

    getSourceColumns(tableOnly=false){
        // [{table, column, left:{x,y}, right:{x,y}}]
        let ret = [];
        if(tableOnly){
            // tableOnlyの場合は、table名の配列のみ
            // どうせあとで重複削除するかもなので、ここでは重複削除しない
            //ret = Array.from(new Set(this.sourceColumns.map(tc => tc.table)));
            ret = this.sourceColumns.map(tc => tc.table);
        }else{
            ret = this.sourceColumns.map(c=>{
                return {
                    table: c.table,
                    column: c.column,
                };
            });
        }

        return ret;
    }
};

export function adjustLongText(text){
    if(text){
        if( text.length > SIZE_DEF.TABLE_CHAR_MAX_LENGTH ){
            return text.substring(0, SIZE_DEF.TABLE_CHAR_MAX_LENGTH) + "...";
        }
    }
    return text;
};
