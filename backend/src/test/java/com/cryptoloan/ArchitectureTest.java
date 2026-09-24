package com.cryptoloan;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import com.tngtech.archunit.core.importer.ImportOption;import com.tngtech.archunit.junit.*;
@AnalyzeClasses(packages="com.cryptoloan",importOptions=ImportOption.DoNotIncludeTests.class)
class ArchitectureTest{@ArchTest static final com.tngtech.archunit.lang.ArchRule domain_is_framework_free=noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAnyPackage("org.springframework..","jakarta.persistence..");@ArchTest static final com.tngtech.archunit.lang.ArchRule application_does_not_use_web_or_jpa=noClasses().that().resideInAPackage("..application..").should().dependOnClassesThat().resideInAnyPackage("..adapters.in..","..adapters.out.persistence..");}

