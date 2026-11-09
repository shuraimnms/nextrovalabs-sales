// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { RichText } from "@/components/shared/rich-text";

afterEach(cleanup);

describe("RichText", () => {
  it("never renders HTML from content as markup", () => {
    const { container } = render(<RichText text={'Hello <script>alert(1)</script> <img src=x onerror=alert(1)>'} />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("<script>");
  });
});
