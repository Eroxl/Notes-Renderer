import React from 'react';
import TextNode from '../lib/types/TextNode';
import Content from './Content';

const Table: React.FC<{ node: TextNode}> = (props) => {
  const {
    headers,
    rows,
  } = props.node.properties as {
    headers: string[],
    rows: string[][],
  }

  return (
    <div className="w-full overflow-x-scroll">
      <table className="min-w-full">
        <thead>
          <tr>
            {headers.map((header) => (
              <th className="text-left p-1 px-2 min-w-8 border border-nord-2">
                <Content textContent={header} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr>
              {row.map((cell) => (
                <td className="min-w-12 p-1 px-2 border border-nord-2">
                  <Content textContent={cell} />
                </td>
              ))}
            </tr> 
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default Table;