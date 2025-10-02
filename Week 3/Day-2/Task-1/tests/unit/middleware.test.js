const validateRequest = require("../../src/middleware/validateRequest");
const auth = require("../../src/middleware/auth");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const { validationResult } = require("express-validator");

describe("validateRequest middleware", () => {
  test("calls next when no errors", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    const req = {};
    const res = {};
    const next = jest.fn();

    validateRequest(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("returns 400 when errors present", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "err" }],
    });
    const req = {};
    const json = jest.fn();
    const res = { status: jest.fn(() => ({ json })) };
    const next = jest.fn();

    validateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ errors: [{ msg: "err" }] });
  });
});

describe("auth middleware", () => {
  const jwt = require("jsonwebtoken");

  test("rejects when no token", () => {
    const req = { headers: {} };
    const json = jest.fn();
    const res = { status: jest.fn(() => ({ json })) };
    const next = jest.fn();

    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalled();
  });

  test("sets req.user when token valid", () => {
    const token = "valid.token.here";
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    const origVerify = jwt.verify;
    jwt.verify = () => ({ id: "userId123" });

    auth(req, res, next);
    expect(req.user).toEqual({ id: "userId123" });
    expect(next).toHaveBeenCalled();

    jwt.verify = origVerify;
  });
});
