
export default function SvgTableColumn({bwsColumn}) {
    return (
        <>
            <rect
                x={ bwsColumn.x } y={ bwsColumn.y }
                width={ bwsColumn.width } height={ bwsColumn.height }
                className="SvgTableColumn"
            ></rect>
            <text x={bwsColumn.x + 3} y={bwsColumn.y + 16}
                fullname={bwsColumn.name}
            >
                { bwsColumn.columnNameShort }
            </text>
        </>
    );
}
