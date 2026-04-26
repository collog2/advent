import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input.txt")
const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

let checked = 0
let unchecked = 0

let password = 0
let lineCount = 0
const shapes = []
const dimentionsList = []
const shapesCounts = []
let shape = []
const shapeArea = {}
for await (const line of rl) {
	if (lineCount < 30) {
		switch (lineCount % 5) {
			case 1:
			case 2:
				shape.push(line.split(""))
				break
			case 3:
				shape.push(line.split(""))
				shapes.push(shape)
				shape = []
				break
		}
		lineCount++
	} else {
		const chops = line.split(" ")
		dimentionsList.push(
			chops[0]
				.slice(0, -1)
				.split("x")
				.map(d => +d),
		)
		shapesCounts.push(chops.slice(1).map(d => +d))
	}
}
// cache area of shapes
for (let i = 0; i < shapes.length; i++) {
	let total = 0
	const shape = shapes[i]
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			if (shape[j][k] === "#") total++
		}
	}
	shapeArea[i] = total
}

function cells(shapesCount) {
	let total = 0
	for (let i = 0; i < shapesCount.length; i++) {
		const count = shapesCount[i]
		const cells = shapeArea[i]
		total += count * cells
	}
	return total
}

function move(index, ds) {
	const reachedXWall = index[0] === ds[0] - 3
	const reachedYWall = index[1] === ds[1] - 3
	if (reachedXWall && reachedYWall) return true
	else if (reachedYWall) {
		console.log(-1)
		console.log(index)
		index[0] = 0
		index[1]++
		console.log(index)
	} else {
		console.log(1)
		console.log(index)
		index[0]++
	}
	return false
}

function solve({ sc, ds }) {
	const matrix = new Array(ds[0]).fill(new Array(ds[1]).fill("."))
	function fit(matrix, shape, index) {
		const x = index[0]
		const y = index[1]
		function doesFit() {
			// console.log("-------------------")
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					// console.log([j, k], [x, y], shape[j][k], matrix[x + j][y + k])
					if (shape[j][k] === "#" && matrix[x + j][y + k] === "#") return false
				}
			}
			// console.log("-------------------")
			return true
		}
		console.log("=-=-00--98-")

		if (doesFit()) {
			// console.log("does fit")
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < 3; k++) {
					if (shape[j][k] === "#") matrix[x + j][y + k] = "#"
				}
			}
		} else return false

		// console.log(`${matrix[x][y]}${matrix[x + 1][y]}${matrix[x + 2][y]}`)
		// console.log(`${matrix[x][y]}${matrix[x + 1][y + 1]}${matrix[x + 2][y + 2]}`)
		// console.log(`${matrix[x][y]}${matrix[x + 1][y + 1]}${matrix[x + 2][y + 2]}`)
		// console.log("-")
		// console.log("=======")
		return true
	}
	function unfit(matrix, shape, index) {
		const x = index[0]
		const y = index[1]

		for (let j = 0; j < 3; j++) {
			for (let k = 0; k < 3; k++) {
				if (shape[j][k] === "#") matrix[x + j][y + k] = "#"
			}
		}
	}
	function dfs(state) {
		let { sc, matrix, index, shapeIdx } = state
		// console.log(JSON.stringify({ sc, index, shapeIdx }, 0, 2))
		const x = index[0]
		const y = index[1]
		const xWall = matrix.length
		const yWall = matrix[0].length
		if (x > xWall - 3 || y > yWall - 3) return false
		if (matrix[x][y] === ".") {
			const isFit = fit(matrix, shapes[shapeIdx], index)
			// matrix.map(c => console.log(c.join("")))
			if (isFit) {
				// sc[shapeIdx]--
				if (sc.every(c => c === 0)) {
					return true
				}
				const reachedEnd = move(index, [xWall, yWall])
				if (reachedEnd) return false
				for (const newShapeIdx in shapes) {
					if (sc[newShapeIdx] === 0) continue
					sc[newShapeIdx]--
					if (dfs({ sc, index, shapeIdx: newShapeIdx, matrix })) return true
					sc[newShapeIdx]++
				}
				return false
			} else return false
		} else return false
	}
	let result = false
	for (const shapeIdx in shapes) {
		if (sc[shapeIdx] === 0) continue
		sc[shapeIdx]--
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[0].length; j++) {
				result = result || dfs({ sc, matrix, index: [i, j], shapeIdx })
			}
		}
		sc[shapeIdx]++
	}
	return result
}

for (let i = 0; i < shapesCounts.length; i++) {
	const sc = shapesCounts[i]
	const dimentions = dimentionsList[i]
	const area = dimentions[0] * dimentions[1]
	// if (area < cells(sc)) {
	// 	checked++
	// 	continue
	// }
	const sum = sc.reduce((acc, count) => acc + count, 0)
	const blockSpace = Math.floor(dimentions[0] / 3) * Math.floor(dimentions[1] / 3)
	if (blockSpace >= sum) {
		password++
		checked++
		continue
	}

	const d = solve({ sc, ds: dimentions })
	if (d) {
		password++
		checked++
	} else unchecked++
}

console.log({ checked, unchecked, password })
