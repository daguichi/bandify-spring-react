package ar.edu.itba.paw;

import java.util.Objects;

public class User {
    private final long id;
    private final String email, password, name, surname, description;
    private final boolean isBand, isEnabled;

    private User(UserBuilder builder) {
        this.name = builder.name;
        this.surname = builder.surname;
        this.email = builder.email;
        this.password = builder.password;
        this.isBand = builder.isBand;
        this.isEnabled = builder.isEnabled;
        this.id = builder.id;
        this.description = builder.description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return getId() == user.getId() && isBand() == user.isBand() && isEnabled() == user.isEnabled() && Objects.equals(getEmail(), user.getEmail()) && Objects.equals(getPassword(), user.getPassword()) && Objects.equals(getName(), user.getName()) && Objects.equals(getSurname(), user.getSurname()) && Objects.equals(getDescription(), user.getDescription());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getEmail(), getPassword(), getName(), getSurname(), getDescription(), isBand(), isEnabled());
    }

    public long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public boolean isBand() {
        return isBand;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public String getDescription() {
        return description;
    }

    public static class UserBuilder {
        private long id;
        private final String email, name;
        private String surname, description, password;
        private final boolean isBand, isEnabled;

        public UserBuilder(String email, String password, String name, boolean isBand, boolean isEnabled) {
            this.email = email;
            this.password = password;
            this.name = name;
            this.isBand = isBand;
            this.isEnabled = isEnabled;
        }

        public UserBuilder id(long id) {
            this.id = id;
            return this;
        }

        public UserBuilder surname(String surname) {
            this.surname = surname;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder description(String description) {
            this.description = description;
            return this;
        }

        public User build() {
            if(this.name == null){
                throw new NullPointerException("The property 'name' is null.");
            }
            if(this.email == null){
                throw new NullPointerException("The property 'email' is null. ");
            }
            if(this.password == null){
                throw new NullPointerException("The property 'password' is null. ");
            }

            return new User(this);

        }

        public long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }

        public String getName() {
            return name;
        }

        public String getSurname() {
            return surname;
        }

        public boolean isBand() {
            return isBand;
        }

        public boolean isEnabled() {
            return isEnabled;
        }

        public String getDescription() {
            return description;
        }
    }
}