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
    function P1() internal pure returns (G1Point memory) {
        return G1Point(1, 2);
    }

    /// @return the generator of G2
    function P2() internal pure returns (G2Point memory) {
        return
            G2Point(
                [
                    10857046999023057135944570762232829481370756359578518086990519993285655852781,
                    11559732032986387107991004021392285783925812861821192530917403151452391805634
                ],
                [
                    8495653923123431417604973247489272438418190587263600148770280649306958101930,
                    4082367875863433681332203403145435568316851327593401208105741076214120093531
                ]
            );
    }

    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) internal pure returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0) return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }

    /// @return r the sum of two points of G1
    function addition(
        G1Point memory p1,
        G1Point memory p2
    ) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
    }

    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(
        G1Point memory p,
        uint s
    ) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
    }

    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(
        G1Point[] memory p1,
        G2Point[] memory p2
    ) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++) {
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
            success := staticcall(
                sub(gas(), 2000),
                8,
                add(input, 0x20),
                mul(inputSize, 0x20),
                out,
                0x20
            )
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
        return out[0] != 0;
    }

    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2
    ) internal view returns (bool) {
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
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2
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
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
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
struct Proof {
    Pairing.G1Point a;
    Pairing.G2Point b;
    Pairing.G1Point c;
}

/**
 * @title VerifierContract
 * @dev VerifierContract is used to call verifier.sol to verify proofs.
 */
interface VerifierContract {
    function verifyTx(
        Proof memory proof,
        uint[14] memory input
    ) external view returns (bool);
}

/**
 * @dev arrayToKey is used to convert encoded username from uint256[4] to bytes32 to use in mapping.
 */
function arrayToKey(uint256[4] memory array) pure returns (bytes32) {
    return keccak256(abi.encodePacked(array));
}

/**
 * @dev encodeAddressToUint64Array is used to convert address to uint64[4] to use in proof verification.
 */
function encodeAddressToUint64Array(address addr) pure returns (uint64[4] memory) {
        bytes20 addrBytes = bytes20(addr);
        uint64[4] memory result;
        
        for (uint i = 0; i < 4; i++) {
            uint64 part = 0;
            for (uint j = 0; j < 5; j++) {
                part = part * 256 + uint8(addrBytes[i * 5 + j]);
            }
            result[i] = part;
        }
        
        return result;
    }

/**
 * @title MappingContract
 * @dev MappingContract is used to store hashed passwords of users.
 * @notice Functions: addUser, verifyProof, changePassword
 */
contract MappingContract {
    // User struct to hold the hashed passwords, the password is split to conform with the zokrates field type.
    struct User {
        uint256 hash1;
        uint256 hash2;
    }

    // Mapping of username to hashed password.
    mapping(bytes32 => User) public users;
    address public verifierContractAddress;

    constructor(address _verifierContractAddress) {
        verifierContractAddress = _verifierContractAddress;
    }

    // Function to add a new user to the mapping
    function addUser(
        uint[4] memory usernameNum,
        uint[4] memory nonce,
        Proof memory proof,
        uint256 hash1,
        uint256 hash2
    ) external {
        // Compute key from usernameNum
        bytes32 userKey = arrayToKey(usernameNum);
        // Check is user is already in users mapping
        require(
            users[userKey].hash1 == 0 && users[userKey].hash2 == 0,
            "User already exists"
        );
        VerifierContract verifier = VerifierContract(verifierContractAddress);
        uint64[4] memory addr = encodeAddressToUint64Array(msg.sender);
        // Verify the proof of knowledge of the password
        require(
            verifier.verifyTx(
                proof,
                [
                    usernameNum[0],
                    usernameNum[1],
                    usernameNum[2],
                    usernameNum[3],
                    nonce[0],
                    nonce[1],
                    nonce[2],
                    nonce[3],
                    hash1,
                    hash2,
                    addr[0],
                    addr[1],
                    addr[2],
                    addr[3]

                ]
            ),
            "Proof verification failed"
        );
        // If the proof is verified, add the user to the mapping.
        users[userKey] = User(hash1, hash2);
    }

    // Function to verify the proof of knowledge of a password.
    function verifyProof(
        uint[4] memory usernameNum,
        uint[4] memory nonce,
        Proof memory proof
    ) public view returns (bool) {
        // Compute key from usernameNum
        bytes32 userKey = arrayToKey(usernameNum);
        // Check if user exists
        require(
            !(users[userKey].hash1 == 0 && users[userKey].hash2 == 0),
            "User does not exist"
        );

        uint64[4] memory addr = encodeAddressToUint64Array(msg.sender);
        VerifierContract verifier = VerifierContract(verifierContractAddress);
        // Verify the proof of knowledge of the password
        return
            verifier.verifyTx(
                proof,
                [
                    usernameNum[0],
                    usernameNum[1],
                    usernameNum[2],
                    usernameNum[3],
                    nonce[0],
                    nonce[1],
                    nonce[2],
                    nonce[3],
                    users[userKey].hash1,
                    users[userKey].hash2,
                    addr[0],
                    addr[1],
                    addr[2],
                    addr[3]
                ]
            );
    }

    // Function to change the password of a user
    function changePassword(
        uint[4] memory usernameNum,
        uint[4] memory nonce,
        Proof memory proof,
        uint256 hash1,
        uint256 hash2
    ) external {
        // Compute key from usernameNum
        bytes32 userKey = arrayToKey(usernameNum);
        // Check if user exists
        require(
            !(users[userKey].hash1 == 0 && users[userKey].hash2 == 0),
            "User does not exist"
        );
        uint64[4] memory addr = encodeAddressToUint64Array(msg.sender);
        VerifierContract verifier = VerifierContract(verifierContractAddress);
        // Verify the proof of knowledge of the password
        require(
            verifier.verifyTx(
                proof,
                [
                    usernameNum[0],
                    usernameNum[1],
                    usernameNum[2],
                    usernameNum[3],
                    nonce[0],
                    nonce[1],
                    nonce[2],
                    nonce[3],
                    users[userKey].hash1,
                    users[userKey].hash2,
                    addr[0],
                    addr[1],
                    addr[2],
                    addr[3]
                ]
            ),
            "Proof verification failed"
        );
        // If the proof is verified, update the password
        users[userKey].hash1 = hash1;
        users[userKey].hash2 = hash2;
    }
}
