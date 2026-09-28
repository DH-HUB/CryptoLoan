package com.cryptoloan;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(packages = "com.cryptoloan", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {
    @ArchTest
    static final ArchRule domain_is_framework_free = noClasses()
        .that().resideInAPackage("..domain..")
        .should().dependOnClassesThat().resideInAnyPackage("org.springframework..", "jakarta.persistence..");

    @ArchTest
    static final ArchRule application_does_not_use_web_or_jpa = noClasses()
        .that().resideInAPackage("..application..")
        .should().dependOnClassesThat().resideInAnyPackage("..adapters.in..", "..adapters.out.persistence..");

    @ArchTest
    static final ArchRule loanposition_does_not_depend_on_loan_implementation = noClasses()
        .that().resideInAPackage("com.cryptoloan.loanposition..")
        .should().dependOnClassesThat().resideInAPackage("com.cryptoloan.loan..");
}
