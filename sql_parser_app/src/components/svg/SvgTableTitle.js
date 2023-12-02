export default function SvgTableTitle({ bwsTableTitle }) {
    return (
        <>
            <rect
                x={ bwsTableTitle.x } y={ bwsTableTitle.y }
                width={ bwsTableTitle.width } height={ bwsTableTitle.height }
                className="SvgTableTitle"
            ></rect>
            <text
                x={ bwsTableTitle.textX } y={ bwsTableTitle.textY }
                fullname={ bwsTableTitle.text }
            >
                { bwsTableTitle.textShort }
            </text>
        </>
    );
}
