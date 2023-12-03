import {SIZE_DEF} from "./BwsConst.js";

// サイズを示す抽象クラス
// ただしJavaScriptには抽象クラスを表現する方法はない
export default class BwsSizeBase {
    constructor(){
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

    // 抽象メソッド(のつもり)
    get height(){
        return 0;
    }
    get width(){
        return 0;
    }

    get leftMiddle(){
        return {
            x: this._x,
            y: this._y + this.height/2,
        };
    }
    get rightMiddle(){
        return {
            x: this._x + this.width,
            y: this._y + this.height/2,
        }
    }
};
