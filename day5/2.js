import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input-test.txt")
const fileStream = fs.createReadStream("input.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const ranges = []

for await (const line of rl) {
	if (line === "") break
	ranges.push(line.split("-").map(s => +s))
}

for (let i = 0; i < ranges.length; i++) {
	const range = ranges[i]
	for (let j = 0; j < ranges.length; j++) {
		if (i === j) continue
		const targetRange = ranges[j]
		if (range[0] >= targetRange[0] && range[1] <= targetRange[1]) {
			range[0] = 0
			range[1] = 0
			break
		} else if (range[0] >= targetRange[0] && range[0] <= targetRange[1]) {
			targetRange[1] = range[1]
			range[0] = 0
			range[1] = 0
			break
		} else if (range[1] <= targetRange[1] && range[1] >= targetRange[0]) {
			targetRange[0] = range[0]
			range[0] = 0
			range[1] = 0
			break
		}
	}
}

let password = 0
for (const range of ranges) {
	if (range[0] === 0 && range[1] === 0) continue
	// console.log(`-------------------------`)
	console.log(range)
	password += range[1] - range[0] + 1
}
console.log({ password })
