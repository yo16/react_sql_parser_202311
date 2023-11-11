import { useAst } from "../AstProvider";
import SqlFile from "./SqlFile";

const CANVAS_SIZE = {
    width: 800,
    height: 400
};


export default function TopSvg() {
    const { asts } = useAst();
    //console.log({asts});

    return (
        <svg {...CANVAS_SIZE}>
            <rect x="0" y="0" {...CANVAS_SIZE} fill="#cccccc" />
            {
                asts.map(a => <SqlFile {...a} key={a.id} />)
            }
        </svg>
    );
}
