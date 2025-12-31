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
	const buttons = parts
		.splice(1, parts.length - 2)
		.map(
			b =>
				new Set(
					b
						.slice(1, -1)
						.split(",")
						.map(d => +d)
				)
		)
		.sort((a, b) => b.size - a.size)
	function isCorrect(selection) {
		for (const bIndex in selection) {
			const value = selection[bIndex]
			const button = buttons[bIndex]
			for (const jIndex of button) {
				if (value < joltages[jIndex]) return 0
				else if (value > joltages[jIndex]) return -1
			}
		}
		return 1
	}
	const bLength = buttons.length
	let presses = []
	const maxJoltage = joltages.toSorted((a, b) => b - a)[0]
	for (let btnIdx = 0; btnIdx < bLength; btnIdx++) {
		let isFound = false
		while (!isFound) {
			const tempJoltages = [...joltages]
			const button = buttons[btnIdx]
			let p
			let negative = false

			for (p = 0; p < maxJoltage && !negative; p++) {
				if (tempJoltages.some(j => j - p === 0) && tempJoltages.every(j => j >= 0)) {
					for (const jIndex of button) {
						if (tempJoltages[jIndex] < p) negative = true
						else tempJoltages[jIndex] -= p
					}
				}
			}
			p--
			console.log({ p, tempJoltages })

			if (tempJoltages.every(j => j === 0)) {
				isFound = true
				presses.push(p)
			}
		}
	}
	password += presses.reduce((acc, p) => acc + p, 0)
}
console.log({ password })
