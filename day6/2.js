import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const input = []
let length = 0
let lines = 0
for await (const line of rl) {
	input.push(line)
	lines++
	if (line.length > length) length = line.length
}
const problems = []
let temp = []
let op = "+"
for (let i = length; i >= 0; i--) {
	let num = ""
	for (let j = 0; j < lines; j++) {
		const line = input[j]
		const char = line[i]
		if (!Number.isNaN(+char)) num += char
		else if (["*", "+"].includes(char)) op = char
	}
	num = num.trim()
	if (num === "" || i === 0) {
		if (i === 0) temp.push(+num)
		problems.push([...temp, op])
		temp = []
	} else temp.push(+num)
}

const solutions = []
for (const problem of problems) {
	let solution = 0
	const op = problem[problem.length - 1]
	if (op === "*") {
		let acc = 1
		for (let i = 0; i < problem.length - 1; i++) acc *= +problem[i]
		solution = acc
	} else {
		let acc = 0
		for (let i = 0; i < problem.length - 1; i++) acc += +problem[i]
		solution = acc
	}
	solutions.push(solution)
}

const password = solutions.reduce((acc, s) => acc + s, 0)
console.log({ password })
