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
        vk.alpha = Pairing.G1Point(uint256(0x299194986d74837d7f069b9fbd985957f70a988b10541f01e9f04a89836f4c44), uint256(0x07b195a92918ac58d09a10bdd71bae849ac51bb088f7e8aefc732ae59ad20048));
        vk.beta = Pairing.G2Point([uint256(0x12134abaa4e0ce429be6e965e4731feb4dc561868f9a9ccf1411b39b9523d624), uint256(0x07fac3542c6ac870d2d5b06ed60e6d3abd6d30228fd66157da7a248005d82753)], [uint256(0x211b7cb3a380cecfa09de6c9a49469ba77cb8fe5aa53c4c6fc5bac48278c6b04), uint256(0x0e41692294723ffde60d91a1dc22102d0853a37ec22585ada90179cdabd99d57)]);
        vk.gamma = Pairing.G2Point([uint256(0x2230d1125f0cab4fbda34307f1d1565e47ee62a64cf4f0b957b062152d76b799), uint256(0x051a4cfa03ae751c3adf10a7fc8239b7388c1383fb4c64345dabb6f68fb11a1c)], [uint256(0x20fe8f0193afe64a1e17781e74e31d1060aab9e263f1e40d10e8a6598d4c02e0), uint256(0x1f32808aa2c1fec45ee55d7d667b4b8a19b504c307fd4bc547fd385a2735028c)]);
        vk.delta = Pairing.G2Point([uint256(0x1572f4012759d01bee0da6441b3ca3f3e8d678900ea1eadf6139a31783d60bfe), uint256(0x2e056b215ee94fa4c8d89c351f5a7083efba851182363687f5968d505a3946dd)], [uint256(0x22e5e5918420f1c98eec01be0b872dea3c6a8bbdd5126fa28e0d485ffe3b34a9), uint256(0x1f57e460920a7e201629b0e4b465a788485355c277c2b687ea35cec2478adfa2)]);
        vk.gamma_abc = new Pairing.G1Point[](11);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x2e9a54ef52d8539a331dc2dd677a9c29f8b82b3872f956706e0a237635baf75f), uint256(0x15f45562273c6eeb77c30e7dd35fb6bd37802c93962468df8b941d77d3cc8c1f));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x25e90e13d5ce1a839482c5a6f8098dc18b4e8acafeae8d0ec6df8d9551fcce2f), uint256(0x0e8ccb5abd707db42c79aea871c59d617adb68b3d75c70bfee161c1529e1653e));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x157250fc55dca0e994ed71c280dfae8873aa9a42efac5cbe23d9c6a1e0904951), uint256(0x12bc89105196ab69921549184d29876733d37a024f842222abc57d6a142b197a));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x25cb0185adc063c8d289392b0fe488d1cbfc69639bc9985e47bd2e8890e93a81), uint256(0x2c3925b5ac3fcfa276d95f16cf99861febc61ffac701decf64a5cb2fbb8fd0bb));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x1da13fad0a3aadad676ec35b6eec975b9e13af44f8466baaa64eb6ef66166dfa), uint256(0x2f0737ed3ae57a2527c98bf1a08410f9058c4ae75518332d612843a2ac82cc34));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x0ba12fa2a0c09505e17fa51b00f33b656095110ae47a26eef04b50e8ed6e1759), uint256(0x27d1c12b0340ee4bb2efc589c515f10aa25acf1f98530f77e538c9df134949df));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x1b7360e911af9ded9326d50ffabb306efd3261481b4588e6e4d3b825269ddfdd), uint256(0x16ff0955c06ee7ecf7b0f57ac4dbc56ff3cf42b72a89ec16545d441c14eabb30));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x303cbbc37895d0ade7299865e9afe836feaba6f944261ec85a9d39622bf9b165), uint256(0x023c4fd048390914fc8f560b7024ab0867d5d9191b714410962eae38eaa1ad6f));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x0eaecf139efd8f97f0b906e1d16fa829f0d3686f148d9a03b57fcb2d6a2dc611), uint256(0x00dc39bf66ad51702815a476965d089117da7ccdfc5c7c1cf4ecc1bbdb1edd58));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x0348675c86eeb92a03bde0c92ca58ac505b9584f30130fa7c08a574b74e4ad58), uint256(0x048d439fa1fc01983ade6e301b48b16059fe338384578d9f8dfd72eb9ccde636));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x09e0c7938a0ee4cdc1704030cab0fb978997a2689588f697f4143261869b0e82), uint256(0x2ea8756dcd5ad726a1665ddbc33bce63ffab85a64098ca831f9e93b32f5fd56b));
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
            Proof memory proof, uint[10] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](10);
        
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
