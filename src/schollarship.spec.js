const { createSchoolarshipReply } = require("./schollarship");
const db = require("./queries");
const { mockSchollarships } = require("./db.mock");

describe("createSchoolarshipReply", () => {
  it("should return a message and a keyboard", async () => {
    db.getSchoolarship = jest.fn().mockReturnValue(mockSchollarships);
    await expect(createSchoolarshipReply()).resolves.toEqual(
      expect.objectContaining({
        message: expect.any(String),
        keyboard: expect.any(Object),
      })
    );
  });
});
