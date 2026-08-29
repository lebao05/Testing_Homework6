FUNCTION GenerateTests(apiSpecification, targetEndpoints):

    specification ← Read(apiSpecification)

    apiDocument ← ParseSpecification(specification)

    IF apiDocument is invalid:
        RETURN "Invalid API specification"


    selectedEndpoints ← EMPTY LIST


    FOR EACH targetEndpoint IN targetEndpoints:

        endpoint ← FindEndpoint(
            apiDocument,
            targetEndpoint.method,
            targetEndpoint.path
        )

        IF endpoint does not exist:

            ReportEndpointNotFound(targetEndpoint)

        ELSE:

            selectedEndpoints.ADD(endpoint)

        END IF

    END FOR


    IF selectedEndpoints is empty:

        RETURN "No valid endpoints selected"


    Initialize testcases.md
    Initialize tests.json
    Initialize postman_collection.json


    FOR EACH endpoint IN selectedEndpoints:

        contract ← UnderstandAPIContract(endpoint)

        tests ← EMPTY LIST


        // Domain testing

        tests.ADD(
            GenerateDomainPartitionTests(
                contract
            )
        )


        // Boundary testing

        tests.ADD(
            GenerateBoundaryTests(
                contract
            )
        )


        // Required / optional fields

        tests.ADD(
            GenerateValidationTests(
                contract
            )
        )


        // State testing

        IF IsStateful(contract):

            tests.ADD(
                GenerateStateTransitionTests(
                    contract
                )
            )

            IF IsOrderCancellationAPI(contract):

                tests.ADD(
                    GenerateCancellationTests(
                        contract
                    )
                )

            END IF

        END IF


        // Security testing

        tests.ADD(
            GenerateSecurityTests(
                contract,
                [
                    SEC-01,
                    SEC-02,
                    SEC-03,
                    SEC-04,
                    SEC-05,
                    SEC-06,
                    SEC-07
                ]
            )
        )


        // Schema testing

        tests.ADD(
            GenerateResponseSchemaTests(
                contract
            )
        )


        // Remove duplicates

        tests ← RemoveDuplicates(tests)


        // Coverage repair

        WHILE Count(tests) < 35:

            missingCoverage ←
                IdentifyMissingCoverage(
                    contract,
                    tests
                )

            additionalTests ←
                GenerateTestsForMissingCoverage(
                    contract,
                    missingCoverage
                )

            tests.ADD(additionalTests)

            tests ← RemoveDuplicates(tests)

        END WHILE


        // Validate final test set

        tests ← ValidateTestCases(
            tests,
            contract
        )


        AssignUniqueIDs(
            tests,
            contract
        )


        coverage ← AnalyzeCoverage(
            contract,
            tests
        )


        // Generate Markdown

        AppendMarkdown(
            "testcases.md",
            contract,
            tests,
            coverage
        )


        // Generate tests.json

        AppendTestsJSON(
            "tests.json",
            contract,
            tests
        )


        // Generate Postman collection

        postmanRequests ←
            ConvertTestsToPostman(
                contract,
                tests
            )

        AppendPostmanRequests(
            "postman_collection.json",
            postmanRequests
        )

    END FOR


    ValidateOutputFiles()

    RETURN {
        "testcases": "testcases.md",
        "tests": "tests.json",
        "postman": "postman_collection.json"
    }

END FUNCTION