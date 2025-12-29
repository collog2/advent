import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const input = []
for await (const line of rl) input.push(line.split(",").map(d => +d))

function area([x1, y1], [x2, y2]) {
	return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
}

function tilesIndex(tile1, tile2) {
	if (tile1[0] > tile2[0]) {
		return `${tile2[0]},${tile2[1]}-${tile1[0]},${tile1[1]}`
	} else if (tile1[0] < tile2[0]) {
		return `${tile1[0]},${tile1[1]}-${tile2[0]},${tile2[1]}`
	} else {
		if (tile1[1] > tile2[1]) {
			return `${tile2[0]},${tile2[1]}-${tile1[0]},${tile1[1]}`
		} else if (tile1[1] < tile2[1]) {
			return `${tile1[0]},${tile1[1]}-${tile2[0]},${tile2[1]}`
		}
	}
}

const distances = {}

for (const [tile1Idx, tile1] of Object.entries(input)) {
	for (let tile2Idx = +tile1Idx + 1; tile2Idx < input.length; tile2Idx++) {
		const tile2 = input[tile2Idx]
		const index = tilesIndex(tile1, tile2)
		distances[index] = area(tile1, tile2)
	}
}

const password = Object.values(distances).reduce((acc, d) => Math.max(acc, d), 0)
console.log({ password })
