#!/bin/bash

Pass1=$1
Pass2=$2
Pass3=$3
Pass4=$4
NewPass1=$5
NewPass2=$6
NewPass3=$7
NewPass4=$8
User1=$9
User2=${10}
User3=${11}
User4=${12}
Nonce1=${13}
Nonce2=${14}
Nonce3=${15}
Nonce4=${16}
Hash1=${17}
Hash2=${18}
NewHash1=${19}
NewHash2=${20}

zokrates compute-witness -a "$Pass1" "$Pass2" "$Pass3" "$Pass4" "$NewPass1" "$NewPass2" "$NewPass3" "$NewPass4" "$User1" "$User2" "$User3" "$User4" "$Nonce1" "$Nonce2" "$Nonce3" "$Nonce4" "$Hash1" "$Hash2" "$NewHash1" "$NewHash2" --verbose
if [ $? -ne 0 ]; then
    echo "Compute witness failed"
    exit 1
fi

zokrates generate-proof


echo "Witness computation successful"