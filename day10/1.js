import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input.txt")
const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const input = []
let sum = 0
for await (const line of rl) {
	const parts = line.split(" ")
	const machineParts = parts[0].split("")
	const machine = machineParts.splice(1, machineParts.length - 2)
	// const joltage = parts[parts.length - 1]
	const buttons = parts.splice(1, parts.length - 2).map(
		b =>
			new Set(
				b
					.slice(1, b.length - 1)
					.split(",")
					.map(d => +d)
			)
	)

	const lightStacks = Array(machine.length).fill([[]])
	const machineShapes = Array(machine.length).fill({})
	let lowestYet = Infinity
	let isRunning = true
	console.log("before while")
	while (isRunning) {
		for (let i = 0; i < machine.length; i++) {
			const light = machine[i]
			if (light === ".") {
				continue
			}
			// console.log({ i, lightStacks, machineShapes })
			// console.log("before for stack")
			for (let j = 0; j < lightStacks[i].length; j++) {
				machineShapes[`${i},${j}`] ??= {}
				machineShapes[`${i},${j}`][machine] = "eeee"
				const level = lightStacks[i][j]
				// console.log({ level })
				if (level.length > lowestYet) continue
				for (const button of buttons) {
					let tempMachine = [...machine]
					if (button.has(i)) {
						level.push(button)
						if (light === "#") tempMachine[i] = "."
						else tempMachine[i] = "#"
					}
					machineShapes[`${i},${j}`][tempMachine] = "eeee"
					// console.log({ tempMachine })
					if (tempMachine.filter(m => m !== ".").length === 0) {
						console.log({ level })
						if (lowestYet > level.length) lowestYet = level.length
						isRunning = false
					} else if (machineShapes[`${i},${j}`][tempMachine] === "eeee") isRunning = false
				}
				// lightStacks[i].push(level)
			}
			// console.log({ lightLevels })
		}
	}

	console.log({ machine, lowestYet })
}
