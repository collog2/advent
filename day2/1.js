import fs from "node:fs"

// const input = fs.readFileSync("input-test.txt", { encoding: "utf-8" })
const input = fs.readFileSync("input.txt", { encoding: "utf-8" })
const ranges = input.split(",")

let password = 0
for (const range of ranges) {
	const start = +range.split("-")[0]
	const end = +range.split("-")[1]
	for (let id = start; id <= end; id++) {
		const idStr = `${id}`
		if (idStr.length % 2 != 0) continue
		const firstHalf = +idStr.slice(0, idStr.length / 2)
		const secondHalf = +idStr.slice(idStr.length / 2)
		if (firstHalf === secondHalf) password += id
	}
}
console.log({ password })
