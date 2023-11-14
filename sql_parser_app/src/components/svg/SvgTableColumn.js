
export default function SvgTableColumn({x, y, width, height, name, basePos}) {
    return (
        <>
            <rect
                x={basePos.x + x} y={basePos.y + y} width={width} height={height}
                className="SvgTableColumn"
            ></rect>
            <text x={basePos.x + x + 3} y={basePos.y + y + 16} fullname={name}>{ name }</text>
        </>
    );
}
