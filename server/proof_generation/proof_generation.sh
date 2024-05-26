#!/bin/bash

export PATH=$PATH:/home/sophia/.zokrates/bin
# This Bash script takes two parameters and prints them.
echo "Username: $1"
echo "Password: $2"
echo "Contract Address: $3"

# # Assign arguments to variables
ARG1=$1
ARG2=$2
ARG3=$3
ARG4=$4
ARG5=$5
ARG6=$6

# Compute the witness with the second argument
zokrates compute-witness -a "$ARG2" "$ARG3" "$ARG4" "$ARG5" --verbose
if [ $? -ne 0 ]; then
    echo "Compute witness failed"
    exit 1
fi

zokrates generate-proof


echo "Witness computation successful"