import { afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ sendMail: vi.fn(), close: vi.fn(), createTransport: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: mocks.createTransport } }));
import { getEmailProvider } from "./provider";

afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
describe("Gmail results provider", () => {
  it("requires a private app password", () => {
    vi.stubEnv("EMAIL_PROVIDER", "gmail"); vi.stubEnv("GMAIL_APP_PASSWORD", "");
    expect(() => getEmailProvider()).toThrow("EMAIL_NOT_CONFIGURED");
  });
  it("sends via TLS as the HIMAP mailbox and closes the connection", async () => {
    vi.stubEnv("EMAIL_PROVIDER", "gmail"); vi.stubEnv("GMAIL_APP_PASSWORD", "abcd efgh ijkl mnop");
    mocks.createTransport.mockReturnValue(mocks);
    mocks.sendMail.mockResolvedValue({ messageId: "test-id", accepted: ["recipient@example.com"], rejected: [] });
    expect(await getEmailProvider().send({ to: "recipient@example.com", subject: "Results", html: "<p>Results</p>" })).toEqual({ id: "test-id" });
    expect(mocks.createTransport).toHaveBeenCalledWith(expect.objectContaining({ host: "smtp.gmail.com", secure: true, port: 465, auth: { user: "techandinnovationcouncil@himap.ph", pass: "abcdefghijklmnop" } }));
    expect(mocks.close).toHaveBeenCalled();
  });
  it("does not expose provider errors or report rejected mail as sent", async () => {
    vi.stubEnv("EMAIL_PROVIDER", "gmail"); vi.stubEnv("GMAIL_APP_PASSWORD", "private");
    mocks.createTransport.mockReturnValue(mocks);
    mocks.sendMail.mockRejectedValue(new Error("credential details"));
    await expect(getEmailProvider().send({ to: "recipient@example.com", subject: "Results", html: "Results" })).rejects.toThrow("EMAIL_PROVIDER_SMTP_FAILED");
    expect(mocks.close).toHaveBeenCalled();
    mocks.sendMail.mockResolvedValue({ messageId: "id", accepted: [], rejected: ["recipient@example.com"] });
    await expect(getEmailProvider().send({ to: "recipient@example.com", subject: "Results", html: "Results" })).rejects.toThrow("EMAIL_PROVIDER_SMTP_FAILED");
  });
});
