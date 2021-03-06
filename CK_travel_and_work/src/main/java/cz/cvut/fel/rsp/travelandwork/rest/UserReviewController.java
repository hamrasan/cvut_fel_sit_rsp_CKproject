package cz.cvut.fel.rsp.travelandwork.rest;

import cz.cvut.fel.rsp.travelandwork.dto.UserReviewDto;
import cz.cvut.fel.rsp.travelandwork.exception.NotFoundException;
import cz.cvut.fel.rsp.travelandwork.exception.UnauthorizedException;
import cz.cvut.fel.rsp.travelandwork.security.SecurityUtils;
import cz.cvut.fel.rsp.travelandwork.service.UserReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user_review")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials="true")
public class UserReviewController {

    private final UserReviewService userReviewService;

    @Autowired
    public UserReviewController(UserReviewService userReviewService) {
        this.userReviewService = userReviewService;
    }

    @PreAuthorize("hasAnyRole('ROLE_SUPERUSER', 'ROLE_ADMIN')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserReviewDto> showAll() {
        return userReviewService.findAll();
    }

    @PreAuthorize("hasAnyRole('ROLE_SUPERUSER', 'ROLE_ADMIN')")
    @GetMapping(value= "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserReviewDto> showReviewsOfUser(Long userId) throws NotFoundException {
        return userReviewService.findAllOfUser(userId);
    }

    @GetMapping(value= "/current", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<UserReviewDto> showReviewsOfCurrentUser() throws UnauthorizedException, NotFoundException {
        return userReviewService.findAllOfUser();
    }

}
