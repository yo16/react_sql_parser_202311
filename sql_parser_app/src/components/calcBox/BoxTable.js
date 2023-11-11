
export default class BoxTable {
    constructor(tableName){
        this.tableName = tableName;
        this.columns = [];
        this.isDefined = false;
    }

    // astのcolumn要素から、列を登録する
    addColumn(astC, columnOnly=false){
        let pushedColumnInfo = null;

        if (columnOnly){
            // 列名だけの指定の場合(astの形式ではない)
            pushedColumnInfo = {
                column: astC.column,
                sourceColumns: [],
                type: "EMPTY",
            };

        } else if (astC.expr.type==="column_ref"){
            pushedColumnInfo = {
                column: astC.as ? astC.as : astC.expr.column,
                sourceColumns: [{
                    column: astC.expr.column,
                    table: astC.expr.table,
                }],
                type: "column_ref",
            };

        } else if (astC.expr.type==="function"){
            // astC.args.valueに、未知のものがあったらassert
            if (astC.expr.args.value.filter(v => ["column_ref", "number"].indexOf(v.type)>=0).length
                !== astC.expr.args.value.length){
                // 未知のものがあってfilterされたらassert
                console.log(astC.expr.args.value);
                console.assert(false, "Unknown value type!");
            }

            // numberはlineageには不要なので除外する
            const useValues = astC.expr.args.value.filter(v => v.type !== "number");

            // 存在しない場合はasのみで他は空になる
            pushedColumnInfo = {
                column: astC.as,
                sourceColumns: useValues.map(v => {return {column: v.column, table: v.table};}), 
                type: "function",
            };

        } else if (astC.expr.type==="cast"){
            pushedColumnInfo = {
                column: astC.as,
                sourceColumns: [{
                    column: astC.expr.column,
                    table: astC.expr.table,
                }],
                type: "cast",
            };
        
        // } else if 値を固定で指定しているパターン   もあるはず

        } else {
            console.assert(false, `Unkown column type! [${astC.expr.type}].`);
        }

        // 登録
        if (pushedColumnInfo){
            // 存在していたら上書き
            this.columns = this.columns.filter(
                cObj => cObj.column !== pushedColumnInfo.column
            );
            this.columns.push(
                pushedColumnInfo
            );
        }

        // 参照したテーブルと列を返す
        return pushedColumnInfo;
    }
}

