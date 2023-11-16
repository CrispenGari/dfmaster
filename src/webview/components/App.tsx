import * as React from "react";
import { Table } from "./Table";
import Controls from "./Controls";
import { read_csv, read_json } from "../../utils";

interface vscode {
  postMessage(message: { command: string }): void;
}
declare const vscode: vscode;

const sendMessage = () => {
  console.log("button clicked");
  vscode.postMessage({ command: "testing" });
};

const App = () => {
  const [buttonText, setButtonText] = React.useState("The brain is pending");
  const [data, setData] = React.useState([]);
  const [fileName, setFileName] = React.useState<string | undefined>();
  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.command) {
        case "refactor":
          setButtonText("The brain is working");
        case "data":
          setFileName(message.fileName);
          const d = message.data as string;
          const type = message.type as string;
          switch (type) {
            case "csv":
              setData(read_csv(d));
              break;
            case "json":
              setData(read_json(d));
              break;
            default:
              setData([]);
              break;
          }
          break;
      }
    });
  }, []);

  console.log({ data, fileName });

  return (
    <div className="dfmaster-app">
      <Controls />
      {!!data.length ? (
        <Table data={data} />
      ) : (
        <div className="dfmaster-app-loading">
          <p>Loading DataFrame Table...</p>
        </div>
      )}
    </div>
  );
};

export default App;
