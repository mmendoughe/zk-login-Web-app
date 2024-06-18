#!/bin/bash

export PATH=$PATH:/home/sophia/.zokrates/bin

Pass1=$1
Pass2=$2
Pass3=$3
Pass4=$4
Hash1=$5
Hash2=$6
Id=$7
Nonce=$8
Address=$9

zokrates compute-witness -a "$Pass1" "$Pass2" "$Pass3" "$Pass4" "$Hash1" "$Hash2" "$Id" "$Nonce" "$Address" --verbose
if [ $? -ne 0 ]; then
    echo "Compute witness failed"
    exit 1
fi

zokrates generate-proof


echo "Witness computation successful"