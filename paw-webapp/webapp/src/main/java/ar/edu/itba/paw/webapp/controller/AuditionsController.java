package ar.edu.itba.paw.webapp.controller;

import ar.edu.itba.paw.model.Genre;
import ar.edu.itba.paw.model.Location;
import ar.edu.itba.paw.model.Role;
import ar.edu.itba.paw.model.exceptions.AuditionNotFoundException;
import ar.edu.itba.paw.model.exceptions.GenreNotFoundException;
import ar.edu.itba.paw.model.exceptions.LocationNotFoundException;
import ar.edu.itba.paw.model.exceptions.RoleNotFoundException;
import ar.edu.itba.paw.persistence.Audition;
import ar.edu.itba.paw.service.*;
import ar.edu.itba.paw.webapp.form.ApplicationForm;
import ar.edu.itba.paw.webapp.form.AuditionForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@Controller
public class AuditionsController {

    private final AuditionService auditionService;
    private final RoleService roleService;
    private final GenreService genreService;
    private final LocationService locationService;
    private final MailingService mailingService;

    @Autowired
    public AuditionsController(final AuditionService auditionService, final MailingService mailingService,
                               final GenreService genreService, final LocationService locationService,
                               final RoleService roleService ) {
        this.auditionService = auditionService;
        this.roleService = roleService;
        this.genreService = genreService;
        this.locationService = locationService;
        this.mailingService = mailingService;
    }

    @RequestMapping(value = "/auditions", method = {RequestMethod.GET})
    public ModelAndView auditions() {
        final ModelAndView mav = new ModelAndView("auditions");
        List<Audition> auditionList = auditionService.getAll(1);
        mav.addObject("auditionList", auditionList);
        return mav;
    }

    @RequestMapping(value = "/audition", method = {RequestMethod.GET})
    public ModelAndView audition(@ModelAttribute("applicationForm") final ApplicationForm applicationForm,
                                 @RequestParam(required = true) final long id) {
        final ModelAndView mav = new ModelAndView("audition");

        Optional<Audition> audition = auditionService.getAuditionById(id);
        if (audition.isPresent()) {
            mav.addObject("audition", audition.get());
        } else {
            throw new AuditionNotFoundException();
        }
        return mav;
    }

    @RequestMapping(value = "/apply", method = {RequestMethod.POST})
    public ModelAndView apply(@Valid @ModelAttribute("applicationForm") final ApplicationForm applicationForm,
                              final BindingResult errors,
                              @RequestParam(required = true) final long id ){
        if (errors.hasErrors()) {
            return audition(applicationForm,id);
        }

        // TODO: el email deberia estar dentro de auditionService
       try {
           Optional<Audition> aud = auditionService.getAuditionById(id);
           if (aud.isPresent())
               mailingService.sendAuditionEmail(aud.get().getEmail(), applicationForm.getName(),
                    applicationForm.getEmail(),applicationForm.getMessage(), LocaleContextHolder.getLocale());
        } catch (MessagingException e) {
           //TODO: IMPRESION EN LOG
            e.printStackTrace();
        }
        return new ModelAndView("redirect:/audition?id=" + id);
    }

    @RequestMapping(value = "/newAudition", method = {RequestMethod.GET})
    public ModelAndView newAudition(@ModelAttribute("auditionForm") final AuditionForm auditionForm) {
        final ModelAndView mav = new ModelAndView("auditionForm");

        List<Role> roleList = roleService.getAll();
        List<Genre> genreList = genreService.getAll();
        List<Location> locationList = locationService.getAll();

        mav.addObject("roleList", roleList);
        mav.addObject("genreList", genreList);
        mav.addObject("locationList", locationList);

        return mav;
    }

    @RequestMapping(value="/postAudition", method = {RequestMethod.POST})
    public ModelAndView postNewAudition(@Valid @ModelAttribute("auditionForm") final AuditionForm auditionForm,
                                        final BindingResult errors) {

        if(errors.hasErrors()) {
            return newAudition(auditionForm);
        }

        auditionService.create(auditionForm.toBuilder(1).
                location(locationService.getLocation(auditionForm.getLocation()).orElseThrow(LocationNotFoundException::new)).
                lookingFor(roleService.validateAndReturnRoles(auditionForm.getLookingFor())).
                musicGenres(genreService.validateAndReturnGenres(auditionForm.getMusicGenres()))
        );

        return new ModelAndView("redirect:/auditions");
    }

    @ExceptionHandler({LocationNotFoundException.class, GenreNotFoundException.class, RoleNotFoundException.class})
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    public ModelAndView badFormData() {
        return new ModelAndView("errors/404");
    }
}