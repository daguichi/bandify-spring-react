package ar.edu.itba.paw.webapp.form;

import ar.edu.itba.paw.webapp.form.constraints.annotations.FieldsMatch;
import ar.edu.itba.paw.webapp.form.constraints.annotations.NotDuplicatedEmail;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@FieldsMatch(field = "password", secondField = "passwordConfirmation")
public class UserForm {

    @Email
    @NotBlank
    @NotDuplicatedEmail
    private String email;

    @NotBlank
    @Size(min = 8, max = 25)
    private String password;

    @NotBlank
    @Size(min = 8, max = 25)
    private String passwordConfirmation;

    @NotBlank
    @Size(max = 50)
    private String name;

    @Size(max = 50)
    private String surname;

    @NotNull
    private boolean band;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPasswordConfirmation() {
        return passwordConfirmation;
    }

    public void setPasswordConfirmation(String passwordConfirmation) {
        this.passwordConfirmation = passwordConfirmation;
    }

    public String getSurname() {
        if (this.band)
            return null;
        return surname;
    }

    public void setSurname(String surname) {
        if (!this.band)
            this.surname = surname;
    }

    public boolean isBand() {
        return band;
    }

    public boolean getBand() {
        return band;
    }

    public void setBand(boolean band) {
        this.band = band;
    }
}
