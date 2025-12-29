import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})
const input = []
for await (const line of rl) input.push(line.split(",").map(a => +a))

function distanceBetween([x1, y1, z1], [x2, y2, z2]) {
	return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2)
}

function boxToStr([x1, y1, z1]) {
	return `${x1},${y1},${z1}`
}

function pairIndex([x1, y1, z1], [x2, y2, z2]) {
	if (x1 < x2) {
		return `${x1},${y1},${z1}-${x2},${y2},${z2}`
	} else if (x2 < x1) {
		return `${x2},${y2},${z2}-${x1},${y1},${z1}`
	} else {
		// x1 === x2
		if (y1 < y2) {
			return `${x1},${y1},${z1}-${x2},${y2},${z2}`
		} else if (y2 < y1) {
			return `${x2},${y2},${z2}-${x1},${y1},${z1}`
		} else {
			// y2 === z2
			if (z1 < z2) {
				return `${x1},${y1},${z1}-${x2},${y2},${z2}`
			} else {
				return `${x2},${y2},${z2}-${x1},${y1},${z1}`
			}
		}
	}
}

function pairIndexToBoxes(index) {
	const [box1Idx, box2Idx] = index.split("-")
	return [box1Idx.split(","), box2Idx.split(",")]
}

// Calculate the distances and index them by the lower x of the pair
let boxCounter = 0
const distances = {}
const circuits = []
let maxDistance = 0
for (const box1 of input) {
	circuits.push(new Set([boxToStr(box1)]))
	for (let i = boxCounter + 1; i < input.length; i++) {
		const box2 = input[i]
		const distance = distanceBetween(box1, box2)
		const index = pairIndex(box1, box2)
		distances[index] = distance
		if (distance > maxDistance) maxDistance = distance
	}
	boxCounter++
}

// Connect boxes
const distancesEntries = Object.entries(distances).sort(([_, a], [o, b]) => a - b)
let lastPairIdx = ""
while (circuits[0].size !== input.length) {
	let newCircuit = new Set()
	const circuitIdxesToRemove = []
	const entriesIdxesToRemove = []
	let entryIdx = -1
	for (const [pair, distance] of distancesEntries) {
		entryIdx++
		const [box1Idx, box2Idx] = pair.split("-")
		const box1CircuitIdx = circuits.findIndex(c => c.has(box1Idx))
		const box2CircuitIdx = circuits.findIndex(c => c.has(box2Idx))
		if (box1CircuitIdx === box2CircuitIdx) {
			entriesIdxesToRemove.push(entryIdx)
			break
		}
		const box1Circuit = circuits[box1CircuitIdx]
		const box2Circuit = circuits[box2CircuitIdx]
		circuitIdxesToRemove.push(box1CircuitIdx, box2CircuitIdx)
		newCircuit = box1Circuit.union(box2Circuit)
		entriesIdxesToRemove.push(entryIdx)
		lastPairIdx = pair
		break
	}
	for (const id of circuitIdxesToRemove.sort((a, b) => b - a)) circuits.splice(id, 1)
	for (const id of entriesIdxesToRemove.sort((a, b) => b - a))
		distancesEntries.splice(id, 1)
	newCircuit.size && circuits.push(newCircuit)
}

const lastPairedBoxes = pairIndexToBoxes(lastPairIdx)
const password = lastPairedBoxes[0][0] * lastPairedBoxes[1][0]

console.log({ password })
