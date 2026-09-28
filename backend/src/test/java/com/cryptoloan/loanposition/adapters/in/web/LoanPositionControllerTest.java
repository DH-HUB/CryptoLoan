package com.cryptoloan.loanposition.adapters.in.web;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.cryptoloan.loanposition.domain.port.in.LoanPositionUseCase;
import com.cryptoloan.loanposition.domain.model.LoanPositionSummary;
import com.cryptoloan.shared.security.AuthenticatedUser;
import com.cryptoloan.shared.security.JwtTokenService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(LoanPositionController.class)
class LoanPositionControllerTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private LoanPositionUseCase useCase;

    @MockBean
    private JwtTokenService jwtTokenService;

    @Test
    void rejectsAnonymousRequests() throws Exception {
        mvc.perform(get("/api/portfolio/summary"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void usesAuthenticatedUserEvenIfAnEmailParameterIsSupplied() throws Exception {
        AuthenticatedUser user = new AuthenticatedUser(
            "alice@example.com",
            "Alice",
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        var authentication = new UsernamePasswordAuthenticationToken(user, "token", user.authorities());
        given(useCase.summaryFor("alice@example.com")).willReturn(new LoanPositionSummary(
            2,
            0,
            2,
            0,
            new BigDecimal("3000"),
            new BigDecimal("3000"),
            List.of(new LoanPositionSummary.CollateralSummary("BTC", new BigDecimal("0.30")))
        ));

        mvc.perform(get("/api/portfolio/summary")
                .param("email", "bob@example.com")
                .with(authentication(authentication)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalLoans").value(2))
            .andExpect(jsonPath("$.approvedLoans").value(2))
            .andExpect(jsonPath("$.outstandingEur").value(3000))
            .andExpect(jsonPath("$.collateralByCrypto[0].symbol").value("BTC"));

        then(useCase).should().summaryFor("alice@example.com");
    }
}
