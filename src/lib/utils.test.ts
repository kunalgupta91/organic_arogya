import { describe, expect, it } from "vitest";
import { cn, formatCurrency, slugify } from "./utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-primary-500", undefined, "font-bold")).toBe(
      "text-primary-500 font-bold",
    );
  });
});

describe("formatCurrency", () => {
  it("formats INR from paise", () => {
    expect(formatCurrency(149900, "INR")).toBe("₹1,499");
  });

  it("formats USD from cents", () => {
    expect(formatCurrency(1999, "USD")).toBe("$19.99");
  });
});

describe("slugify", () => {
  it("lowercases, trims, and hyphenates", () => {
    expect(slugify("  Ashwagandha Powder (500g) ")).toBe("ashwagandha-powder-500g");
  });
});
