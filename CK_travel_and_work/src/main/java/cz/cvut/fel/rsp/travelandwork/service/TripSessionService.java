package cz.cvut.fel.rsp.travelandwork.service;

import cz.cvut.fel.rsp.travelandwork.dao.TripDao;
import cz.cvut.fel.rsp.travelandwork.dao.TripSessionDao;
import cz.cvut.fel.rsp.travelandwork.dto.TripDto;
import cz.cvut.fel.rsp.travelandwork.dto.TripSessionDto;
import cz.cvut.fel.rsp.travelandwork.exception.MissingVariableException;
import cz.cvut.fel.rsp.travelandwork.model.TripSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Service
public class TripSessionService {

    private TripSessionDao tripSessionDao;
    private TripDao tripDao;
    private final TranslateService translateService;

    @Autowired
    public TripSessionService(TripSessionDao tripSessionDao, TripDao tripDao, TranslateService translateService) {
        this.tripSessionDao = tripSessionDao;
        this.tripDao = tripDao;
        this.translateService = translateService;
    }

    @Transactional
    public List<TripSessionDto> findAllInTrip(String trip_short_name) {
        List<TripSession> tripSessions = tripSessionDao.find(trip_short_name);
        List<TripSessionDto> tripSessionDtos = new ArrayList<>();

        for (TripSession ts: tripSessions) {
            tripSessionDtos.add(translateService.translateSession(ts));
        }
        return tripSessionDtos;
    }

    @Transactional
    public void create(String tripId, TripSession tripSession) throws Exception {
        if (tripSession.getTo_date().isBefore(tripSession.getFrom_date())) throw new Exception();
        tripSession.setTrip(tripDao.find(tripId));
        tripSessionDao.persist(tripSession);
    }

    @Transactional
    public TripSession update(TripSession oldSession, TripSession newSession) throws Exception {
        if (oldSession == null || newSession==null) throw new MissingVariableException();

        oldSession.setFrom_date(newSession.getFrom_date());
        oldSession.setPrice(newSession.getPrice());
        oldSession.setTo_date(newSession.getTo_date());
        oldSession.setTrip(newSession.getTrip());
        tripSessionDao.update(oldSession);
        return oldSession;
    }

}
