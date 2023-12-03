import {v4} from "uuid";

import { useAst } from "../AstProvider.js";
import SvgSqlFile from "./SvgSqlFile.js";
import SvgLink from "./SvgLink.js";


export default function TopSvg() {
    const { fileDefs } = useAst();
    //console.log({asts});

    // SqlFileから幅と高さを得る
    let svgSize = {
        width: fileDefs.reduce((s,d) => s + d.bwsSqlFile.width, 0),
        height: fileDefs.reduce((s,d) => Math.max(s,d.bwsSqlFile.height), 0),
    };

    // テーブルのリンクと、列のリンクを作成
    let links = [].concat(...fileDefs.map(d => 
        d.bwsSqlFile.getAllConnections()
    ));
    //console.log(links);

    return (
        <>
            <div style={{ display:"flex", flexDirection:"row" }}>
                <div>
                    <svg {...svgSize}>
                        <rect x="0" y="0" {...svgSize} fill="#cccccc" />
                        {
                            fileDefs.map(a => <SvgSqlFile {...a} key={ v4() } />)
                        }
                        {links.length>0 &&
                            links.map(ln => <SvgLink {...ln} key={ v4() } />)
                        }
                    </svg>
                </div>
                {fileDefs.length>0 &&
                    <div style={{ display:"flex", flexDirection:"column" }}>
                        <div>Table:</div>
                        <textarea id="textTableName" style={{ verticalAlign:"top", width:"20rem", height:"5rem" }}></textarea>
                        <div>Column:</div>
                        <textarea id="textColumnName" style={{ verticalAlign:"top", width:"20rem", height:"5rem" }}></textarea>
                    </div>
                }
            </div>
        </>
    );
}
