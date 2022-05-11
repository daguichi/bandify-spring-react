package ar.edu.itba.paw.persistence;

import ar.edu.itba.paw.Application;
import ar.edu.itba.paw.ApplicationState;

import java.util.List;

public interface ApplicationDao {

    List<Application> getAuditionApplicationsByState(long auditionId, ApplicationState state, int page);

    Application createApplication(Application.ApplicationBuilder applicationBuilder);

    void setApplicationState(long auditionId, long applicantId, ApplicationState state);

    List<Application> getMyApplications(long applicantId, int page);

    boolean exists(long auditionId, long id);

    int getTotalUserApplicationPages(long userId);

    int getTotalUserApplicationPagesFiltered(long userId, ApplicationState state);

    List<Application> getMyApplicationsFiltered(long applicantId, int page, ApplicationState state);

    int getTotalAuditionApplicationsByStatePages(long auditionId, ApplicationState state);
    
}
