import BoxTable from "./BoxTable.js";

// undefined の代わりに使うテーブル名
// BoxTable以下では undefined だけど、BoxSqlFileでは "__undefined__" とするルール
const UNDEF_TABLE = "__undefined__";


export default class BoxSqlFile {
    constructor(ast){
        this.tableObjs = [];
        this.tableName2Idx = {};        // 名前からtableObjsなどのインデックスへ変換するdict
        this.tableOrder = [];           // tableObjsの上流/下流の関係を示す 0が最下流

        console.log({ast});
        
        // テーブル名なしに項目を受け入れるためのテーブルを登録
        this.addTable(null);

        // このastから読み解ける情報を登録
        this.parseAst(ast);

        // 全体の順序番号を付ける
        this.setTableOrder();
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
        //console.log(111);
        if (curAst.with){
            curAst.with.forEach(w => {
                this.parseAst(w.stmt.ast, w.name.value);
            });
        }

        // fromから、参照テーブル(名だけ)を登録
        //console.log(`222: ${tableName}`);
        let fromTableMap = {};  // テーブルをリネームしている場合のマップ(as → table)
        curAst.from.forEach(f => {
            this.addTable(f.table);
            // as→tableマップに追加
            fromTableMap[f.as ? f.as: f.table] = f.table;
        });
        // fromが1つの場合は省略できるので、省略したときの要素を追加しておく
        if (curAst.from.length===1){
            fromTableMap[null] = curAst.from[0].table;
        }
        //console.log({fromTableMap});
        
        // selectから、
        // - テーブルの列を登録する
        // - その列内で使っているテーブルと列を登録する
        let curIdx = this.tableName2Idx[tableName];
        let curTableObj = this.tableObjs[curIdx];
        curAst.columns.forEach(c => {
            //console.debug("## COLUMNs");
            //console.log({c});
            // curTableObjへ、列を追加する
            let addedColumnInfo = curTableObj.addColumnByAst(c, fromTableMap);
            console.assert((addedColumnInfo.name !== undefined), "name is undef!");
            console.debug(`### [${addedColumnInfo.name}]`);

            // 列で参照されたテーブルへ、列を追加する
            let sourceTableColumns = addedColumnInfo.getSourceTableColumn();
            sourceTableColumns.forEach(stc => {
                // undefは、ソーステーブルがない場合に発生する
                if (stc.table === undefined){
                    curTableObj.addSourceTable(undefined);
                    stc.table = UNDEF_TABLE;
                    // 見つけた時点で、テーブル登録
                    this.addTable(UNDEF_TABLE);
                }
                let curFromTableIdx = this.tableName2Idx[stc.table];
                let curFromTableObj = this.tableObjs[curFromTableIdx];
                curFromTableObj.addColumnByName(stc.column);
            });

        });

        // from句から、sourceTableを登録する
        curAst.from.forEach(f => {
            curTableObj.addSourceTable(f.table);
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
        this.tableOrder.push(0);
    }

    // this.tableObjsの順序番号を付ける
    setTableOrder(){
        //this.tableObjs = [];
        //this.tableName2Idx = {};        // 名前からtableObjsなどのインデックスへ変換するdict
        //this.tableOrder = [];           // tableObjsの上流/下流の関係を示す 0が最下流

        // テーブルグラフ
        let tableGraph = this.tableObjs.map((to,i) => {
            let sources = to.getSourceTableNames();
            //console.log(i,sources);
            let sourceIdxs = [];
            sources.forEach(s => {
                sourceIdxs.push(this.tableName2Idx[escapeUndef(s)]);
            });
            return {
                idx: i,
                name: escapeUndef(to.tableName),
                sources: sourceIdxs,
                order: 0,       // ここを計算する。末端が0。
            };
        });
        //console.log(tableGraph);
        let maxOrder = 0;   // ついでにmaxOrderも計算しておく
        function calcOrder(g){
            //console.log(g.idx, g.name);
            // 計算済みだったら不要
            if ( g.order > 0 ){return;}
            
            if (g.sources){
                g.sources.forEach(childIdx => {
                    let child = tableGraph[childIdx];
                    //console.log("child", childIdx, child);
                    // 自分以下だったら自分+1にする
                    if (child.order <= g.order){
                        child.order = g.order + 1;
                        if (maxOrder < child.order){
                            maxOrder = child.order;
                        }
                    }
    
                    calcOrder(child);
                })
            }
        }
        tableGraph.forEach(g => {
            calcOrder(g);
        });
        //console.log("tableGraph");
        //console.log(tableGraph);

        // グラフから書き換える



        
        // tableObjを全部見て、そのソースは自分より大きな値に変更する
        this.tableObjs.forEach((t,idx) => {
            let sources = t.getSourceTableNames();
            let curOrder = this.tableOrder[idx];
            sources.forEach(s => {
                let sourceIdx = this.tableName2Idx[s];
                let sourceOrder = this.tableOrder[sourceIdx];
                // curより同じか下だったら、cur+1にする
                if (sourceOrder <= curOrder){
                    this.tableOrder[sourceIdx] = curOrder + 1;
                }
            });
        });
    }

    // sourceからdestinationを作るとして、その関係性を登録する
    addTableSource(destinationTableName, sourceTableName){
        console.log(`addTableSource, ${sourceTableName} -> ${destinationTableName}`);
        let destIdx = this.tableName2Idx[destinationTableName];
        let srcIdx = this.tableName2Idx[sourceTableName];

        if (this.tableOrder[srcIdx] <= this.tableOrder[destIdx]){
            this.tableOrder[srcIdx] = this.tableOrder[destIdx] + 1;
        }
    }
}

function escapeUndef(tbl){
    return (tbl!==undefined) ? tbl: UNDEF_TABLE;
}
