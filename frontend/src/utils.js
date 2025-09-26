export function inferNumericColumns(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  const cols = Object.keys(rows[0] || {});
  const numeric = cols.filter((c) => rows.every(r => r[c] === null || r[c] === undefined || typeof r[c] === 'number' || !isNaN(Number(r[c]))));
  return numeric;
}

export function chooseDefaultAxes(rows) {
  const nums = inferNumericColumns(rows);
  const cols = Object.keys(rows[0] || {});
  if (nums.length >= 2) return { x: cols[0], y: nums[1] };
  if (nums.length === 1) return { x: cols[0], y: nums[0] };
  return { x: cols[0] || null, y: cols[1] || null };
}
