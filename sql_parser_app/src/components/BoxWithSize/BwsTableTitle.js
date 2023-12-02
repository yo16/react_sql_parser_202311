import {SIZE_DEF} from "./BoxConst.js";
import {adjustLongText} from "./BwsColumn.js";

export default class BwsTableTitle{
    constructor(boxTable){
        this._x = 0;
        this._y = 0;
        this.text = boxTable.tableName;
        this.textShort = adjustLongText(boxTable.tableName);
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
        return SIZE_DEF.TABLE_WIDTH - SIZE_DEF.TABLE_PADDING * 2;
    }
    get height(){
        return SIZE_DEF.TABLE_TITLE_HEIGHT;
    }
}
