const resolver = <T = any>(obj: any, pathStr: string): T => {
  const paths = pathStr.split(".");
  let curr = obj;
  for (const p of paths) {
    const val = curr[p];
    // @ts-ignore
    if (val === undefined || val === null) return {};
    curr = val;
  }
  return curr;
};

export default resolver;
