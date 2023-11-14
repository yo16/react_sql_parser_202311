import SvgTableTitle from "./SvgTableTitle";
import SvgTableColumn from "./SvgTableColumn";
import {v4} from "uuid";

export default function SvgTable({x, y, width, height, tableTitle, columns, basePos}) {
    return (
        <>
            <rect
                x={basePos.x + x} y={basePos.y + y}
                width={width} height={height}
                className="SvgTable"
            ></rect>
            <SvgTableTitle {...tableTitle} basePos={basePos}></SvgTableTitle>
            {
                columns.map(c =>
                    <SvgTableColumn
                        {...c}
                        basePos={basePos}
                        key={ v4() }
                    ></SvgTableColumn>
                )
            }
        </>
    );
}

