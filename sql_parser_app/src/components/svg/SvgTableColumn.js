
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
            <text x={ bwsColumn.textX } y={ bwsColumn.textY }
                fullname={ bwsColumn.columnName }
                onMouseOver={ () => showColumnName() }
            >
                { bwsColumn.columnNameShort }
            </text>
        </>
    );
}
