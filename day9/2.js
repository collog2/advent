import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const input = []
for await (const line of rl) input.push(line.split(",").map(d => +d))

const height = input.reduce((acc, tile) => Math.max(acc, tile[0]), 0)
const width = input.reduce((acc, tile) => Math.max(acc, tile[1]), 0)

function getBorder(input) {
	const border = new Set()
	// Mark the borders
	for (let i = 0; i < input.length; i++) {
		const redTile = input[i]
		const nextTileIdx = i + 1 < input.length ? i + 1 : 0
		const nextRedTile = input[nextTileIdx]
		if (redTile[0] === nextRedTile[0]) {
			const minj = Math.min(redTile[1], nextRedTile[1])
			const maxj = Math.max(redTile[1], nextRedTile[1])
			for (let j = minj; j <= maxj; j++) {
				border.add(tileIndex([redTile[0], j]))
			}
		} else {
			// redTile[1] === nextRedLine[1]
			const maxk = Math.max(redTile[0], nextRedTile[0])
			const mink = Math.min(redTile[0], nextRedTile[0])
			for (let k = mink; k <= maxk; k++) {
				border.add(tileIndex([k, redTile[1]]))
			}
		}
	}
	return border
}

const border = getBorder(input)

function area([x1, y1], [x2, y2]) {
	return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
}

function tileIndex(tile) {
	return `${tile[0]},${tile[1]}`
}

function tilesIndex(tile1, tile2) {
	const rectangle = [tile1, tile2, [tile1[0], tile2[1]], [tile2[0], tile1[1]]]
	rectangle.sort((a, b) => {
		const xDiff = a[0] - b[0]
		if (xDiff !== 0) return xDiff
		return a[1] - b[1]
	})
	return `${rectangle[0]},${rectangle[1]},${rectangle[2]},${rectangle[3]}`
}

function draw(tile1, tile2) {
	let minx = Math.min(tile1[0], tile2[0])
	let maxx = Math.max(tile1[0], tile2[0])
	let miny = Math.min(tile1[1], tile2[1])
	let maxy = Math.max(tile1[1], tile2[1])
	for (let i = minx; i <= maxx; i++) {
		let line = ""
		for (let j = miny; j <= maxy; j++) {
			if (border.has(tileIndex([i, j]))) line += "X"
			else line += "."
		}
		console.log(line)
	}
}

function isValidRec(tile1, tile2) {
	let minx = Math.min(tile1[0], tile2[0]) + 1
	let maxx = Math.max(tile1[0], tile2[0]) - 1
	let miny = Math.min(tile1[1], tile2[1]) + 1
	let maxy = Math.max(tile1[1], tile2[1]) - 1
	// console.log({ tile1, tile2 })
	// draw(tile1, tile2)
	if (miny > maxy || minx > maxx) {
		// console.log(true)
		return true
	}

	for (let i = minx; i <= maxx; i++) {
		if (border.has(tileIndex([i, miny]))) return false
		if (border.has(tileIndex([i, maxy]))) return false
	}
	for (let j = miny; j <= maxy; j++) {
		if (border.has(tileIndex([maxx, j]))) return false
		if (border.has(tileIndex([minx, j]))) return false
	}
	// console.log(true)
	return true
}
// Measure areas of tiles with red corners
const areas = {}
const start = Date.now()
let loop = 0
for (const [tile1Idx, tile1] of Object.entries(input)) {
	for (let tile2Idx = +tile1Idx + 1; tile2Idx < input.length; tile2Idx++) {
		loop++
		if (loop % 1000 === 0) console.log({ tile: loop, elapsed: Date.now() - start })
		const tile2 = input[tile2Idx]
		if (!isValidRec(tile1, tile2)) continue
		const index = tilesIndex(tile1, tile2)
		areas[index] = area(tile1, tile2)
	}
}
const password = Object.values(areas).reduce((acc, d) => Math.max(acc, d), 0)

console.log({ password })
