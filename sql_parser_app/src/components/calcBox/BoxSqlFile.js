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
        console.debug("-- BoxSqlFile.registAst --");
        console.debug(`# TABLE ${name}`);
        this.pushTable(name);
        curAst.from.forEach(f => {
            this.pushTable(f.table);
        });
        if (curAst.with){
            curAst.with.forEach(w => {
                this.pushTable(w.name.value);
            });
        }
        
        // from
        // fromに書かれているテーブルは、存在は知っているが、詳細は知らない
        let fromTableMap = {};  // テーブルをリネームしている場合のマップ(as → table)
        curAst.from.forEach(f => {
            // テーブルを作るだけで列は作れないので、registAstでなくpushTableだけ
            this.pushTable(f.table);
            
            // as→tableマップに追加
            fromTableMap[f.as ? f.as: f.table] = f.table;
        })
        
        // テーブルの列を登録する
        // 自分に列を追加するとともに、fromテーブルにも存在しているので追加
        let curIdx = this.tableName2Idx[name];
        let curTableObj = this.tableObjs[curIdx];
        curTableObj.isDefined = true;       // このSQLファイルでselect文が定義されているフラグ
        curAst.columns.forEach(c => {
            console.debug("## COLUMNs")
            // 自分の列を追加する
            // この際に解析した、元情報を得る
            let addedColumnInfo = curTableObj.addColumn(c);

            // from
            addedColumnInfo.sourceColumns.forEach(c => {
                console.debug(`### ${c.column}`)
                let curFromTableIdx = this.tableName2Idx[fromTableMap[c.table]];
                let curFromTableObj = this.tableObjs[curFromTableIdx];
                if (c.table){
                    curFromTableObj.addColumn(c, true);
                }
            })

        });
        
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
}

