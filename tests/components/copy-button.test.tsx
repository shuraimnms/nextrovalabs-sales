// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton } from "@/components/shared/copy-button";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("CopyButton", () => {
  it("copies the text and confirms", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CopyButton text="Namaste sir" />);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("Namaste sir");
    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("tells the user what to do when copying is impossible", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    document.execCommand = vi.fn().mockReturnValue(false);
    render(<CopyButton text="x" />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText(/ctrl\+c/i)).toBeInTheDocument();
  });

  it("uses the legacy path when the async clipboard API rejects but execCommand works", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    document.execCommand = vi.fn().mockReturnValue(true);
    render(<CopyButton text="x" label="Copy script" />);
    await user.click(screen.getByRole("button", { name: /copy script/i }));
    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
  });
});
