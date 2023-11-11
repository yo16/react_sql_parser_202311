import BoxTable from "./BoxTable.js";

export default class BoxSqlFile {
    constructor(ast){
        this.tableObjs = [];
        this.tableName2Idx = {};        // 名前からtableObjsなどのインデックスへ変換するdict
        this.tableOrder = [];           // tableObjsの上流/下流の関係を示す 0が最下流

        console.log("BoxSqlFile");
        console.log({ast});
        
        // テーブル名なしに項目を受け入れるためのテーブルを登録
        this.addTable(null);

        // このastから読み解ける情報を登録
        this.parseAst(ast);
    }

    parseAst(ast, tableName="__select__"){
        console.debug("-- BoxSqlFile.registAst --");
        console.debug(`# TABLE ${tableName}`);

        // ast.typeが"select"になるまでvaluesを探す
        let curAst = ast;
        while (curAst.type !== "select"){
            curAst = curAst.values;
        }
        // curAstがselectになっている
        //console.log({curAst});

        // 自分自身をtableに登録
        this.addTable(tableName);
        
        // withから、その中の情報を登録
        if (curAst.with){
            curAst.with.forEach(w => {
                this.parseAst(w.stmt.ast, w.name.value);
            });
        }

        // fromから、参照テーブル(名だけ)を登録
        let fromTableMap = {};  // テーブルをリネームしている場合のマップ(as → table)
        curAst.from.forEach(f => {
            this.addTable(f.table);
            this.addTableSource(tableName, f.table);
            // as→tableマップに追加
            fromTableMap[f.as ? f.as: f.table] = f.table;
        });
        
        // selectから、
        // - テーブルの列を登録する
        // - その列内で使っているテーブルと列を登録する
        let curIdx = this.tableName2Idx[tableName];
        let curTableObj = this.tableObjs[curIdx];
        curAst.columns.forEach(c => {
            console.debug("## COLUMNs");
            // curTableObjへ、列を追加する
            let addedColumnInfo = curTableObj.addColumnByAst(c, fromTableMap);
            console.debug(`### [${addedColumnInfo.name}]`);

            // 列で参照されたテーブルへ、列を追加する
            let sourceTableColumns = addedColumnInfo.getSourceTableColumn();
            sourceTableColumns.forEach(stc => {
                let curFromTableIdx = this.tableName2Idx[stc.table];
                let curFromTableObj = this.tableObjs[curFromTableIdx];
                if (stc.table){
                    curFromTableObj.addColumnByName(stc.column);
                }
            });

        });

        //console.log({curTableObj});
    }

    addTable(tableName){
        // すでに存在していたら、何もせず抜ける
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

    // sourceからdestinationを作るとして、その関係性を登録する
    addTableSource(destinationTableName, sourceTableName){
        let destIdx = this.tableName2Idx[destinationTableName];
        let srcIdx = this.tableName2Idx[sourceTableName];

        if (this.tableOrder[srcIdx] < this.tableOrder[destIdx]){
            this.tableOrder[srcIdx] = this.tableOrder[destIdx] + 1;
        }
    }
}

