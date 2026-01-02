import fs from "node:fs"
import readline from "node:readline"

const fileStream = fs.createReadStream("input.txt")
// const fileStream = fs.createReadStream("input-test.txt")
const rl = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

const keyOf = arr => arr.join(",")
let password = 0
let lineIdx = 0
for await (const line of rl) {
	const parts = line.split(" ")
	const joltages = parts[parts.length - 1]
		.slice(1, -1)
		.split(",")
		.map(a => +a)
	const maxPresses = Math.max(...joltages) * joltages.length
	const buttons = parts
		.splice(1, parts.length - 2)
		.map(
			b =>
				new Set(
					b
						.slice(1, -1)
						.split(",")
						.map(d => +d)
				)
		)
		.sort((a, b) => b.size - a.size)
	let best = Infinity
	const memo = new Map()
	function dfs2(remaining, presses) {
		if (presses > maxPresses) return
		if (presses >= best) return

		const key = keyOf(remaining)
		const remSum = remaining.reduce((a, b) => a + b, 0)
		if (memo.has(key) && memo.get(key) <= remSum) return
		memo.set(key, remSum)

		if (remaining.every(v => v === 0)) {
			best = presses
			return
		}

		let jCheck = -1
		{
			let min = Infinity
			for (let i = 0; i < remaining.length; i++) {
				if (remaining[i] > 0 && remaining[i] < min) {
					min = remaining[i]
					jCheck = i
				}
			}
		}

		for (let btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
			let ok = true
			const button = buttons[btnIdx]
			if (!button.has(jCheck)) continue
			const next = remaining.slice()
			for (const jIndex of button) {
				next[jIndex]--
				if (next[jIndex] < 0) {
					ok = false
					break
				}
			}
			if (!ok) continue
			dfs2(next, presses + 1)
		}
	}

	dfs2(joltages, 0)
	password += best
	console.log({ lineIdx, best, password })
	lineIdx++
}
console.log({ password })
