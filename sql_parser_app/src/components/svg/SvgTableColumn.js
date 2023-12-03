import { useAst } from "../AstProvider";

export default function SvgTableColumn({tableName, bwsColumn}) {
    const { selectColumn } = useAst();

    const showColumnName = () => {
        document.getElementById("textColumnName").value = bwsColumn.columnName;
    };
    const clickColumn = () => {
        console.log(`clicked:${ bwsColumn.columnName }`);
        selectColumn(tableName, bwsColumn.columnName);
    };

    let className = (bwsColumn.selected) ? "SvgTableColumn_selected": "SvgTableColumn";
  
    return (
        <>
            <rect
                x={ bwsColumn.x } y={ bwsColumn.y }
                width={ bwsColumn.width } height={ bwsColumn.height }
                className={ className }
                onMouseOver={ () => showColumnName() }
                onClick={ () => clickColumn() }
            ></rect>
            <text x={ bwsColumn.textX } y={ bwsColumn.textY }
                fullname={ bwsColumn.columnName }
                onMouseOver={ () => showColumnName() }
                onClick={ () => clickColumn() }
            >
                { bwsColumn.columnNameShort }
            </text>
        </>
    );
}
