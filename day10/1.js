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
	const machineParts = parts[0].split("")
	const machine = machineParts
		.splice(1, machineParts.length - 2)
		.reduce((acc, m, index) => (m === "#" ? [...acc, index] : acc), [])
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
		let presses = 0
		const result = new Set()
		let selection = i.toString(2)
		const space = buttons.length - selection.length
		for (let u = 0; u < space; u++) selection = "0" + selection
		for (let j = 0; j < selection.length; j++) {
			const bIndex = selection[j]
			if (bIndex === "1") {
				buttons[j].forEach(light => {
					if (result.has(light)) result.delete(light)
					else result.add(light)
				})
				presses++
			}
		}
		if (
			result.size === machine.length &&
			machine.every(m => result.has(m)) &&
			presses < lowestPresses
		)
			lowestPresses = presses
	}
	password += lowestPresses
}

console.log({ password })
