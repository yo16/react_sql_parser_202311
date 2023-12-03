import BwsSizeBase from "./BwsSizeBase.js";
import {adjustLongText} from "./BwsColumn.js";
import {SIZE_DEF} from "./BwsConst.js";

export default class BwsTableTitle extends BwsSizeBase {
    constructor(boxTable){
        super();
        
        this.text = boxTable.tableName;
        this.textShort = adjustLongText(boxTable.tableName);
    }

    get width(){
        return SIZE_DEF.TABLE_WIDTH - SIZE_DEF.TABLE_PADDING * 2;
    }
    get height(){
        return SIZE_DEF.TABLE_TITLE_HEIGHT;
    }
}
