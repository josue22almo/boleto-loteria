import { expect } from "chai";
import { add } from "../src";

describe('Add function', () => {
  it('should properly sum 4+5=9', () => {
    expect(add(4, 5)).eq(9);
  });
});