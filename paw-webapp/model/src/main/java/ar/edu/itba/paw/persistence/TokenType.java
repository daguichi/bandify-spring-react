package ar.edu.itba.paw.persistence;

public enum TokenType {
    VERIFY("verify"),
    RESET("reset");

    private String type;

    TokenType(String type){
        this.type = type;
    }

    public String getType() {
        return type;
    }

}