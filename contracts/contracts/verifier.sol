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
        vk.alpha = Pairing.G1Point(uint256(0x1b5172b3405ec77b6cd29ac571ffc62d23675b66218a3e70bcbcfbae7a62904f), uint256(0x185ab6adae5bff4623db35ed7c27a3768fc7e526944eaf01b4337e38df562d8a));
        vk.beta = Pairing.G2Point([uint256(0x266d6f77ed77c91676f9f7e635bcd52720a3f2af04c3c2b8b3c2470dc8e4c4ca), uint256(0x26f03e9c47ff6f98b58e4066fdbf5b80165f80fb90b83269cdfab0f7eb6fd127)], [uint256(0x06aabc685ec5c620c93849bea4bfb27bce10cbcd706bff018a47febd50a1e201), uint256(0x1b3e4e4f3bcc810506d1996597a4a737d2375525b2f0ad37c109c3daaf5f2183)]);
        vk.gamma = Pairing.G2Point([uint256(0x1d61dc10ec9324c25f7a0c9799e42011431e20403c2528808361d82597ceb2f2), uint256(0x160208be23d7f4355f6e8ab224c725d7c828da8d75407030a591b55789c3e2cd)], [uint256(0x10d41faa0be77335c852ef9a0534b4e65b0c3d1b960c31f877519ad3ca44d22a), uint256(0x2abbaba4452c68a12a41de00861fc4012b8d4accbb7c9b59080ee7ee132de8a5)]);
        vk.delta = Pairing.G2Point([uint256(0x16e5458b64c3a1787af929fd52116e56bace3cdce0c2c0573dfbd399f9c48bae), uint256(0x07b88047c0b161536f93d0ffe7da515bf08f4645baa848b05d2576a924134219)], [uint256(0x2abd1c13a5793811773322b492c76e4444b2bfdcfdfeda9625246c4465eaf170), uint256(0x2cdba84e0fb0ed173ed1b1a098d1fc714af67f5d63d8f056809afc364fbd6184)]);
        vk.gamma_abc = new Pairing.G1Point[](15);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x04daf49e9c5e30a1a07082f03e8f96d61df205cf760c2148701be6ddedf00681), uint256(0x0303df6b73dfe94a7c34a11d229d97559c3366bd58882f602bbeb5c83946bfc1));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x2eebe3067733e9641c0f8f850d57c3be317333ac6aad2f607306eadfa387c7ce), uint256(0x1c96dd6c740929810bd81dc3880520a232cfe96607d88a3ebab15fa1f2398b94));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x1c30766dbd77d41994bd009c7ef8c21d45e05cfea1b8505201dc0d8528afff9d), uint256(0x10cddfbf947ebe6ea9e7e40d9dbed54d3fbf1936ac54a2e39ce5a760b8297fe1));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x2fac238781dc54d88a020604f359aa8b99ceeecb8c0c0a9da189caa6c3eab835), uint256(0x23d48d3f590b5bad5091261a88433e9750eafb411fa818d74d983ba1d4c49935));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x214a23989bde0560a3a9788aa55c346d9552b2754bf54360d1403768750ad2ac), uint256(0x02f2a507e4ffb31934f014107a42312f630172841606d8a229171990829f6ba2));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x1dc4cfb7352badf0351469ad059fd99f86b02b5920653c9dd5e0c5855062139e), uint256(0x3045075deb30be451a1341bf93acef728cae8f1115dafc352527d3941b10f39d));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x1cf439421478523f618279d3c2fabfc1e0d98d0c616409bde9e2d881f0735d4c), uint256(0x1506056f05c662ed7eb104b282234875f5439f367c09914c1c5e1be75c02a26d));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x078e877931b0bab7600b3a084cb43a7602d966eebf69bdf0ffa35251973d6fc6), uint256(0x0f411c5bab42daf2c162fdab74e813ad3349d3056490d9212b1f47fb03fb7b90));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x1d7c44ea2c8f88085ee9a0184c157d176f1c054e20c7b15b6b7852aa537809df), uint256(0x2c01f0b15c631b232d41d4ce44196858c3629aed114bef0a1321161cbe85152a));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x09904381c4b133189f6475c7d50d66edc33c703d6852ab0b02cdb4d6d66489c3), uint256(0x2cf1a10a5bcf13d6113aac08c35297d8e44747c25e0561c4b0125db580a54031));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x13a8f19aeadfc59ab7130e33052a31a44af71e5ff8042a0c976ec801fea25412), uint256(0x043e6cd599a445edb02d3e807cd1d4fcc0b599bf5c3ed15a1e1616f2bdfbe980));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x1fae92099927bd7fbcba1b771a2d68bbc54baf7a0959d967fcc10461c2c9c669), uint256(0x2a03d70a040c8a0402a1f5a71980bbd14f91dad36fa1076c2615bfeaa1fd0d87));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x2dd555406315fd1e74e8d7e2f632b1a41b317c0be6bf837bb64ec46f12a52885), uint256(0x13724a3805a814e527a2e905777788a526b303ce4134ecec92500aba4e3b77fc));
        vk.gamma_abc[13] = Pairing.G1Point(uint256(0x1265d89a6a429e3b9cdabba66ecec57aeda29392d1d7b92e0e66c29eec004b91), uint256(0x094a4977902cec4da3cee9160d8011ad663aa590c99a157ea9483c4627da7edf));
        vk.gamma_abc[14] = Pairing.G1Point(uint256(0x110be3ac76b7b7052685c809c96fc5815439e50cefca16243d007fc0c3466ff3), uint256(0x0a5c69faa57f10c1c4d85e37be992b9b07db33ecf4e058b98082de81e7099be6));
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
            Proof memory proof, uint[14] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](14);
        
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
