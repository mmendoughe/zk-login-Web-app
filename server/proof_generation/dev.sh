# Should be done only once (Trusted Plattform)
zokrates compile -i proof_generation/pw_proof_comp.zok
# perform the setup phase
zokrates setup

# export a solidity verifier
zokrates export-verifier