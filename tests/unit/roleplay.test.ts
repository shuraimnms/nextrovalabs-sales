import { describe, expect, it } from "vitest";
import { PERSONALITIES, PROJECTS, MAX_USER_TURNS, customerReply, evaluate, openingLine, type Turn } from "@/lib/roleplay/engine";

const u = (t: string): Turn => ({ role: "user", text: t });
const cu = (t: string): Turn => ({ role: "customer", text: t });

describe("roleplay engine", () => {
  it("supports 7 personalities and 4 project types", () => {
    expect(Object.keys(PERSONALITIES)).toHaveLength(7);
    expect(Object.keys(PROJECTS)).toHaveLength(4);
  });
  it("produces an opening for every combination", () => {
    for (const p of Object.keys(PERSONALITIES)) for (const j of Object.keys(PROJECTS)) expect(openingLine(p as keyof typeof PERSONALITIES, j as keyof typeof PROJECTS).length).toBeGreaterThan(10);
  });
  it("ends the conversation after the maximum turns", () => {
    const h: Turn[] = Array.from({ length: MAX_USER_TURNS }, () => u("Ji sir, main samajh sakta hoon"));
    expect(customerReply("BUSY", "BEGINNER", h).ended).toBe(true);
  });
  it("reacts with doubt to guarantees, prices and day counts", () => {
    for (const bad of ["100% guarantee hai sir", "Sirf Rs. 5000 mein ho jayega", "3 din mein ban jayega"]) {
      expect(customerReply("PRICE_SENSITIVE", "BEGINNER", [cu("hi"), u(bad)]).text).toMatch(/doubt|bharosa/i);
    }
  });
  it("is deterministic", () => {
    const h = [cu("hi"), u("Sir, aapki baat samajh sakta hoon, kya main kuch sawal puch sakta hoon?")];
    expect(customerReply("SKEPTICAL", "INTERMEDIATE", h)).toEqual(customerReply("SKEPTICAL", "INTERMEDIATE", h));
  });
  it("scores six criteria within 0-100", () => {
    const { scores } = evaluate([cu("Price?"), u("Sir, aapki baat samajh sakta hoon. Aapka business kya hai aur kaunse features zaroori hain?"), cu("..."), u("Theek hai sir, main team se confirm karke kal WhatsApp par summary bhejta hoon.")]);
    for (const v of Object.values(scores)) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100); }
    expect(Object.keys(scores)).toHaveLength(7);
  });
  it("rewards good practice over bad practice", () => {
    const good = evaluate([cu("x"), u("Sir, aapki baat samajh sakta hoon. Aapka business kya hai? Kaunse features chahiye?"), cu("y"), u("Main team se confirm karke kal meeting schedule karta hoon, sir.")]);
    const bad = evaluate([cu("x"), u("bhai 100% guarantee hai, Rs. 5000 lagega"), cu("y"), u("ok")]);
    expect(good.scores.overall).toBeGreaterThan(bad.scores.overall + 20);
    expect(bad.feedback.join(" ")).toMatch(/price|guarantee/i);
  });
});
