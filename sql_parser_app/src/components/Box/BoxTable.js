import BoxColumn from "./BoxColumn";


export default class BoxTable {
    constructor(tableName){
        this.tableName = tableName;
        this.columns = [];

        this.sourceTableNames = [];
    }

    get name(){
        return this.tableName;
    }
    getSourceTableNames(){
        return [...this.sourceTableNames];
    }

    // astのcolumn要素から、列情報を登録する
    addColumnByAst(astC, tableMap){
        let boxCol = new BoxColumn(astC, tableMap);

        // 登録(すでにあったら上書きする)
        this.columns.filter(
            cObj => cObj.name !== boxCol.name
        );
        this.columns.push(
            boxCol
        );

        // ソーステーブルを登録
        // columnから
        let sourceColumns = boxCol.getSourceTableColumn();
        sourceColumns.forEach(tc => {
            // なかったら追加
            if (this.sourceTableNames.indexOf(tc.table) < 0){
                this.sourceTableNames.push(tc.table);
            }
        });

        return boxCol;
    }

    // 列名だけ登録する
    addColumnByName(columnName){
        // 登録(すでにあったらなにもしない)
        if (this.columns.filter(c => c.name===columnName).length === 0 ){
            let boxCol = new BoxColumn({name:columnName, expr:{as:columnName}},{},false);
            this.columns.push(boxCol);
        }
    }

    // ソーステーブルを追加する（from句にあるがcolumnで使われない場合に、ここで登録される）
    addSourceTable(tableName){
        // なかったら追加
        if (this.sourceTableNames.indexOf(tableName) < 0){
            this.sourceTableNames.push(tableName);
        }
    }
}

