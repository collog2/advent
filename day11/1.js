import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})
let password = 0

const input = {}
const out = []
for await (const line of rl) {
	const parts = line.split(" ")
	const outputs = parts.slice(1)
	const device = parts[0].slice(0, -1)
	if (!outputs.includes("you")) input[device] = outputs
	if (outputs.includes("out")) out.push(device)
}
const devices = Object.keys(input)
const you = input["you"]
const paths = [...you.map(a => [a])]
for (const path of paths) {
	if (path.length > devices.length) break
	input[path[path.length - 1]]?.map(lastDevice => {
		if (out.includes(lastDevice)) password++
		else paths.push([...path, lastDevice])
	})
}

console.log({ password })
