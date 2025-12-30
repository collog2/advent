import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
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
	let isFound = false
	let presses = 0
	let lastPresses = [new Array(bLength).fill(0)]
	const checked = new Set()
	const maxJoltage = joltages.toSorted((a, b) => b - a)[0]
	while (!isFound) {
		presses++
		console.log({ presses })
		const nowPresses = []
		for (let btnIdx = 0; btnIdx < bLength; btnIdx++) {
			for (let j = 0; j < lastPresses.length; j++) {
				const selection = [...lastPresses[j]]
				selection[btnIdx]++
				if (selection[btnIdx] > maxJoltage) continue
				const selecIdx = selection.join(",")
				if (checked.has(selecIdx)) continue
				const result = isCorrect(selection)
				if (result === 1) {
					isFound = true
					break
				} else if (result === -1) continue
				checked.add(selecIdx)
				nowPresses.push(selection)
			}
		}
		lastPresses = [...nowPresses]
	}
	password += presses
	console.log(presses)
}

console.log({ password })
