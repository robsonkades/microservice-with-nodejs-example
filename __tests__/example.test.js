function soma(a, b) {
  return a + b;
}

describe('Example', () => {
  it('somar dois valores', () => {
    const result = soma(4, 5);
    expect(result).toBe(9);
  });
});
