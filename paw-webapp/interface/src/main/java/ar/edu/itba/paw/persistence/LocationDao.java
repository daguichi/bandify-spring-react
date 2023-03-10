package ar.edu.itba.paw.persistence;

import ar.edu.itba.paw.model.Location;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface LocationDao {
    List<Location> getAll();
    Optional<Location> getLocationByName(String name);
    Set<Location> getLocationsByNames(List<String> locationNames);
    Optional<Location> getLocationById(Long id);
}
