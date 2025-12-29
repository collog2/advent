import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

let dial = 50
let password = 0
for await (const line of rl) {
	const direction = line[0] === "R" ? 1 : -1
	const clicks = Number.parseInt(line.slice(1))
	dial = (dial + direction * clicks) % 100
	if (dial === 0) password += 1
}

console.log({ password })
