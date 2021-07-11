import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries ,theme}) {
  return (
    <div className={`table ${!theme && "table__dark"}`}>
      {countries.map(({ country, cases }) => (
        <tr className={` ${!theme && "table__dark1"}`}>
          <td >{country}</td>
          <td>
            <strong>{numeral(cases).format("000,000")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
