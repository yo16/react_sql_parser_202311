import SvgTableTitle from "./SvgTableTitle";
import SvgTableColumn from "./SvgTableColumn";
import {v4} from "uuid";

export default function SvgTable({bwsTable}) {
    return (
        <>
            <rect
                x={ bwsTable.x } y={ bwsTable.y }
                width={ bwsTable.width} height={ bwsTable.height }
                className="SvgTable"
            ></rect>
            <SvgTableTitle bwsTableTitle={ bwsTable.title }></SvgTableTitle>
            {
                bwsTable.columns.map(c =>
                    <SvgTableColumn
                        bwsColumn={ c }
                        key={ v4() }
                    ></SvgTableColumn>
                )
            }
        </>
    );
}

