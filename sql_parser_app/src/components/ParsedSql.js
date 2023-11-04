import React from "react";
import { Parser } from "node-sql-parser/build/bigquery";

export default function ParsedSql({query="select * from duel;"}){
    if ( query.length === 0 ) {
        return (<>No SQL!</>);
    }
    //console.log(query);
    const parser = new Parser();
    var ast = {};
    try {
        ast = parser.astify(query);
    } catch(error){
        console.log(error);
    }
    console.log({ast});

    return ast;
}

