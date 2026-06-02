import { describe, expect, it } from "vitest";
import { Container } from "#modules/container.js";

describe("Container", () => {
	it("pass", () => {
		const c = new Container("hello");
		expect(c.name).toEqual("hello");
	});
});
