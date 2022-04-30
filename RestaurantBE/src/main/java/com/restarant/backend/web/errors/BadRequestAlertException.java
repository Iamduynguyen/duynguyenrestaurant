package com.restarant.backend.web.errors;


import java.net.URI;
import java.util.HashMap;
import java.util.Map;

public class BadRequestAlertException {

    private static final long serialVersionUID = 1L;



    private static Map<String, Object> getAlertParameters(String entityName, String errorKey) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("message", "error." + errorKey);
        parameters.put("params", entityName);
        return parameters;
    }
}
