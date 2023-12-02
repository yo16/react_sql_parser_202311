import {v4} from "uuid";

import { useAst } from "../AstProvider";
import SvgSqlFile from "./SvgSqlFile";


export default function TopSvg() {
    const { fileDefs } = useAst();
    //console.log({asts});

    // SqlFileから幅と高さを得る
    let svgSize = {
        width: fileDefs.reduce((s,d) => s + d.bwsSqlFile.width, 0),
        height: fileDefs.reduce((s,d) => Math.max(s,d.bwsSqlFile.height), 0),
    };

    // テーブルのリンクと、列のリンクを作成
    let linkPairs = [];


    return (
        <svg {...svgSize}>
            <rect x="0" y="0" {...svgSize} fill="#cccccc" />
            {
                fileDefs.map(a => <SvgSqlFile {...a} key={ v4() } />)
            }
        </svg>
    );
}
