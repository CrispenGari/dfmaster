export const read_csv = (contents: string): Array<Array<string>> => {
  return contents
    .replace("\r", "")
    .split("\n")
    .map((line) =>
      line
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((v) => String(v.replace(/^"(.*)"$/, "$1")))
    );
};

export const read_tsv = (contents: string): Array<Array<string>> => {
  return contents
    .replace("\r", "")
    .split("\n")
    .map((line) =>
      line.split(/\s{1,}|\t/).map((v) => String(v.replace(/^"(.*)"$/, "$1")))
    );
};

export const read_json = (contents: string): Array<Array<string>> => {
  const res = JSON.parse(contents);
  const headers = Object.keys(res[0]);
  const values = res.map((res) => Object.values(res));
  return [headers, ...values.map((v) => v.map((i) => String(i)))];
};
