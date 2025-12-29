import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})
let start
let splits = 0
const beams = new Set()
for await (const lineStr of rl) {
	if (!start && start !== 0) {
		start = lineStr.indexOf("S")
		beams.add(start)
		continue
	}
	const line = lineStr.split("")
	for (const beam of beams) {
		if (line[beam] !== ".") {
			splits++
			beams.add(beam + 1)
			beams.add(beam - 1)
			beams.delete(beam)
		}
	}
}

console.log({ password: splits })
