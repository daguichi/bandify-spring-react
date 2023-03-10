package ar.edu.itba.paw.webapp.dto;

import ar.edu.itba.paw.model.Genre;
import ar.edu.itba.paw.model.Location;
import ar.edu.itba.paw.model.Role;
import ar.edu.itba.paw.model.User;

import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

public class UserDto {
    private Long id;
    private String name;
    private String surname;
    private String description;
    private boolean isBand;
    private boolean available;
    private URI self;
    private List<String> genres;
    private List<String> roles;
    private String location;
    private URI socialMedia;
    private URI applications;
    private URI profileImage;

    public static UserDto fromUser(final UriInfo uriInfo, final User user) {
        if(user == null)
            return null;
        UserDto dto = new UserDto();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.surname = user.getSurname();
        dto.description = user.getDescription();
        dto.isBand = user.isBand();
        dto.available = user.isAvailable();
        dto.genres = user.getUserGenres().stream().map(Genre::getName).collect(Collectors.toList());
        dto.roles = user.getUserRoles().stream().map(Role::getName).collect(Collectors.toList());
        Location loc = user.getLocation();
        dto.location = loc == null ? null : loc.getName();


        final UriBuilder userUriBuilder = uriInfo.getBaseUriBuilder()
                .path("users").path(String.valueOf(user.getId()));
        dto.self = userUriBuilder.build();

        final UriBuilder socialMediaUriBuilder = uriInfo.getBaseUriBuilder()
                .path("users").path(String.valueOf(user.getId()))
                .path("social-media");
        dto.socialMedia = socialMediaUriBuilder.build();

        final UriBuilder profileImageUriBuilder = uriInfo.getBaseUriBuilder()
                .path("users").path(String.valueOf(user.getId()))
                .path("profile-image");
        dto.profileImage = profileImageUriBuilder.build();

        final UriBuilder applicationsUriBuilder = uriInfo.getBaseUriBuilder()
                .path("users").path(String.valueOf(user.getId()))
                .path("applications");
        dto.applications = applicationsUriBuilder.build();

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isBand() {
        return isBand;
    }

    public void setBand(boolean band) {
        isBand = band;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
    public URI getSelf() {
        return self;
    }

    public void setSelf(URI self) {
        this.self = self;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public URI getSocialMedia() {
        return socialMedia;
    }

    public void setSocialMedia(URI socialMedia) {
        this.socialMedia = socialMedia;
    }

    public URI getApplications() {
        return applications;
    }

    public void setApplications(URI applications) {
        this.applications = applications;
    }

    public URI getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(URI profileImage) {
        this.profileImage = profileImage;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
