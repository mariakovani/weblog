package com.mkbff.weblog;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mkbff.weblog.entities.Category;
import com.mkbff.weblog.entities.User;
import com.mkbff.weblog.repository.CategoryRepository;
import com.mkbff.weblog.repository.PostRepository;
import com.mkbff.weblog.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class WeblogApplicationTests {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private PostRepository postRepository;

    private Category category;

    @BeforeEach
    void setUp() {
        Category music = new Category();
        music.setName("Music");
        categoryRepository.save(music);

        Category books = new Category();
        books.setName("Books");
        categoryRepository.save(books);

        Category movies = new Category();
        movies.setName("Movies");
        category = categoryRepository.save(movies);
    }

    private void register(String username) throws Exception {
        String json = "{\"username\":\"" + username + "\",\"password\":\"password123\",\"email\":\""
                + username + "@test.gr\"}";
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    private ResultActions login(String username, String password) throws Exception {
        return mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}"));
    }

    private String registerAndLogin(String username) throws Exception {
        register(username);
        String response = login(username, "password123")
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response).get("token").asText();
    }

    private Integer createPost(String token, String title) throws Exception {
        String json = "{\"title\":\"" + title + "\",\"content\":\"Some content\",\"category\":{\"id\":"
                + category.getId() + "}}";
        String response = mockMvc.perform(post("/api/posts")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response).get("id").asInt();
    }

    @Test
    void register_assignsUserRole() throws Exception {
        register("tasos");

        User tasos = userRepository.findByUsername("tasos").orElseThrow();
        assertEquals(User.Role.USER, tasos.getRole());
    }

    @Test
    void register_hashesPassword() throws Exception {
        register("thrasivoulos");

        User thrasivoulos = userRepository.findByUsername("thrasivoulos").orElseThrow();
        assertNotEquals("password123", thrasivoulos.getPassword());
    }

    @Test
    void login_correctPassword() throws Exception {
        register("iakinithi");

        login("iakinithi", "password123")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void login_wrongPassword() throws Exception {
        register("iordanis");

        login("iordanis", "wrong")
                .andExpect(status().isBadRequest());
    }

    @Test
    void anyoneCanReadPosts() throws Exception {
        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk());
    }

    @Test
    void creatingPost_withoutToken() throws Exception {
        mockMvc.perform(post("/api/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void creatingPost_withToken() throws Exception {
        String token = registerAndLogin("iosif");

        Integer id = createPost(token, "Iosif's post");

        assertEquals("iosif", postRepository.findById(id).orElseThrow().getAuthor().getUsername());
    }

    @Test
    void deletingSomeoneElsesPost() throws Exception {
        String ownerToken = registerAndLogin("angelos");
        String otherToken = registerAndLogin("soula");
        Integer id = createPost(ownerToken, "Angelos' post");

        mockMvc.perform(delete("/api/posts/" + id)
                .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isBadRequest());

        assertTrue(postRepository.existsById(id));
    }

    @Test
    void admin_canDeleteAnyPost() throws Exception {
        String ownerToken = registerAndLogin("xaralampos");
        registerAndLogin("chrishansen");

        User chrishansen = userRepository.findByUsername("chrishansen").orElseThrow();
        chrishansen.setRole(User.Role.ADMIN);
        userRepository.saveAndFlush(chrishansen);

        String response = login("chrishansen", "password123").andReturn().getResponse().getContentAsString();
        String adminToken = objectMapper.readTree(response).get("token").asText();

        Integer id = createPost(ownerToken, "Xaralampos' post");

        mockMvc.perform(delete("/api/posts/" + id)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        assertFalse(postRepository.existsById(id));
    }
}
