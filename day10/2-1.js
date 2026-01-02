import fs from "node:fs"
import readline from "node:readline"
import GLPK from "glpk.js"

const glpk = await GLPK()
const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

for await (const line of rl) {
	const parts = line.split(" ")
	const joltages = parts[parts.length - 1]
		.slice(1, -1)
		.split(",")
		.map(a => +a)
	const buttons = parts.splice(1, parts.length - 2).map(
		b =>
			new Set(
				b
					.slice(1, -1)
					.split(",")
					.map(d => +d)
			)
	)
	// .sort((a, b) => b.length - a.length)
	const best = solve(buttons, joltages)
	password += best
	console.log({ lineIdx, best, password })
	lineIdx++
}
console.log({ password })
