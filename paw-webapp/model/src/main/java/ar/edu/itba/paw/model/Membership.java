package ar.edu.itba.paw.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "memberships")
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "memberships_id_seq")
    @SequenceGenerator(name = "memberships_id_seq", sequenceName = "memberships_id_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artistId")
    private User artist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bandId")
    private User band;

    /* Excluding CascadeType.REMOVE */
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH,
            CascadeType.MERGE,
            CascadeType.REFRESH,
            CascadeType.PERSIST})
    @JoinTable(name = "membershipRoles",
            joinColumns = @JoinColumn(name = "membershipId"),
            inverseJoinColumns = @JoinColumn(name = "roleId")
    )
    private Set<Role> roles;

    @Column(length = 100)
    private String description;

    @Enumerated(EnumType.STRING)
    private MembershipState state;

    /* Default */ Membership() {
        // Just for Hibernate
    }

    public Membership(Builder builder) {
        this.artist = builder.artist;
        this.band = builder.band;
        this.description = builder.description;
        this.roles = builder.roles;
        this.id = builder.id;
        this.state = builder.state;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getArtist() {
        return artist;
    }

    public void setArtist(User artist) {
        this.artist = artist;
    }

    public User getBand() {
        return band;
    }

    public void setBand(User band) {
        this.band = band;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MembershipState getState() {
        return state;
    }

    public void setState(MembershipState state) {
        this.state = state;
    }

    public void edit(String description, Set<Role> roles) {
        if(roles != null) {
            this.roles = roles;
        }
        this.description = description == null? "" : description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Membership that = (Membership) o;
        return Objects.equals(getId(), that.getId()) && Objects.equals(getArtist().getId(), that.getArtist().getId()) && Objects.equals(getBand().getId(), that.getBand().getId()) && Objects.equals(getRoles(), that.getRoles()) && Objects.equals(getDescription(), that.getDescription()) && getState() == that.getState();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getArtist().getId(), getBand().getId(), getRoles(), getDescription(), getState());
    }

    public static class Builder {

        private Long id;
        private final User artist;
        private final User band;
        private Set<Role> roles;
        private String description;
        private MembershipState state;

        public Builder(User artist, User band) {
            this.artist = artist;
            this.band = band;
            this.roles = new HashSet<>();
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder roles(Set<Role> roles) {
            this.roles = roles;
            return this;
        }

        public Builder roles(Role role) {
            this.roles.add(role);
            return this;
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder state(MembershipState state) {
            this.state = state;
            return this;
        }

        public Membership build() {
            return new Membership(this);
        }

        public User getArtist() {
            return artist;
        }

        public User getBand() {
            return band;
        }

        public Set<Role> getRoles() {
            return roles;
        }

        public String getDescription() {
            return description;
        }
    }
}
