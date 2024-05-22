# Should be done only once (Trusted Plattform)
zokrates compile -i pw_proof_comp.zok
# perform the setup phase
zokrates setup

#User
# execute the program
zokrates compute-witness -a 0 1
# generate a proof of computation
zokrates generate-proof



# (not needed)
# or verify natively
zokrates verify


# export a solidity verifier
zokrates export-verifier