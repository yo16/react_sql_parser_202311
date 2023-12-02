export default function SvgTableTitle({ bwsTableTitle }) {
    return (
        <>
            <rect
                x={ bwsTableTitle.x } y={ bwsTableTitle.y }
                width={ bwsTableTitle.width } height={ bwsTableTitle.height }
                className="SvgTableTitle"
            ></rect>
            <text
                x={bwsTableTitle.x + 3} y={bwsTableTitle.y + 16}
                fullname={ bwsTableTitle.text }
            >
                { bwsTableTitle.textShort }
            </text>
        </>
    );
}
