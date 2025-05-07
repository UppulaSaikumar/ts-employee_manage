import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import app from "./index";
import http from "http";

let server: http.Server;

beforeAll((done) => {
  server = app.listen();
});

afterAll((done) => {
  server.close();
});

describe("Express App", () => {
  it("should have CORS headers set", async () => {
    const res = await request(app).options("/login");
    expect(res.headers["access-control-allow-origin"]).toBe(process.env.ORIGIN);
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});
