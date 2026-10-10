
package com.agrishare.backend;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/db-check")
    public Map<String, String> checkDatabase() {
        String database = jdbcTemplate.queryForObject(
            "SELECT DATABASE()", String.class
        );

        return Map.of(
            "status", "connected",
            "database", database
        );
    }
}
