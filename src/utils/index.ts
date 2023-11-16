export const read_csv = (contents: string): Array<Array<string>> => {
  return contents
    .replace("\r", "")
    .split("\n")
    .map((line) =>
      line
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((v) => v.replace(/^"(.*)"$/, "$1"))
    );
};

export const read_json = (contents: string): Array<Array<string>> => {
  const res = JSON.parse(contents);
  const headers = Object.keys(res[0]);
  const values = res.map((res) => Object.values(res));
  return [headers, ...values];
};
