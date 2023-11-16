import * as React from "react";
import { Table } from "./Table";
import Controls from "./Controls";

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

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data; // The json data that the extension sent
      switch (message.command) {
        case "refactor":
          setButtonText("The brain is working");
        case "data":
          const d = message.data as string;
          setData(
            d
              .replace("\r", "")
              .split("\n")
              .map((line) =>
                line.split(",").map((v) => v.replace(/^"(.*)"$/, "$1"))
              )
          );
          break;
      }
    });
  }, []);

  console.log(data);

  return (
    <div className="dfmaster-app">
      <Controls />
      {!!data.length ? <Table data={data} /> : <p>THE file is empy...</p>}

      {/* <button onClick={sendMessage}>{buttonText}</button> */}
    </div>
  );
};

export default App;
