import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const input = []
for await (const line of rl) {
	input.push(line.split(" ").filter(part => part !== ""))
}

const solutions = []
let index = 0
for (const op of input[input.length - 1]) {
	let solution = 0
	if (op === "*") {
		let acc = 1
		for (let i = 0; i < input.length - 1; i++) acc *= +input[i][index]
		solution = acc
	} else {
		let acc = 0
		for (let i = 0; i < input.length - 1; i++) acc += +input[i][index]
		solution = acc
	}
	solutions.push(solution)
	index++
}

const password = solutions.reduce((acc, s) => acc + s, 0)
console.log({ password })
