import { describe, it, expect, vi, beforeEach } from "vitest";
import { access } from "../auth/access.auth";
import { Response, NextFunction } from "express";
import * as authController from "../controllers/auth.controllers";
import { createRequest, createResponse } from "node-mocks-http";

describe("Access Middleware", () => {
  let res: Response;
  let next: NextFunction;
  
  beforeEach(() => {
    res = createResponse();
    next = vi.fn();
  });

  it("should return 200 if no token is found and should not call the next()", async () => {
    const req = createRequest({
      cookies: {},
    });

    await access(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe("OK");
  });

  it("should call next() if the token is valid", async () => {
    vi.spyOn(authController, "verifyToken").mockReturnValue({ email: "employee@gmail.com" });

    const req = createRequest({
      cookies: { token: "valid-token" }, 
    });

    await access(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.email).toBe("employee@gmail.com"); 
  });

  it("should not call next() if the token is invalid", async () => {
    vi.spyOn(authController, "verifyToken").mockReturnValue(null);

    const req = createRequest({
      cookies: { token: "invalid-token" },
    });

    await access(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });
});
