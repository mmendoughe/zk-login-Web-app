// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x1c083d70c50ce0b9e205b9e46b06439649f72f3783d4715d1118ccf147e96b02), uint256(0x23baab2c2d37988b64734d8477290c198a6bf5e841ccaabc194a237b4c708d69));
        vk.beta = Pairing.G2Point([uint256(0x2d0597b20cb728c6b3db96a3c3f558ac9b0c31d23167d7389c95071a0d035718), uint256(0x0e0cf52ad54ea86c395e7b861739b06e70700f9ac7c0d65066765ab4e89fa507)], [uint256(0x1d79bd9830f027b23d7ac2d15a880b6ec7d8ce640d41fcac16ad72f6c4309145), uint256(0x2a2dcbc8c5a3956eba615010b6af4baee04254e895f119eadc0aecb269f928c9)]);
        vk.gamma = Pairing.G2Point([uint256(0x062615d867332adfe44955535a4da0a23ef229433dbeba55ac54878a01d3a0b5), uint256(0x1614a4cfbfda194d742054c3d74f505c9fb829f7970fb30e13de5551ad45dfb3)], [uint256(0x06e9230fb3f75fd322adccb4c78beb1a6541894526cdeffd8e1ce708ad5cbeef), uint256(0x1dd388aa326d4afa73cbaeabee8394ca8d9e70fb8341bb601709de6ae9b2c64a)]);
        vk.delta = Pairing.G2Point([uint256(0x1510e8a05501edc7bb955e1bc3623b6d9bb5dd83fc0b3463cc16a0631f40ae82), uint256(0x2f3799b7f7da6f94da5d7a0ba1f885e26e89849b62fb741077c40edbe68aa7e7)], [uint256(0x2f3368b674957878d2996c208eae9e1004cdaba8039ff53b7d0d09a9c31b9291), uint256(0x15c84dcea48378bc2361a7df0f4751fcca07d47ef27f77e06a055e0e51b0a7e1)]);
        vk.gamma_abc = new Pairing.G1Point[](13);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x01b9314658e6f6891b86fe365d43e4cc81684611965e5cd1eb2a3ca875bd1ef1), uint256(0x0f620540f89d92c046e3014e980d8e1390c2ef6ecdfced847e4cbbaa3002ad81));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x27f423abf9051b873baac6bf88c0bef5583a15ba58805b9afcdc73e300a08c63), uint256(0x20ec438e84c07798e4c24f52664f0a494ff586e4e55fe5ada63e823ea1173226));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x1cc76c5f39563b1c3fa2db184470ade47c687fb928059b31d14ecb74c4639cb9), uint256(0x17d7f4c745598d2af985b5375ad6e48bc87933538efcc0f728709c8420ed9eaf));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x1fbfc01641a4cdbb056a69522a22d6e94c0e7290e25f63678e1bda44b08d5294), uint256(0x07e7a5ffb8b275d89a79dd213acc1cb696c3067043d95b5b7b1d0e391f1bc2e8));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x26457500e4451e4ad530368dd39ba21354fab327255a9e1444dac0307a08b87a), uint256(0x24cdf6b5d07bd55504b44977804e390b36ac26350c2acad4c9e0f4bac625b634));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x2b0b7ab775b112fc82ace9f91a315c543dfd251d82108493f3315b2d16cce52b), uint256(0x2126418c7953e5dc153dda2743c1e5e49ad5e3fbeb8b2a1df75f0cff7e918648));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x20dbb5e7ed5006516e528e4601781c4d38745b872cddb3697b3dc859aab60037), uint256(0x1256d9cbd380761a00fd5f57f81383e4763c4f25131fec9489be46066ea087dd));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x304e716fde6864cbfc53a614310bfd311bcdeeb3350d7a0d44b1e518800a7dcc), uint256(0x17a0959b328171e34c1307a803fde07568fedfabcbdde783ccf0b7d8de97d81f));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x292ea67a98927baeaec0ab546ebd890076957e9edddd56a452ec795fa303c9c4), uint256(0x2afaed56868eb60a223cb942cbf03892f7d5a0ba070bcf0d1d7436bb637db14a));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x13478ee71a204120c7a1f16b2d55f313be74a873d6f9afc07f9aa58a715522b2), uint256(0x2e4032bc7b90280e474e25f6c3b4c12c8295b17ba06988ffcbfcadd4b0f553fd));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x275f7af72bb5dfcf54f2ad0e9f363e7ef6b541ba59b335edc7154632dea61e0e), uint256(0x2c588a34faa22cb466f774224a7b796f33889256db8dbda8e1b41913d945c8a1));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x1c2d636f3defe3f2c1770f9a9cc7b5a5fe1c4fb1020950cd528b8aec7450b67c), uint256(0x1ece88bedaacd18290e40d65bd55badcf79c61a4c20612d91037a469887e167b));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x1b3c81bf5a10ee153886cc6760ddf733cdc1e66ed4aba82acc495e49fdfc6e5a), uint256(0x0d9cffc45e0c6c24cf83b1a67df9423aab936d63411b3a5e68ee448aa8e3fea6));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[12] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](12);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
