import {SIZE_DEF} from "./BoxConst.js";

export default class BwsColumn {
    constructor(boxColumn){
        this.columnName = boxColumn.columnName;
        this.columnNameShort = adjustLongText(boxColumn.columnName);
        this.sourceColumns = [];
        this.columnType = undefined;
        
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
    get textX(){return this._x + SIZE_DEF.TEXT_ADJUST_X;}
    get textY(){return this._y + SIZE_DEF.TEXT_ADJUST_Y;}
    get width(){
        return SIZE_DEF.TABLE_WIDTH - SIZE_DEF.TABLE_PADDING*2;
    }
    get height(){
        return SIZE_DEF.TABLE_COLUMN_HEIGHT;
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
