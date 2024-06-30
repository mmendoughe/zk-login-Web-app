#!/bin/bash

export PATH=$PATH:/home/sophia/.zokrates/bin

Pass1=$1
Pass2=$2
Pass3=$3
Pass4=$4
User1=$5
User2=$6
User3=$7
User4=$8
Nonce1=$9
Nonce2=${10}
Nonce3=${11}
Nonce4=${12}
Hash1=${13}
Hash2=${14}

zokrates compute-witness -a "$Pass1" "$Pass2" "$Pass3" "$Pass4" "$User1" "$User2" "$User3" "$User4" "$Nonce1" "$Nonce2" "$Nonce3" "$Nonce4" "$Hash1" "$Hash2" --verbose
if [ $? -ne 0 ]; then
    echo "Compute witness failed"
    exit 1
fi

zokrates generate-proof


echo "Witness computation successful"