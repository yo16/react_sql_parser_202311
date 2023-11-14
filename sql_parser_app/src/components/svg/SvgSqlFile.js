import SvgTable from "./SvgTable";
import {v4} from "uuid";

export default function SvgSqlFile({fileName, box}) {
    let basePos = {x:0, y:0};
    return (
        <>
            <rect
                x={ basePos.x } y={ basePos.y }
                width={ box.sqlFile.width } height={ box.sqlFile.height }
                className="SvgSqlFile"
            >
            </rect>
            <text x={ basePos.x } y={ basePos.y+13 }>{ fileName }</text>
            {
                // x,y位置は、ベース位置を加算する
                box.sqlFile.tables.map(t =>
                    <SvgTable
                        {...t}
                        basePos={ basePos }
                        key={ v4() }
                    />
                )
            }
        </>
    );
}

