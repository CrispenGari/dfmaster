import React from "react";

interface Props {
  data: Array<Array<string>>;
}
export const Table: React.FunctionComponent<Props> = ({ data }) => {
  return (
    <div className="dfmaster-table" style={{ borderWidth: 1 }}>
      <table>
        <thead>
          <tr>
            {data[0].map((v, i) => (
              <th key={i}>{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, index) => (
            <tr key={index}>
              {row.map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
