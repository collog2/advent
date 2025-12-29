import fs from "node:fs"

// const input = fs.readFileSync("input-test.txt", { encoding: "utf-8" })
const input = fs.readFileSync("input.txt", { encoding: "utf-8" })
const ranges = input.split(",")

function rootsOf(num) {
	const roots = []
	for (let i = 1; i <= num / 2; i++) {
		if (num % i === 0) roots.push(i)
	}
	return roots
}

function isPatternOf(str, pattern) {
	if (str.length % pattern.length !== 0) return false
	const tiles = str.length / pattern.length
	let extendedStr = ""
	for (let i = 0; i < tiles; i++) extendedStr += pattern
	return str === extendedStr
}

let password = 0
let index = 0
for (const range of ranges) {
	index++
	const start = +range.split("-")[0]
	const end = +range.split("-")[1]
	for (let id = start; id <= end; id++) {
		const idStr = `${id}`
		const roots = rootsOf(idStr.length)
		for (const root of roots) {
			const pattern = idStr.slice(0, root)
			if (isPatternOf(idStr, pattern)) {
				password += id
				break
			}
		}
	}
}
console.log({ password })
