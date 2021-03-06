package cz.cvut.fel.rsp.travelandwork.rest;

import cz.cvut.fel.rsp.travelandwork.dto.AchievementDto;
import cz.cvut.fel.rsp.travelandwork.security.SecurityUtils;
import cz.cvut.fel.rsp.travelandwork.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/achievement")
public class AchievementController {

    private final AchievementService achievementService;

    @Autowired
    public AchievementController(AchievementService achievementService) {

        this.achievementService = achievementService;
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<AchievementDto> getAllOfUser() {
        return achievementService.findAllOfUser(SecurityUtils.getCurrentUser());
    }
}
