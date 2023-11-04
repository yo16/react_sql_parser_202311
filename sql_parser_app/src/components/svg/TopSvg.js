import SqlFile from "./SqlFile";

const CANVAS_SIZE = {
    width: 800,
    height: 400
};


export default function TopSvg() {

    return (
        <svg {...CANVAS_SIZE}>
            <rect x="0" y="0" {...CANVAS_SIZE} fill="#cccccc" />
            <SqlFile />
        </svg>
    );
}
