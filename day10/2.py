import pulp

def solve(buttons, joltages):
    prob = pulp.LpProblem("buttons", pulp.LpMinimize)

    # one variable per button: how many times pressed
    x = [
        pulp.LpVariable(f"x{i}", lowBound=0, cat="Integer")
        for i in range(len(buttons))
    ]

    # minimize total presses
    prob += pulp.lpSum(x)

    # exact joltage constraints
    for j in range(len(joltages)):
        prob += (
            pulp.lpSum(
                x[i] for i in range(len(buttons)) if j in buttons[i]
            )
            == joltages[j]
        )

    status = prob.solve(pulp.PULP_CBC_CMD(msg=False))
    if status != pulp.LpStatusOptimal:
        raise RuntimeError("No feasible solution")

    return int(pulp.value(prob.objective))


password = 0

# with open("input-test.txt") as f:
with open("input.txt") as f:
    for line_idx, line in enumerate(f):
        parts = line.strip().split(" ")

        # last token: joltage array
        joltages = list(map(int, parts[-1][1:-1].split(",")))

        # middle tokens: buttons
        buttons = []
        for b in parts[1:-1]:
            buttons.append(
                set(map(int, b[1:-1].split(",")))
            )

        presses = solve(buttons, joltages)
        password += presses

print(password)
