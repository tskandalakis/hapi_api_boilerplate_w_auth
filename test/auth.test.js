// test/auth.test.js

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { after, before, describe, it } = exports.lab = Lab.script();
const { init } = require("../src/lib/server");
const User = require("../src/model/User");
const authFunctions = require("../src/util/authFunctions");

describe("AUTH TESTS", () => {
  let server;
  let user;
  let validAccessToken;
  let validRefreshToken;
  const invalidAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMThjNmY5NDk5ZmY2NzI1MGRkMmE2OCIsImVtYWlsIjoidGFzb3NrYW5kYWxha2lzQGdtYWlsLmNvbSIsIm5hbWUiOiJUYXNvcyBTa2FuZGFsYWtpcyIsImlhdCI6MTU3ODcwMDUzOCwiZXhwIjoxNTc4NzA0MTM4fQ.6dGQZuyWWye530PKJeC9VbT-MGy4uLoWRruPR3DfqE4";
  const invalidRefreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMThlY2NiMDQ1ZGUyYzVkY2NkYWI2OSIsImlhdCI6MTU3ODk2MzkzNSwiZXhwIjoxNTc5MDUwMzM1fQ.6dGQZuyWWye530PKJeC9VbT-MGy4uLoWRruPR3DfqE4";

  before(async () => {
    server = await init();

    const testUser = new User();
    testUser.name = "Test Test";
    testUser.email = "test@test.com";
    testUser.admin = false;
    testUser.password = await authFunctions.hashPassword("testPassword");
    await testUser.save();
    user = testUser;
    validAccessToken = await authFunctions.createAccessToken(user);
    validRefreshToken = await authFunctions.createRefreshToken(user);
  });

  it("POST /api/auth/login | responds with 200 and returns object containing access_token and refresh_token strings", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "test@test.com",
        password: "testPassword"
      }
    });

    expect(res.statusCode).to.equal(201);
    expect(JSON.parse(res.payload).access_token).to.be.a.string();
    expect(JSON.parse(res.payload).refresh_token).to.be.a.string();
  });

  it("POST /api/auth/login | responds with 400 when missing required field", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "test@test.com"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("POST /api/auth/login | responds with 400 when email is wrong/doesn't exist", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "emaildoesntexist@email.com",
        password: "password"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("POST /api/auth/login | responds with 400 when password is wrong", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/login",
      payload: {
        email: "test@test.com",
        password: "wrongPassword"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("POST /api/auth/refresh | responds with 201 and new access token when valid refresh token and valid auth are used", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      auth: {
        strategy: "jwt",
        credentials: validAccessToken
      },
      payload: {
        refresh_token: validRefreshToken
      }
    });
    expect(res.statusCode).to.equal(201);
  });

  it("POST /api/auth/refresh | responds with 401 when invalid refresh token and valid auth", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      auth: {
        strategy: "jwt",
        credentials: validAccessToken
      },
      payload: {
        refresh_token: invalidRefreshToken
      }
    });
    expect(res.statusCode).to.equal(401);
  });

  it("POST /api/auth/refresh | responds with 400 when no refresh token is passed wtih valid auth", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      auth: {
        strategy: "jwt",
        credentials: validAccessToken
      },
      payload: {
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it("POST /api/auth/refresh | responds with 401 with invalid auth", async () => {
    const res = await server.inject({
      method: "post",
      url: "/api/auth/refresh",
      auth: {
        strategy: "jwt",
        credentials: invalidAccessToken
      },
      payload: {
        refresh_token: invalidRefreshToken
      }
    });
    expect(res.statusCode).to.equal(401);
  });

  after(async () => {
    await user.delete();
    await server.stop();
  });
});
