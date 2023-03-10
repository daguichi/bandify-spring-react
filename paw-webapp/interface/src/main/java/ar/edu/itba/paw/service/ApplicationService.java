package ar.edu.itba.paw.service;

import ar.edu.itba.paw.model.Application;
import ar.edu.itba.paw.model.ApplicationState;
import ar.edu.itba.paw.model.User;

import java.util.List;
import java.util.Optional;

public interface ApplicationService {

    List<Application> getAuditionApplicationsByState(long auditionId, ApplicationState state, int page);

    List<Application> getAuditionApplicationsByState(long auditionId, ApplicationState state);

    Application apply(long auditionId, User user, String message);

    Application accept(long auditionId, long applicantId);

    Application reject(long auditionId, long applicantId);

    Application select(long auditionId, User band, long applicantId);

    List<Application> getMyApplications(long applicantId, int page);

    int getTotalUserApplicationPages(long userId);

    int getTotalUserApplicationPagesFiltered(long userId, ApplicationState state);

    List<Application> getMyApplicationsFiltered(long applicantId, int page, ApplicationState state);

    int getTotalAuditionApplicationByStatePages(long auditionId, ApplicationState state);

    List<Application> getMyApplicationsByAuditionId(long auditionId, long applicantId);

    Optional<Application> getApplicationById(long auditionId, long applicationId) ;

    boolean closeApplicationsByAuditionId(long id);

    int getTotalUserApplicationsFiltered(long userId, ApplicationState state);

    void closeApplications(long bandId, long applicantId);

    void changeState(long auditionId, long applicationId, String state);

}
