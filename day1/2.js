import fs from "node:fs"
import readline from "node:readline"
// const fileStream = fs.createReadStream("input-test.txt")
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
	const change = direction * clicks
	const before = dial
	dial += change

	let turns = Math.floor(Math.abs(dial) / 100)
	let zeros = turns

	switch (true) {
		case dial < 0:
			if (before > 0) zeros += 1
			dial = ((dial % 100) + 100) % 100
			break

		case dial === 0:
			if (before > 0) zeros += 1
			break

		case dial > 0:
			dial = dial % 100
			break
	}
	password += zeros
}

console.log({ password })
