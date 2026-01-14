import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

let checked = 0
let unchecked = 0

let password = 0
let lineCount = 0
const shapes = []
const dimentions = []
const shapesCounts = []
let shape = []
const shapeCells = {}
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
		dimentions.push(chops[0].slice(0, -1).split("x"))
		shapesCounts.push(chops.slice(1).map(d => +d))
	}
}
for (let i = 0; i < shapes.length; i++) {
	let total = 0
	const shape = shapes[i]
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			if (shape[j][k] === "#") total++
		}
	}
	shapeCells[i] = total
}

function cells(shapesCount) {
	let total = 0
	for (let i = 0; i < shapesCount.length; i++) {
		const count = shapesCount[i]
		const cells = shapeCells[i]
		total += count * cells
	}
}

for (let i = 0; i < shapesCounts.length; i++) {
	const sc = shapesCounts[i]
	const area = dimentions[i][0] * dimentions[i][1]
	if (area < cells(sc)) {
		checked++
		continue
	}
	const sum = sc.reduce((acc, count) => acc + count, 0)
	const blockSpace = Math.floor(dimentions[i][0] / 3) * Math.floor(dimentions[i][1] / 3)
	if (blockSpace >= sum) {
		password++
		checked++
		continue
	}

	unchecked++
}

console.log({ checked, unchecked, length: shapesCounts.length })
