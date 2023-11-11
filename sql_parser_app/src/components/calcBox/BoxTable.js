
export default class BoxSqlFile {
    constructor(tableName){
        this.tableName = tableName;
        this.columns = [];
        this.isDefined = false;
    }

    // astのcolumn要素から、列を登録する
    addColumn(astC){
        let pushedColumnInfo = null;
        if (astC.expr.type==="column_ref"){
            pushedColumnInfo = {
                column: astC.as ? astC.as : astC.expr.column,
                sourceColumn: [astC.expr.column],
                sourceTable: [astC.expr.table],
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
                sourceColumn: useValues.map(v => v.column), 
                sourceTable: useValues.map(v => v.table),
                type: "function",
            };

        } else if (astC.expr.type==="cast"){
            pushedColumnInfo = {
                column: astC.as,
                sourceColumn: [astC.expr.column],
                sourceTable: [astC.expr.table],
                type: "cast",
            };

        } else {
            console.assert(false, `Unkown column type! [${astC.expr.type}].`);
        }

        // 登録
        if (pushedColumnInfo){
            this.columns.push(pushedColumnInfo);
        }

        // 登録した情報を返す
        //return pushedColumnInfo;
    }
}

