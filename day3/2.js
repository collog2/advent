import fs from "node:fs"
import readline from "node:readline"

// const fileStream = fs.createReadStream("input-test.txt")
const fileStream = fs.createReadStream("input.txt")
const rlBanks = readline.createInterface({
	input: fileStream,
	crlfDelay: Infinity,
})

let password = 0
for await (const bank of rlBanks) {
	const digits = []
	let index = 0
	for (let i = 0; i < 12; i++) {
		digits.push(0)
		const remaining = bank.slice(index, i - 11 || undefined)
		let thisDigitIndex = 0
		for (const batteryIndex in remaining) {
			const batteryRating = +remaining[+batteryIndex]
			if (batteryRating > digits[i]) {
				digits[i] = batteryRating
				thisDigitIndex = +batteryIndex
			}
		}
		index += thisDigitIndex + 1
	}
	const joltage = +digits.join("")
	password += joltage
}

console.log({ password })
