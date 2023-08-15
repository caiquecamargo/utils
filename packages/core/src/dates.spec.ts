import { describe, expect, it, vi } from "vitest";
import { addHours, dateISO, dateToEpoch, epochToDate, fractionateMiliseconds, getDate, getGraphQlDate, getMonth, getYear, isStringDate, localeDate, nowPlusHours, weekISO } from "./dates";

export const isoMatcher = expect.stringMatching(
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
);

export const dateMatcher = expect.any(Date);

describe("dates", () => {
  it("should return now add from %s hours", () => {
    vi.useFakeTimers({
      now: new Date("2021-07-11T00:00:00.000Z"),
    });

    expect(nowPlusHours(1)).toEqual(new Date("2021-07-11T01:00:00.000Z"));
    expect(nowPlusHours(2)).toEqual(new Date("2021-07-11T02:00:00.000Z"));
    expect(nowPlusHours(3)).toEqual(new Date("2021-07-11T03:00:00.000Z"));
    expect(nowPlusHours(4)).toEqual(new Date("2021-07-11T04:00:00.000Z"));

    vi.useRealTimers();
  });

  it("should create date in ISO format", () => {
    expect(dateISO()).toEqual(isoMatcher);
    expect(dateISO(2)).toEqual(isoMatcher);
  });

  it.each([
    ["2021-07-11T00:00:00", "2021-W27"], // Sun is last day of the week
    ["2021-07-12T00:00:00", "2021-W28"], // Mon is first of the week
    ["2021-01-01T00:00:00", "2020-W53"], // Sill on last year week
    ["2021-01-04T00:00:00", "2021-W01"], // Actually first week of the year
    ["2020-12-31T00:00:00", "2020-W53"], // Last week of past year
    ["2021-02-01T00:00:00", "2021-W05"], // Just a regular date
    [undefined, "2021-W27"], // Just a regular date
  ])("should create week in ISO format %s => %s", (str, expected) => {
    vi.useFakeTimers({
      now: new Date("2021-07-11T00:00:00.000Z"),
    });

    const date = str ? new Date(str) : undefined;
    const actual = weekISO(date);
    expect(actual).toEqual(expected);

    vi.useRealTimers();
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

  it.each([
    ["2021-07-11T00:00:00", 11],
    ["2021-07-12T00:00:00", 12],
    ["2021-01-01T00:00:00", 1],
    ["2021-01-04T00:00:00", 4],
    ["2020-12-31T00:00:00", 31],
    ["2021-02-01T00:00:00", 1],
    [undefined, 11],
  ])("should return the UTC date %s => %s", (str, expected) => {
    vi.useFakeTimers({
      now: new Date("2021-07-11T00:00:00.000Z"),
    });

    const date = str ? new Date(str) : undefined;
    const actual = getDate(date);
    expect(actual).toEqual(expected);

    vi.useRealTimers();
  });

  it.each([
    ["2021-07-11T00:00:00", 2021],
    ["2021-07-12T00:00:00", 2021],
    ["2021-01-01T00:00:00", 2021],
    ["2021-01-04T00:00:00", 2021],
    ["2020-12-31T00:00:00", 2020],
    ["2021-02-01T00:00:00", 2021],
    [undefined, 2021],
  ])("should return the year %s => %s", (str, expected) => {
    vi.useFakeTimers({
      now: new Date("2021-07-11T00:00:00.000Z"),
    });

    const date = str ? new Date(str) : undefined;
    const actual = getYear(date);
    expect(actual).toEqual(expected);

    vi.useRealTimers();
  });

  it.each([
    ["2021-07-11T00:00:00", 7],
    ["2021-07-12T00:00:00", 7],
    ["2021-01-01T00:00:00", 1],
    ["2021-01-04T00:00:00", 1],
    ["2020-12-31T00:00:00", 12],
    ["2021-02-01T00:00:00", 2],
    [undefined, 7],
  ])("should return the year %s => %s", (str, expected) => {
    vi.useFakeTimers({
      now: new Date("2021-07-11T00:00:00.000Z"),
    });

    const date = str ? new Date(str) : undefined;
    const actual = getMonth(date);
    expect(actual).toEqual(expected);

    vi.useRealTimers();
  });

  it.each([
    [12548, "1970-01-01T00:00:01.970Z"],
    [1626000000, "2021-07-11T00:00:00.000Z"],
    [1726000000, "2024-09-10T00:00:00.000Z"],
  ])("should return the date from epoch %s => %s", (epoch, expected) => {
    expect(localeDate(epochToDate(epoch), "pt-BR")).toEqual(localeDate(new Date(expected), "pt-BR"));
  });

  it.each([
    [1, "1970-01-01T00:00:01.970Z"],
    [1625961600, "2021-07-11T00:00:00.000Z"],
    [1725926400, "2024-09-10T00:00:00.000Z"],
  ])("should return the date from epoch %s => %s", (expected, date) => {
    expect(dateToEpoch(new Date(date))).toEqual(expected);
  });

  it.each([
    [1, { miliseconds: 1, seconds: 0, minutes: 0, hours: 0, days: 0, weeks: 0, months: 0, years: 0 }],
    [1000, { miliseconds: 1000, seconds: 1, minutes: 0.02, hours: 0, days: 0, weeks: 0, months: 0, years: 0 }],
    [1001, { miliseconds: 1001, seconds: 1, minutes: 0.02, hours: 0, days: 0, weeks: 0, months: 0, years: 0 }],
    [25436, { miliseconds: 25436, seconds: 25.44, minutes: 0.42, hours: 0.01, days: 0, weeks: 0, months: 0, years: 0 }],
    [123451242452345, { miliseconds: 123451242452345, seconds: 123451242452.35, minutes: 2057520707.54, hours: 34292011.79, days: 1428833.82, weeks: 204119.12, months: 47627.79, years: 3914.61 }],
  ])("should return miliseconds in date fractions", (miliseconds, expected) => {
    expect(fractionateMiliseconds(miliseconds)).toEqual(expected);
  });

  it.each([
    ["2021-07-11T00:00:00", "2021-07-11"],
    ["2021-07-12T00:00:00", "2021-07-12"],
    ["2021-01-01T00:00:00", "2021-01-01"],
    ["2021-01-04T00:00:00", "2021-01-04"],
    ["2020-12-31T00:00:00", "2020-12-31"],
    ["2021-02-01T00:00:00", "2021-02-01"],
  ])("should return the graphql Date %s => %s", (str, expected) => {
    const date = new Date(str)
    const actual = getGraphQlDate(date);
    expect(actual).toEqual(expected);
  });

  it.each([
    ["2020-12-10", true],
    [undefined, false],
    ["2020-12-", false],
    ["2020-12-1", false],
    ["", false],
    ["01/10/1994", false],
    ["2021-02-01T00:00:00", false],
  ])("should return if %s is a valid date string", (str, expected) => {
    expect(isStringDate(str as any)).toEqual(expected);
  })
});
