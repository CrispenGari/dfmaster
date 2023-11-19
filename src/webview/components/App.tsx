import * as React from "react";
import { Table } from "./Table";
import { read_csv, read_json, read_tsv } from "../../utils";

interface vscode {
  postMessage(message: { command: string }): void;
}
declare const vscode: vscode;

const App = () => {
  const [{ data, loading }, setState] = React.useState({
    data: [],
    loading: true,
    fileName: "",
  });

  const listener = (event) => {
    const message = event.data; // The json data that the extension sent
    const d = message.data as string;
    const type = message.type as string;
    switch (message.command) {
      case "data":
        setState((state) => ({
          ...state,
          loading: true,
          fileName: message?.fileName,
        }));

        switch (type) {
          case "csv":
            setState((state) => ({
              ...state,
              loading: false,
              data: read_csv(d),
            }));
            break;
          case "json":
            setState((state) => ({
              ...state,
              loading: false,
              data: read_json(d),
            }));
            break;
          case "tsv":
            setState((state) => ({
              ...state,
              loading: false,
              data: read_tsv(d),
            }));
            break;
          default:
            setState((state) => ({
              ...state,
              loading: false,
              data: [],
            }));
            break;
        }
        break;
      case "edit":
        console.log({ type, d });
        switch (type) {
          case "csv":
            setState((state) => ({
              ...state,
              loading: false,
              data: read_csv(d),
            }));
            break;
          case "json":
            setState((state) => ({
              ...state,
              loading: false,
              data: read_json(d),
            }));
            break;
          case "tsv":
            setState((state) => ({
              ...state,
              loading: false,
              data: read_tsv(d),
            }));
            break;
          default:
            setState((state) => ({
              ...state,
              loading: false,
              data: [],
            }));
            break;
        }
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  console.log({ loading, data });

  if (loading) {
    return (
      <div className="dfmaster-app">
        <div className="dfmaster-app-loading">
          <p>Loading DataFrame Table...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="dfmaster-app">
      {/* <Controls /> */}
      {!!data.length ? (
        <Table data={data} />
      ) : (
        <div className="dfmaster-app-loading">
          <p>No data in the file</p>
        </div>
      )}
    </div>
  );
};

export default App;
