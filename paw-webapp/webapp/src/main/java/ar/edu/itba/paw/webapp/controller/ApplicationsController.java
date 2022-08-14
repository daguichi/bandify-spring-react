package ar.edu.itba.paw.webapp.controller;

import ar.edu.itba.paw.model.Application;
import ar.edu.itba.paw.model.ApplicationState;
import ar.edu.itba.paw.model.exceptions.ApplicationNotFoundException;
import ar.edu.itba.paw.service.ApplicationService;
import ar.edu.itba.paw.webapp.controller.utils.PaginationLinkBuilder;
import ar.edu.itba.paw.webapp.dto.ApplicationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.util.List;
import java.util.stream.Collectors;

@Path("applications")
@Component
public class ApplicationsController {

    private final ApplicationService applicationService;

    @Context
    private UriInfo uriInfo;

    @Autowired
    public ApplicationsController(final ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GET
    @Produces("application/vnd.application-list.v1+json")
    public Response getApplications(@QueryParam("audition") final Integer auditionId,
                                    @QueryParam("user") final Integer userId,
                                    @QueryParam("page") @DefaultValue("1") final int page,
                                    @QueryParam("state") @DefaultValue("PENDING") final String state) {
        if( (auditionId == null && userId == null) || (auditionId != null && userId != null))
            throw new IllegalArgumentException();

        List<ApplicationDto> applicationDtos;
        int lastPage;
        if(auditionId != null) {
            applicationDtos =
                    applicationService.getAuditionApplicationsByState(auditionId,
                                    ApplicationState.valueOf(state), page)
                            .stream().map(application -> ApplicationDto.
                                    fromApplication(uriInfo,application)).collect(Collectors.toList());
            lastPage = applicationService.getTotalAuditionApplicationByStatePages(
                    auditionId,ApplicationState.valueOf(state));
        } else {
            applicationDtos =
                    applicationService.getMyApplicationsFiltered(userId,page,
                                    ApplicationState.valueOf(state))
                            .stream().map(application ->
                                    ApplicationDto.fromApplication(uriInfo,application))
                            .collect(Collectors.toList());
            lastPage = applicationService.getTotalUserApplicationsFiltered(userId,
                    ApplicationState.valueOf(state));
        }
        if(applicationDtos.isEmpty())
            return Response.noContent().build();

        Response.ResponseBuilder responseBuilder = Response.ok(
                new GenericEntity<List<ApplicationDto>>(applicationDtos){});
        PaginationLinkBuilder.getResponsePaginationLinks(responseBuilder, uriInfo, page, lastPage);
        return responseBuilder.build();
    }

    @GET
    @Path("/{id}")
    @Produces("application/vnd.application.v1+json")
    public Response getApplication(@PathParam("id") final long id) {
        final Application application = applicationService.getApplicationById(id)
                .orElseThrow(ApplicationNotFoundException::new);
        return Response.ok(ApplicationDto.fromApplication(uriInfo, application)).build();
    }
}
