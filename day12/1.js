import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input.txt")
const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

let lineCount = 0
const shapes = []
let shape = []
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
	} else {
	}
	lineCount++
}
console.log(shapes)
