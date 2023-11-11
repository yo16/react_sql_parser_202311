import BoxTable from "./BoxTable.js";

export default class BoxSqlFile {
    constructor(ast){
        this.tableObjs = [];
        this.tableName2Idx = {};        // 名前からtableObjsなどのインデックスへ変換するdict

        console.log("BoxSqlFile");
        console.log({ast});
        
        // テーブル名なしに項目を受け入れるためのテーブルを登録
        this.pushTable(null);

        // このastから読み解ける情報を登録
        this.registAst(ast);
    }

    registAst(ast, name="__select__"){
        // ast.typeが"select"になるまでvaluesを探す
        let curAst = ast;
        while (curAst.type !== "select"){
            curAst = curAst.values;
        }
        // curAstがselectになっている
        //console.log({curAst});

        // テーブルを登録する
        // 自分(select)と、fromと、withがテーブル名
        console.log(`--------${name}------`);
        this.pushTable(name);
        curAst.from.forEach(f => {
            this.pushTable(f.table);
        });
        if (curAst.with){
            curAst.with.forEach(w => {
                this.pushTable(w.name.value);
            });
        }
        
        // テーブルの列を登録する
        // 自分(select)
        let curIdx = this.tableName2Idx[name];
        let curTableObj = this.tableObjs[curIdx];
        curTableObj.isDefined = true;       // このSQLファイルでselect文が定義されているフラグ
        curAst.columns.forEach(c => {
            curTableObj.addColumn(c);
        });
        // from
        //   元のテーブルは登録しないのでスキップ
        // with
        if (curAst.with){
            curAst.with.forEach(w => {
                this.registAst(w.stmt.ast, w.name.value);
            });
        }

        //console.log({curTableObj});
    }

    pushTable(tableName){
        // すでに存在していたら何もしないで抜ける
        if (tableName in this.tableName2Idx){
            //console.assert(false, `Table [${tableName}] is already exists!`);
            return;
        }

        // 変換dictを作る
        this.tableName2Idx[tableName] = this.tableObjs.length;
        // objectを作る
        this.tableObjs.push(new BoxTable(tableName));
        //console.log(`Table added! ${tableName}`)
    }

    addTable(tableName){

    }
}

