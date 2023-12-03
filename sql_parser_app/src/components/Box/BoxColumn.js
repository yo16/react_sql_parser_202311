
// {table, column} の配列を返す
const extractFromExprFn = {
    alter           : extractFromAlter,
    aggr_func       : extractFromAggrFunc,
    any_value       : extractFromAnyValue,
    window_func     : extractFromWindowFunc,
    "array"         : extractFromArray,
    assign          : extractFromAssign,
    binary_expr     : extractFromBinaryExpr,
    case            : extractFromCase,
    cast            : extractFromCast,
    column_ref      : extractFromColumn_ref,
    datatype        : extractFromDatatype,
    extract         : extractFromExtract,
    flatten         : extractFromFlatten,
    fulltext_search : extractFromFulltextSearch,
    function        : extractFromFunction,
    insert          : extractFromInsert,
    interval        : extractFromInterval,
    show            : extractFromShow,
    struct          : extractFromStruct,
    tables          : extractFromTables,
    unnest          : extractFromUnnest,
    "window"        : extractFromWindow,
};

export default class BoxColumn {
    constructor(columnAst, tableMap={}, execteParse=true){
        this.ast = columnAst;
        this.columnName = undefined;
        this.sourceColumns = [];
        this.columnType = undefined;

        if (execteParse){
            // parseして属性へ設定する
            this.parseColumn(columnAst, tableMap);
        }else{
            this.columnName = columnAst.name;
            this.sourceColumns = [{table:null, column:columnAst.name}];
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
        
        let exprResult = extractFromExprFn[this.columnType](astC.expr, tableMap);
        this.columnName = astC.as ? astC.as : (exprResult.length>0)? exprResult[0].column: null;
        //this.sourceColumns = [...this.sourceColumns, exprResult];
        this.sourceColumns = exprResult;
    }

    // このBoxColumnの元となるテーブルと列リストを返す
    getSourceTableColumn(){
        // extractFromAlter の戻り値
        // [{table, column}]
        return this.sourceColumns;
    }

}


// extractFromExprFnの関数群
function extractFromAlter(expr, tableMap){return [];}
function extractFromAggrFunc(expr, tableMap){return [];}
function extractFromAnyValue(expr, tableMap){return [];}
function extractFromWindowFunc(expr, tableMap){return [];}
function extractFromArray(expr, tableMap){return [];}
function extractFromAssign(expr, tableMap){return [];}
function extractFromBinaryExpr(expr, tableMap){return [];}
function extractFromCase(expr, tableMap){return [];}
function extractFromCast(expr, tableMap){
    // cast前の情報を引き継ぐ
    return extractFromExprFn[expr.expr.type](expr.expr, tableMap);
}
function extractFromColumn_ref(expr, tableMap){
    return [{table: tableMap[expr.table], column:expr.column}];
}
function extractFromDatatype(expr, tableMap){return [];}
function extractFromExtract(expr, tableMap){return [];}
function extractFromFlatten(expr, tableMap){return [];}
function extractFromFulltextSearch(expr, tableMap){return [];}
function extractFromFunction(expr, tableMap){return [];}
function extractFromInsert(expr, tableMap){return [];}
function extractFromInterval(expr, tableMap){return [];}
function extractFromShow(expr, tableMap){return [];}
function extractFromStruct(expr, tableMap){return [];}
function extractFromTables(expr, tableMap){return [];}
function extractFromUnnest(expr, tableMap){return [];}
function extractFromWindow(expr, tableMap){return [];}
