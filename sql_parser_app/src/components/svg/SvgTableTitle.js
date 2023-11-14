
export default function SvgTableTitle({x, y, width, height, name, nameDisplay, basePos}) {
    return (
        <>
            <rect
                x={basePos.x + x} y={basePos.y + y} width={width} height={height}
                className="SvgTableTitle"
            ></rect>
            <text x={basePos.x + x + 3} y={basePos.y + y + 16} fullname={name}>{ nameDisplay }</text>
        </>
    );
}
