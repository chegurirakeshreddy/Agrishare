package com.agrishare.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.DefaultCorsProcessor;

class SecurityConfigCorsTest {

    @Test
    void allowsRegistrationPreflightFromDeployedFrontend() throws Exception {
        CorsConfigurationSource source =
                new SecurityConfig().corsConfigurationSource(
                        "http://localhost:5173,http://localhost:5174,"
                                + "https://agrishare-tau.vercel.app");
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/auth/register");
        request.setMethod("OPTIONS");
        request.addHeader("Origin", "https://agrishare-tau.vercel.app");
        request.addHeader("Access-Control-Request-Method", "POST");
        request.addHeader("Access-Control-Request-Headers", "content-type");
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertTrue(new DefaultCorsProcessor().processRequest(
                source.getCorsConfiguration(request), request, response));
        assertEquals(200, response.getStatus());
        assertEquals(
                "https://agrishare-tau.vercel.app",
                response.getHeader("Access-Control-Allow-Origin"));
        assertTrue(response.getHeader("Access-Control-Allow-Methods")
                .contains("POST"));
    }
}
