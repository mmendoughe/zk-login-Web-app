#navigate to correct folder
cd server

# Should be done only once (Trusted Plattform)
zokrates compile -i proof_generation/proof_gen.zok
# perform the setup phase
zokrates setup

# export a solidity verifier
zokrates export-verifier -o ../contracts/contracts/verifier.sol