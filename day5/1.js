import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input-test.txt")
const fileStream = fs.createReadStream("input.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const ranges = []
const ids = []
const freshIds = []

let mode = "ranges"
for await (const line of rl) {
	if (line === "") {
		mode = "ids"
		continue
	}
	switch (mode) {
		case "ranges":
			ranges.push(line.split("-").map(s => +s))
			break

		case "ids":
			ids.push(+line)
			break
	}
}

function isFresh(id) {
	return ranges.some(range => range[0] <= id && range[1] >= id)
}

for (const id of ids) {
	if (isFresh(id)) freshIds.push(id)
}

console.log({ password: freshIds.length })
