import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input.txt")
const fileStream = fs.createReadStream("input-test-2.txt")
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
	input[device] = outputs
	if (outputs.includes("out")) out.push(device)
}
const devices = Object.keys(input)
const svr = input["svr"]
let paths = [["svr"]]

function dfs(path) {
	if (path.length > devices.length) return
	const possibleNextDevices = input[path[path.length - 1]]
	console.log({ path, possibleNextDevices, password })
	if (!possibleNextDevices) return
	for (const nextDevice of possibleNextDevices) {
		if (out.includes(nextDevice)) {
			if (path.includes("fft") && path.includes("dac")) {
				password++
				return [...path, nextDevice]
			} else return
		} else {
			const res = dfs([...path, nextDevice])
			if (res) return res
		}
	}
}

const res = dfs(paths[0])

// const rightPaths = []
// let possiblePaths = 0
// let running = true
// while (running) {
// const newPaths = []
// for (const path of paths) {
// 	if (path.length > devices.length) running = false
// 	const possibleNextDevices = input[path[path.length - 1]]
// 	if (!possibleNextDevices) continue

// 	const newNewPaths = []
// 	let pushNewNewPaths = true
// 	for (const nextDevice of possibleNextDevices) {
// 		if (out.includes(nextDevice)) {
// 			rightPaths.push([...path, nextDevice])
// 			if (path.includes("fft") && path.includes("dac")) password++
// 			pushNewNewPaths = false
// 			break
// 		} else newNewPaths.push([...path, nextDevice])
// 	}
// 	if (pushNewNewPaths) newPaths.push(...newNewPaths)

// 	console.log({ password, newPaths })
// }
// paths = newPaths
// }

console.log({ password, res })
