import { expect } from "chai";
import { getRepository } from "typeorm";
import { Address } from "../entity/Address";
import { seedAddress } from "../seed/addresses-seed";

describe("address entity", function () {
  afterEach(async () => {
    const db = getRepository(Address);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  it("should return that are 5 rows on address entity", async () => {
    await seedAddress(5);

    const totalAddresses = await getRepository(Address).count();

    expect(totalAddresses).to.eq(5);
  });
});
