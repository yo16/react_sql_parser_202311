
export default class BoxColumn {
    constructor(columnAst, tableMap={}, execteParse=true){
        this.ast = columnAst;
        this.as = columnAst.expr.as;
        this.columnName = undefined;
        this.sourceColumns = [];
        this.columnType = undefined;

        if (execteParse){
            // parseして属性へ設定する
            this.parseColumn(columnAst, tableMap);
        }
    }

    get name(){
        return this.columnName;
    }

    parseColumn(astC, tableMap){
        this.columnType = astC.expr.type;
        // 対応済のtypeを確認しておく
        const supportedTypes = ["column_ref", "function", "cast"];
        console.assert(supportedTypes.indexOf(this.columnType)>=0, `Unknown Column Type. [${this.columnType}]`);
        
        if (this.columnType === "column_ref"){
            this.columnName = astC.expr.as ? astC.as : astC.expr.column;
            this.sourceColumns = [{
                column: astC.expr.column,
                table: tableMap[astC.expr.table],
            }];

        } else if (this.columnType === "function"){
            this.columnName = astC.as;

            // astC.args.valueに、未知のものがあったらassert
            if (astC.expr.args.value.filter(v => ["column_ref", "number"].indexOf(v.type)>=0).length
                !== astC.expr.args.value.length){
                // 未知のものがあってfilterされたらassert
                console.error(`Unknown value type! ${astC.expr.args.value}`);
            }

            // numberはlineageには不要なので除外する
            const useValues = astC.expr.args.value.filter(v => v.type !== "number");
            this.sourceColumns = useValues.map(v => {return {column: v.column, table: tableMap[v.table]};});

        } else if (this.columnType === "cast"){
            this.columnName = astC.as;
            this.sourceColumns = [{
                column: astC.expr.column,
                table: tableMap[astC.expr.table],
            }];
        
        // } else if 値を固定で指定しているパターン   もあるはず

        } else {
            console.assert(false, `Unkown column type! [${this.columnType}].`);
        }
    }

    // このBoxColumnの元となるテーブルと列リストを返す
    getSourceTableColumn(){
        return this.sourceColumns;
    }

}
