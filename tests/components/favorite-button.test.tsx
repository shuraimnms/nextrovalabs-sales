// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const action = vi.fn();
vi.mock("@/app/actions-content", () => ({ toggleFavoriteAction: (...a: unknown[]) => action(...a) }));
import { FavoriteButton } from "@/components/shared/favorite-button";

afterEach(() => { cleanup(); action.mockReset(); });

describe("FavoriteButton", () => {
  it("toggles optimistically and syncs with the server result", async () => {
    action.mockResolvedValue({ ok: true, favorite: true });
    render(<FavoriteButton kind="script" id="abc" initial={false} />);
    const b = screen.getByRole("button", { name: /add to favourites/i });
    expect(b).toHaveAttribute("aria-pressed", "false");
    await userEvent.setup().click(b);
    await waitFor(() => expect(screen.getByRole("button", { name: /remove from favourites/i })).toHaveAttribute("aria-pressed", "true"));
    expect(action).toHaveBeenCalledWith("script", "abc");
  });

  it("rolls back when the server rejects", async () => {
    action.mockResolvedValue({ ok: false });
    render(<FavoriteButton kind="objection" id="o1" initial={false} />);
    await userEvent.setup().click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false"));
  });
});
