
export default function SvgLink({isTable, source, dest}) {
    let d = `M ${source.x} ${source.y} `
        + `Q ${(source.x*2+dest.x)/3} ${source.y}, `
        + `${(source.x+dest.x)/2} ${(source.y+dest.y)/2}, `
        + `T ${dest.x} ${dest.y}`;
    
    let strokeColor = isTable ? "#333" : "red";
    let strokeWidth = isTable ? "3" : "1";

    return (
        <>
            <path d={ d } stroke={ strokeColor } strokeWidth={ strokeWidth } fill="transparent" />
            <circle cx={ source.x } cy={ source.y } r="3" fill="red" />
            <circle cx={ dest.x } cy={ dest.y } r="3" fill="blue" />
        </>
    );
}

