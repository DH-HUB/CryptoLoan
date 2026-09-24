package com.cryptoloan.contract.application;import static org.junit.jupiter.api.Assertions.*;import java.nio.charset.StandardCharsets;import org.junit.jupiter.api.Test;class ContractServiceTest{@Test void hashIsStable(){assertEquals("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",ContractService.sha256("abc".getBytes(StandardCharsets.UTF_8)));}}

