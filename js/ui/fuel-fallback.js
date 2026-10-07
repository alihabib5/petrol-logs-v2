/* Fill-up form helper: fills "litres" from total / price, and never overwrites what the user typed. */
function bindLitersFallback({ price, total, liters, hint, onAuto }) {
  let auto = false; // true only while the litres field holds a value WE wrote

  const num = el => {
    const n = parseFloat(String(el.value).trim().replace(",", ".")); // accepts "36,5"
    return Number.isFinite(n) ? n : NaN;
  };
  const round2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

  const setAuto = value => {
    liters.value = value;
    auto = value !== "";
    liters.dataset.auto = String(auto);
    if (hint) hint.hidden = !auto;
    if (onAuto) onAuto();
  };

  const recalc = () => {
    if (liters.value.trim() !== "" && !auto) return;      // user's own value: leave it alone
    const p = num(price), t = num(total);
    if (p > 0 && t > 0) setAuto(round2(t / p).toFixed(2));
    else if (auto) setAuto("");                           // inputs became invalid: drop the stale auto value
  };

  const onLiters = () => {                                // typing here = the user takes control
    auto = false;
    liters.dataset.auto = "false";
    if (hint) hint.hidden = true;
  };

  price.addEventListener("input", recalc);
  total.addEventListener("input", recalc);
  liters.addEventListener("input", onLiters);
  liters.addEventListener("blur", recalc);                // left empty -> refill
  recalc();                                               // form opened with values already in it

  return () => {
    price.removeEventListener("input", recalc);
    total.removeEventListener("input", recalc);
    liters.removeEventListener("input", onLiters);
    liters.removeEventListener("blur", recalc);
  };
}
if (typeof module !== "undefined") module.exports = { bindLitersFallback };
