
export default function SvgTableColumn({bwsColumn}) {
    const showColumnName = () => {
        document.getElementById("textColumnName").value = bwsColumn.columnName;
    };

    return (
        <>
            <rect
                x={ bwsColumn.x } y={ bwsColumn.y }
                width={ bwsColumn.width } height={ bwsColumn.height }
                className="SvgTableColumn"
                onMouseOver={ () => showColumnName() }
            ></rect>
            <text x={ bwsColumn.x + 3 } y={ bwsColumn.y + 16 }
                fullname={ bwsColumn.columnName }
                onMouseOver={ () => showColumnName() }
            >
                { bwsColumn.columnNameShort }
            </text>
        </>
    );
}
