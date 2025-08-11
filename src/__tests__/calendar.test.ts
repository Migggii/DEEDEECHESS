import { describe, expect, it } from "vitest";
import { getMonthData } from "../pages/calendar";

describe("getMonthData", () => {
  it("returns 28 days for February 2023", () => {
    const data = getMonthData(2023, 1);
    expect(data.filter(Boolean).length).toBe(28);
  });

  it("returns 29 days for February 2024", () => {
    const data = getMonthData(2024, 1);
    expect(data.filter(Boolean).length).toBe(29);
  });

  it("includes leading nulls so that January 2023 starts on Sunday", () => {
    const data = getMonthData(2023, 0);
    expect(data.slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(data[6]).toBe(1);
  });
});
