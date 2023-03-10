package ar.edu.itba.paw.service;

import ar.edu.itba.paw.model.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {
    Optional<User> getUserById(long id);

    User getArtistById(long id);

    User getBandById(long id);

    User create(User.UserBuilder userBuilder);

    Optional<User> findByEmail(String email);

    void verifyUser(String token);

    void sendResetEmail(String email);

    void changePassword(String token, String newPassword);

    void resendUserVerification(String email);

    User editUser(long userId, String name, String surname, String description, boolean isAvailable,
                  List<String> roles, List<String> genres, String location);

    User updateUserLocation(String locationName, User user);

    Set<Role> getUserRoles(User user);
    Location getUserLocation(User user);

    User updateUserRoles(List<String> rolesNames, User user);

    Set<Genre> getUserGenres(User user);

    Set<SocialMedia> getUserSocialMedia(User user);

    User updateUserGenres(List<String> genreNames, User user);

    User updateProfilePicture(User user, byte[] image);

    byte[] getProfilePicture(long userId) throws IOException;

    void updateSocialMedia(long userId, Set<MediaUrl> mediaUrls);

    User setAvailable(boolean isLookingFor, User user);

    boolean isAvailable(User user);

    List<User> filter(FilterOptions filter, int page);

    int getFilterTotalPages(FilterOptions filter);

    VerificationToken getAuthRefreshToken(String email);

    User getUserByRefreshToken(String payload);

}
