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
        vk.alpha = Pairing.G1Point(uint256(0x043883bf1b6fc252a6f282f11f95ab67ad5c673d7525cc8f8860ea32b8a86aec), uint256(0x2c3199b164ccb6623e186d09df8f0b7e606286241bb574c6d19d7fea57264b2c));
        vk.beta = Pairing.G2Point([uint256(0x11efc9f7022701c0c21a11290f3160cbc377cf26bf086d12bfc2e47d76cb5be6), uint256(0x0f0c3d8b6bd59cd33babfda9e27a5741c3d999488d8e863f52e19b2fb005a595)], [uint256(0x20986f0e7198f0193d7503b6f24b14d77efb48286d1cbf53e84ea1c4b2147d39), uint256(0x1e5666cf2cbbe951f30320919d540722c8b944ea0f0fbb84528d4913227f96bd)]);
        vk.gamma = Pairing.G2Point([uint256(0x03d7fa52cf1f192a8c27aa370fcdf3717f58de1ac5dc2057aab0a90976b64a83), uint256(0x217da31ff46740d81a222bc8afd66e985f932b27e45a89f29263221992d86e10)], [uint256(0x0aab7e96dcf6ffcd22de2ecbd24ef015214f34d257cdcc77d76a1de5510391b8), uint256(0x12a1cb3f6ba305457de36a70b6f3666d1c4f913eec7972e4d955e68c14ca80c6)]);
        vk.delta = Pairing.G2Point([uint256(0x17ee229dc068a5235bb15ae84169a9f4462548aebb1c86a29a7a7c94ec481797), uint256(0x1f1601da3f639b6629c3b80903b14d70e085160e3dbbbc2aca5149c1c67a26de)], [uint256(0x1c63e52e8ed3422f3c9ee4d8d09d6d62a957a1b2640e66ed26a5782b1b36483c), uint256(0x2bc6d6db31616c3447f63a5603af3ccc3ffa36c8daddafc0272f69343330a7af)]);
        vk.gamma_abc = new Pairing.G1Point[](13);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x0c786d14f5a52bfd6280bbc1193941172e9864145d8d255f15db6c88cb8c3cc5), uint256(0x0e0f41ef8dcac9c4031af76965a5374070186ff022d332fc8a5f8f99e8e27bcb));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x2122a225c62e6ab58e42518f990ae673179303c9002bacddab3deebb4c258f5c), uint256(0x13c8434b71a8435638a9cd11ae560c1ad5639a3db5793bd2d8baa240afc3569e));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x26bf27068b4093c962c6241038e4806fecd32f400e3af5e7c845caaf443c5b2c), uint256(0x204a3094bd6944bcb02624eed273c376b82225a5c8dd78608bdb660db10f2b58));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x09c00f51869b939571f7773278d6e23c563ed09075947f5ba6d390419e2681a8), uint256(0x17b8dd7aad7560eeffb82765139cc0b4d49d4d162eaac9bd615320005ef005e0));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x2c112bdcb5e38068cba6a7c99cb7c12222d3271500ac07cea23508609c7fa809), uint256(0x07dabd2acbd336545b5298248b5bd325bed948923cc0f162a4e9af03f98b3bd3));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x1374d3d2c29a392b7bdcc7a9da1f1c04f81759f4cc1609aef8e8b5fb32775308), uint256(0x0c001b118fde354999621d1277e6973f02063bd1398c3edac6e10c21372219e7));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x1b73a15dec38f05461bc06d8ead7780eab5c2e766dd9eacb0ee21bcf78fb488e), uint256(0x0a73abe2c2ad2f6b13b7d87e229a654f5359e79d37ef0eb45c3946934f959d2e));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x24f15227794f71f9382456c68a259db36f2810ab05a0dfec52e571806108f27a), uint256(0x0a9915eb935de03721acd42f4990bd44247400a8307f7dc8d043bb0dfad99ed2));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x14efebdcbe2620245eefc493ef082b301c07bedc1f6356c95fce5fa3b93da4e2), uint256(0x0009dc45e807052f5f154be52e0923df4ec1dc08066f5f33937682bedcffcc85));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x053ea7b9d434dd2ca81c9f6853d3cbf95b0ba4d8043fe76a4fc0b8105a7cca22), uint256(0x24fdafbd3cd7cc649623bd43d8f49b45333f44aa8227267b48481efc4b51ce67));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x10724998ed7191d81e00ff22b4c16af6960f691da698775ecd9c9aeca9661b88), uint256(0x011ede8480b8439030ca212cbdfee0276b6306887f486b4ef18e60c4636e0e83));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x2c3fe0855bbd3cdcf714e7caab72ca1bb8e14a076ea8b7de9726bd86f81835e1), uint256(0x02b425c93dc1c320e33644616ffe5d3c9f2a0623a0b0c2f1b82bb1b7f7bca224));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x0e4a09c2fd265bd3cf19300e3c0063a5556f4d6bd676b3fbb0b5400174048c90), uint256(0x1b0bc32c5e974e582d27f297bc5c402538ff197f98a49a2e81075486ffb9397c));
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
