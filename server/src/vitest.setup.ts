import { afterEach, beforeAll } from "vitest";
import { config } from "dotenv";
import { vi } from "vitest";

beforeAll(() => {
  config();
});
afterEach(() => {
  vi.restoreAllMocks();
});
