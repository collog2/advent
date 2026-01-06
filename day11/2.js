import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test-2.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const input = {}
const out = ["out"]
for await (const line of rl) {
	const parts = line.split(" ")
	const outputs = parts.slice(1)
	const device = parts[0].slice(0, -1)
	input[device] = outputs
	if (outputs.includes("out")) out.push(device)
}
const devices = Object.keys(input)
const svr = input["svr"]

function dfs(path) {
	if (path.length > devices.length) return
	const possibleNextDevices = input[path[path.length - 1]]
	if (!possibleNextDevices) return
	for (const nextDevice of possibleNextDevices) {
		if (out.includes(nextDevice)) {
			if (path.includes("fft") && path.includes("dac")) {
				password++
				return true
			}
			continue
		} else {
			const found = dfs([...path, nextDevice])
			if (found) return false
		}
	}

	return false
}

function dfsIterative(start) {
	const stack = [[start]]

	while (stack.length) {
		const path = stack.pop()

		if (path.length > devices.length) continue

		const last = path[path.length - 1]
		const possibleNextDevices = input[last]
		if (!possibleNextDevices) continue

		for (const nextDevice of possibleNextDevices) {
			if (out.includes(nextDevice)) {
				if (path.includes("fft") && path.includes("dac")) {
					password++
				}
				continue
			}

			stack.push([...path, nextDevice])
		}
	}
}
let password = 0
const routeCount = {}
function allRoutesBetween0(start, end) {
	const index = `${start}-${end}`
	if (routeCount[index]) return routeCount[index]
	let routes = 0
	const possibleNextDevices = input[start]
	if (!possibleNextDevices) {
		routeCount[index] = 0
		return 0
	}
	for (const nextDevice of possibleNextDevices) {
		if (nextDevice === end) {
			routes++
			continue
		}
		const nextRoutes = allRoutesBetween(nextDevice, end)
		routes += nextRoutes
	}
	routeCount[index] = routes
	return routes
}

function dfsIterativeMemo(start) {
	const stack = [start]
	let outCount = 0
	while (stack.length) {
		const pathStr = stack.pop()
		const path = pathStr.split(",")
		const device = path[path.length - 1]
		const possibleNextDevices = input[device]
		console.log({ pathStr, outCount, password, possibleNextDevices })
		if (!possibleNextDevices) continue

		for (const nextDevice of possibleNextDevices) {
			if (nextDevice === "out") {
				outCount++
				if (path.filter(c => ["fft", "dac"].includes(c)).length === 2) {
					// count[nextDevice] ??= 0
					// count[nextDevice] += 1
					password++
				}
				continue
			}

			stack.push([...path, nextDevice].join(","))
		}
	}
}

function allRoutesBetween(start, end) {
	const memo = Object.create(null)
	const stack = [[start, false]]

	while (stack.length) {
		const [node, processed] = stack.pop()

		if (memo[node] !== undefined) continue

		if (processed) {
			let sum = 0
			for (const next of input[node] ?? []) {
				sum += next === end ? 1 : memo[next] ?? 0
			}
			memo[node] = sum
		} else {
			stack.push([node, true])
			for (const next of input[node] ?? []) {
				if (next !== end && memo[next] === undefined) {
					stack.push([next, false])
				}
			}
		}
	}

	return memo[start] ?? 0
}

console.log("0/6")
const svrToA = allRoutesBetween("svr", "fft")
console.log("1/6")
console.log({ svrToA })
const AToB = allRoutesBetween("fft", "dac")
console.log("2/6")
console.log({ AToB })
const BToOut = allRoutesBetween("dac", "out")
console.log("3/6")
console.log({ BToOut })
const svrToB = allRoutesBetween("svr", "dac")
console.log("4/6")
console.log({ svrToB })
const BToA = allRoutesBetween("dac", "fft")
console.log("5/6")
console.log({ BToA })
const AToOut = allRoutesBetween("fft", "out")
console.log("6/6")
console.log({ svrToA, AToB, BToOut, svrToB, BToA, AToOut })
console.log(`${svrToA * AToB * BToOut} + ${svrToB * BToA * AToOut}`)
console.log({ password: svrToA * AToB * BToOut + svrToB * BToA * AToOut })

// 47
// 117 too low
