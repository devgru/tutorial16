export default function logColors(...colors) {
  const cs = colors.map(c => {
    if (typeof c === 'string') {
      return c;
    } else {
      if (!c.hex) {
        debugger;
        return c;
      }
      return c.hex();
    }
  });
  const string = cs.map(c => `%c ${c}`);
  const styles = cs.map(c => `background: ${c}`);
  console.log(string.join(''), ...styles);
}
