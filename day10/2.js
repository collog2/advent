import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input.txt")
const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

let password = 0
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
	let lowestPresses = Number.MAX_SAFE_INTEGER
	for (let i = 0; i < 2 ** buttons.length - 1; i++) {
		let selection = i.toString(2)
		const space = buttons.length - selection.length
		for (let u = 0; u < space; u++) selection = "0" + selection
		let presses = 0
		const result = new Array(joltages.length).fill(0)
		for (let j = 0; j < selection.length; j++) {
			if (selection[i] === "0") continue
			buttons[j].forEach(leverIdx => {
				result[leverIdx] += 1
			})
			presses++
		}
		if (
			result.every((value, index) => joltages[index] === value) &&
			presses < lowestPresses
		)
			lowestPresses = presses
	}
	password += lowestPresses
	console.log(lowestPresses)
}

console.log({ password })
