package ar.edu.itba.paw.webapp.controller;

import ar.edu.itba.paw.model.Audition;
import ar.edu.itba.paw.model.FilterOptions;
import ar.edu.itba.paw.model.exceptions.LocationNotFoundException;
import ar.edu.itba.paw.model.exceptions.UserNotFoundException;
import ar.edu.itba.paw.service.*;
import ar.edu.itba.paw.webapp.controller.utils.PaginationLinkBuilder;
import ar.edu.itba.paw.webapp.dto.AuditionDto;
import ar.edu.itba.paw.webapp.form.AuditionForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@Path("auditions")
@Component
public class AuditionController {

    @Autowired
    private AuditionService auditionService;

    @Autowired
    private UserService userService;

    @Context
    private UriInfo uriInfo;

    @Autowired
    private RoleService roleService;

    @Autowired
    private GenreService genreService;

    @Autowired
    private LocationService locationService;

    // TODO: Obtener usuario logueado, por ahora esta hardcodeado el ID
    @POST
    @Consumes("application/vnd.audition.v1+json")
    public Response createAudition(@Valid AuditionForm auditionForm) {
        Audition audition = auditionService.create(auditionForm.toBuilder(userService.getUserById(1)
                        .orElseThrow(UserNotFoundException::new))
                .lookingFor(roleService.getRolesByNames(auditionForm.getLookingFor()))
                .musicGenres(genreService.getGenresByNames(auditionForm.getMusicGenres()))
                .location(locationService.getLocationByName(auditionForm.getLocation())
                        .orElseThrow(LocationNotFoundException::new)));
        final URI uri = uriInfo.getAbsolutePathBuilder()
                .path(String.valueOf(audition.getId())).build();
        return Response.created(uri).build();
    }

    @GET
    @Produces("application/vnd.audition-list.v1+json")
    public Response getAuditions(@QueryParam("page") @DefaultValue("1") final int page,
                                 @QueryParam("query") @DefaultValue("") final String query,
                                 @QueryParam("genre") final List<String> genres,
                                 @QueryParam("role") final List<String> roles,
                                 @QueryParam("location")  final List<String> locations) {

        FilterOptions filter = new FilterOptions.FilterOptionsBuilder().
                withGenres(genres)
                .withRoles(roles)
                .withLocations(locations)
                .withTitle(query).build();
        List<AuditionDto> auditionDtos = auditionService.filter(filter,page).stream()
                .map(audition -> AuditionDto.fromAudition(uriInfo,audition))
                .collect(Collectors.toList());

        if(auditionDtos.isEmpty())
            return Response.noContent().build();

        Response.ResponseBuilder responseBuilder = Response.ok(new GenericEntity<List<AuditionDto>>(auditionDtos){});
        int lastPage = auditionService.getFilterTotalPages(filter);
        PaginationLinkBuilder.getResponsePaginationLinks(responseBuilder, uriInfo, page, lastPage);
        return responseBuilder.build();

    }

    // TODO: y si no esta presente? o esta closed?
    @GET
    @Path("/{id}")
    @Produces("application/vnd.audition.v1+json")
    public Response getAuditionById(@PathParam("id") final long auditionId) {
        final Audition audition = auditionService.getAuditionById(auditionId);
        return Response.ok(AuditionDto.fromAudition(uriInfo, audition)).build();
    }

}
