import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input-test.txt")
const fileStream = fs.createReadStream("input.txt")
const lr = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const matrix = []
for await (const l of lr) {
	const line = l.split("")
	matrix.push(line)
}

function countPapers(lineIdx, colIdx) {
	let count = 0
	if (lineIdx > 0) {
		const line = matrix[lineIdx - 1]
		if (colIdx > 0 && line[colIdx - 1] === "@") count++
		if (line[colIdx] === "@") count++
		if (colIdx < line.length - 1 && line[colIdx + 1] === "@") count++
	}
	if (colIdx > 0) {
		if (matrix[lineIdx][colIdx - 1] === "@") count++
		if (lineIdx < matrix.length - 1 && matrix[lineIdx + 1][colIdx - 1] === "@") count++
	}
	if (lineIdx < matrix.length - 1) {
		if (matrix[lineIdx + 1][colIdx] === "@") count++
		if (colIdx < matrix[lineIdx].length - 1 && matrix[lineIdx + 1][colIdx + 1] === "@")
			count++
	}
	if (colIdx < matrix[lineIdx].length - 1 && matrix[lineIdx][colIdx + 1] === "@") count++

	return count
}

let password = 0
for (const [lineIdx, line] of Object.entries(matrix)) {
	for (const [colIdx, value] of Object.entries(line)) {
		if (value !== "@") continue
		const paperRollCount = countPapers(+lineIdx, +colIdx)
		if (paperRollCount < 4) password++
	}
}

console.log({ password })
