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
	const digits = [0, 0]
	const indexes = [0]
	for (const batteryIndex in bank.slice(0, -1)) {
		const batteryRating = +bank[+batteryIndex]
		if (batteryRating > digits[0]) {
			digits[0] = batteryRating
			indexes[0] = +batteryIndex
		}
	}
	for (const batteryIndex in bank) {
		if (+batteryIndex <= indexes[0]) continue
		const batteryRating = +bank[+batteryIndex]
		if (batteryRating > digits[1]) {
			digits[1] = batteryRating
		}
	}
	const joltage = +digits.join("")
	password += joltage
}

console.log({ password })
