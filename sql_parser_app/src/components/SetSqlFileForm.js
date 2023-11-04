import { useAst } from "./AstProvider";

export default function SetSqlFileForm(){
    const { addQuery } = useAst();
    
    const handleInputChange = event => {
        // eventからFileオブジェクトを取り出す
        const file = event.target.files[0];

        // FileReaderを作成
        const reader = new FileReader();
        // コールバック関数を準備
        reader.onload = () => {
            //resetFilePath(reader.result);
            addQuery(file.name, reader.result);
        };
        // 読む
        reader.readAsText(file);
    }

    return (
        <>
            <input
                type="file"
                name="upload_sql_file"
                onChange={handleInputChange}
            />
        </>
    )
}