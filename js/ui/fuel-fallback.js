/* Fill-up form helper: price x litres = total. Any two fields give the third.
   The two fields the user touched most recently are kept; the remaining one is calculated.
   Pass `touched` (most recent first) for values the form opens with. */
function bindFillLinks({ price, total, liters, hint, onChange, touched = [] }) {
  const F = { price, total, liters };
  const WHY = {
    price: "Price per litre calculated as total ÷ litres.",
    total: "Total calculated as litres × price (before subsidy).",
    liters: "Litres calculated as total ÷ price (total before subsidy)."
  };
  const num = el => {
    const n = parseFloat(String(el.value).trim().replace(",", ".")); // accepts "36,5"
    return Number.isFinite(n) && n > 0 ? n : NaN;
  };
  const r2 = n => (Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2);
  const CALC = {
    price: () => r2(num(total) / num(liters)),
    total: () => r2(num(liters) * num(price)),
    liters: () => r2(num(total) / num(price))
  };
  const filled = k => F[k].value.trim() !== "";

  let order = touched.filter(filled); // most recently edited first
  let auto = null;                    // the field we calculated, if any

  const apply = skip => {
    order = order.filter(filled);
    const keep = order.slice(0, 2);
    const target = Object.keys(F).find(k => !keep.includes(k));
    if (keep.length < 2) {              // not enough input: drop any stale calculated value
      if (auto) F[auto].value = "";
      auto = null;
    } else if (target === skip) {       // the user just emptied this field: leave it empty for now
      auto = null;
    } else {
      const v = CALC[target]();
      F[target].value = v === "NaN" ? "" : v;
      auto = v === "NaN" ? null : target;
    }
    if (hint) { hint.hidden = !auto; if (auto) hint.textContent = WHY[auto] + " Edit to override."; }
    if (onChange) onChange();
  };

  const handlers = Object.keys(F).map(k => {
    const input = () => {
      order = [k, ...order.filter(x => x !== k)];
      if (auto === k) auto = null;
      apply(filled(k) ? undefined : k); // field being emptied: don't refill it while the user is typing
    };
    const blur = () => apply();         // left empty -> refill
    F[k].addEventListener("input", input);
    F[k].addEventListener("blur", blur);
    return [k, input, blur];
  });
  apply();                              // form opened with values already in it

  return () => handlers.forEach(([k, input, blur]) => {
    F[k].removeEventListener("input", input);
    F[k].removeEventListener("blur", blur);
  });
}
if (typeof module !== "undefined") module.exports = { bindFillLinks };
