package ar.edu.itba.paw.webapp.security.config;


import ar.edu.itba.paw.webapp.security.handlers.BandifyAuthenticationEntryPoint;
import ar.edu.itba.paw.webapp.security.filters.AuthFilter;
import ar.edu.itba.paw.webapp.security.handlers.BandifyAccessDeniedHandler;
import ar.edu.itba.paw.webapp.security.services.BandifyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CharacterEncodingFilter;


import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@ComponentScan({"ar.edu.itba.paw.webapp.security.services",
                "ar.edu.itba.paw.webapp.security.filters" } )
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private BandifyUserDetailsService userDetailsService;

    @Autowired
    private AuthFilter authFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new BandifyAccessDeniedHandler();
    }

    @Bean
    public BandifyAuthenticationEntryPoint authenticationEntryPoint() {
        return new BandifyAuthenticationEntryPoint();
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        filter.setForceEncoding(true);
        http
                .cors().and().csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(new BandifyAuthenticationEntryPoint())
                .accessDeniedHandler(accessDeniedHandler())
                .and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().headers()
                .cacheControl().disable()
                .and().authorizeRequests()
                .antMatchers(HttpMethod.POST, "/users", "/users/password-token", "/users/verify-tokens").anonymous()
                .antMatchers(HttpMethod.PUT, "/users/{\\d+}/**", "/users/verify-tokens/**", "/users/password-tokens/**").authenticated()
                .antMatchers(HttpMethod.GET, "/users/{\\d+}/applications").hasRole("ARTIST")
                .antMatchers(HttpMethod.POST, "/memberships").authenticated()
                .antMatchers(HttpMethod.GET, "/memberships/{\\d+}").authenticated()
                .antMatchers(HttpMethod.DELETE, "/memberships/{\\d+}").authenticated()
                .antMatchers(HttpMethod.PUT, "/memberships/{\\d+}").authenticated()
                .antMatchers(HttpMethod.GET, "/auditions/{\\d+}/applications",
                        "/{auditionId}/applications/{\\d+}").hasRole("BAND")
                .antMatchers(HttpMethod.PUT, "/auditions/{\\d+}/applications/{\\d+}").hasRole("BAND")
                .antMatchers(HttpMethod.POST, "/auditions").hasRole("BAND")
                .antMatchers(HttpMethod.POST, "/auditions/{\\d+}/applications").hasRole("ARTIST")
                .antMatchers(HttpMethod.DELETE, "/auditions/{\\d+}").hasRole("BAND")

                .antMatchers("/**").permitAll()
                .and().addFilterBefore(authFilter,
                        FilterSecurityInterceptor.class);
    }



    @Override
    public void configure(final WebSecurity web) {
        web.ignoring().antMatchers( "/css/**", "/js/**", "/images/**", "/icons/**");
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(Collections.singletonList("*"));
        cors.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        cors.setExposedHeaders(Arrays.asList("X-JWT", "X-Refresh-Token", "X-Content-Type-Options", "X-XSS-Protection", "X-Frame-Options",
                "authorization", "Location",
                "Content-Disposition", "Link"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

}
