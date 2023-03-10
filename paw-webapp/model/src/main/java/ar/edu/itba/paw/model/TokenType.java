package ar.edu.itba.paw.model;

public enum TokenType {
    VERIFY("verify"),
    RESET("reset"),
    REFRESH("refresh");

    private final String type;

    TokenType(String type){
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
