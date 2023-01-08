import { describe, expect, it } from "vitest";
import { addHours, dateISO, dates, weekISO } from "./dates";

export const isoMatcher = expect.stringMatching(
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
);

export const dateMatcher = expect.any(Date);

describe("dates", () => {
  it("should work", () => {
    expect(dates()).toEqual("dates");
  });

  it("should create date in ISO format", () => {
    const date = dateISO();
    expect(date).toEqual(isoMatcher);
  });

  it.each([
    ["2021-07-11T00:00:00", "2021-W27"], // Sun is last day of the week
    ["2021-07-12T00:00:00", "2021-W28"], // Mon is first of the week
    ["2021-01-01T00:00:00", "2020-W53"], // Sill on last year week
    ["2021-01-04T00:00:00", "2021-W01"], // Actually first week of the year
    ["2020-12-31T00:00:00", "2020-W53"], // Last week of past year
    ["2021-02-01T00:00:00", "2021-W05"], // Just a regular date
  ])("should create week in ISO format %s => %s", (str, expected) => {
    const date = new Date(str);
    const actual = weekISO(date);
    expect(actual).toEqual(expected);
  });

  it.each([
    [1, "2021-07-11T00:00:00.000Z", "2021-07-11T01:00:00.000Z"],
    [24, "2021-07-11T00:00:00.000Z", "2021-07-12T00:00:00.000Z"],
    [-1, "2021-07-11T00:00:00.000Z", "2021-07-10T23:00:00.000Z"],
  ])("should add hours %s to %s", (hours, str, expected) => {
    const date = new Date(str);
    const actual = addHours(date, hours);
    expect(actual.toISOString()).toEqual(expected);
  });
});
