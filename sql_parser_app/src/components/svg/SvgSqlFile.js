import SvgTable from "./SvgTable";
import {v4} from "uuid";

export default function SvgSqlFile({fileName, bwsSqlFile}) {
    return (
        <>
            <rect
                x={ bwsSqlFile.x } y={ bwsSqlFile.y }
                width={ bwsSqlFile.width } height={ bwsSqlFile.height }
                className="SvgSqlFile"
            >
            </rect>
            <text x={ bwsSqlFile.x } y={ bwsSqlFile.y+13 }>{ fileName }</text>
            {
                // x,y位置は、ベース位置を加算する
                bwsSqlFile.tables.map(bwsTable =>
                    <SvgTable
                        bwsTable={ bwsTable }
                        key={ v4() }
                    />
                )
            }
        </>
    );
}

