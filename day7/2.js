import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})
let start
const beams = new Set()
let lineIdx = 0
const ways = {}

for await (const lineStr of rl) {
	if (lineIdx === 0) {
		start = lineStr.indexOf("S")
		beams.add(start)
		ways[start] = 1
		lineIdx++
		continue
	}
	const line = lineStr.split("")
	for (const beam of [...beams]) {
		if (line[beam] !== ".") {
			ways[beam + 1] ??= 0
			ways[beam + 1] += ways[beam]
			ways[beam - 1] ??= 0
			ways[beam - 1] += ways[beam]
			delete ways[beam]

			beams.add(beam + 1)
			beams.add(beam - 1)
			beams.delete(beam)
		}
	}
	lineIdx++
}
const password = Object.values(ways).reduce((acc, h) => acc + h, 0)

console.log({ password })
