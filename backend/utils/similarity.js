exports.cosineSimilarity = (a, b) => {
  const keys = Object.keys(a);

  let dot = 0;
  let magA = 0;
  let magB = 0;

  keys.forEach((key) => {
    const v1 = a[key] || 0;
    const v2 = b[key] || 0;

    dot += v1 * v2;
    magA += v1 * v1;
    magB += v2 * v2;
  });

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (!magA || !magB) return 0;

  return dot / (magA * magB);
};
