package ar.edu.itba.paw.webapp.controller;

import ar.edu.itba.paw.model.Genre;
import ar.edu.itba.paw.model.Location;
import ar.edu.itba.paw.model.Role;
import ar.edu.itba.paw.persistence.Audition;
import ar.edu.itba.paw.service.*;
import ar.edu.itba.paw.webapp.form.AuditionForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.validation.Valid;
import java.util.List;

@Controller
public class HomeController {
    private final AuditionService auditionService;
    private final RoleService roleService;
    private final GenreService genreService;
    private final LocationService locationService;
    private final MailingService mailingService;

    @Autowired
    public HomeController(AuditionService auditionService, RoleService roleService, GenreService genreService, LocationService locationService, MailingService mailingService) {
        this.auditionService = auditionService;
        this.roleService = roleService;
        this.genreService = genreService;
        this.locationService = locationService;
        this.mailingService = mailingService;
    }

    @RequestMapping(value = "/", method = {RequestMethod.GET})
    public ModelAndView home(@ModelAttribute("auditionForm") final AuditionForm form) {
        final ModelAndView mav = new ModelAndView("home");

        List<Audition> auditionList = auditionService.getAll(1);
        List<Role> roleList = roleService.getAll();
        List<Genre> genreList = genreService.getAll();
        List<Location> locationList = locationService.getAll();

        mav.addObject("auditionList", auditionList);
        mav.addObject("roleList", roleList);
        mav.addObject("genreList", genreList);
        mav.addObject("locationList", locationList);

        return mav;
    }

    @RequestMapping(value = "/create", method = {RequestMethod.POST})
    public ModelAndView create(@Valid @ModelAttribute("auditionForm") final AuditionForm form, final BindingResult errors) {
        if(errors.hasErrors())
            return home(form);

        auditionService.create(form.toBuilder(1).
                        location(locationService.validateAndGetLocation(form.getLocation())).
                        lookingFor(roleService.validateAndReturnRoles(form.getLookingFor())).
                        musicGenres(genreService.validateAndReturnGenres(form.getMusicGenres()))
        );
        return new ModelAndView("redirect:/");
    }

}
