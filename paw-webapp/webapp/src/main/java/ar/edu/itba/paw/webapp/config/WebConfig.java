package ar.edu.itba.paw.webapp.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.templatemode.TemplateMode;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import javax.validation.ValidatorFactory;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

@ComponentScan({"ar.edu.itba.paw.webapp.controller", "ar.edu.itba.paw.service", "ar.edu.itba.paw.persistence" })
@EnableTransactionManagement
@Configuration
@EnableAsync
@PropertySource(value= {"classpath:application.properties"})
public class WebConfig {

    private static final boolean DEPLOY = true;

    private static boolean isDeploying() {
        return DEPLOY;
    }

    @Autowired
    private Environment environment;

    @Bean
    public DataSource dataSource() {
        final SimpleDriverDataSource ds = new SimpleDriverDataSource();
        ds.setDriverClass(org.postgresql.Driver.class);

        if (isDeploying()) {
            ds.setUrl(environment.getRequiredProperty("db.deploy.url"));
            ds.setUsername(environment.getRequiredProperty("db.deploy.username"));
            ds.setPassword(environment.getRequiredProperty("db.deploy.password"));
        } else {
            ds.setUrl(environment.getRequiredProperty("db.wip.url"));
            ds.setUsername(environment.getRequiredProperty("db.wip.username"));
            ds.setPassword(environment.getRequiredProperty("db.wip.password"));
        }

        return ds;
    }

    @Bean
    public Session mailSession() {

        String host = environment.getRequiredProperty("app.mail.host");
        String mailProtocol = environment.getRequiredProperty("app.mail.protocol");
        String dport = environment.getRequiredProperty("app.mail.dport");

        Properties properties = System.getProperties();

        properties.put("mail.transport.protocol", mailProtocol);
        properties.put("mail.host", host);
        properties.put("mail.smtp.port", dport);
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.socketFactory.port", dport);
        properties.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        properties.put("mail.smtp.ssl.checkserveridentity", "true");
        properties.put("mail.smtp.socketFactory.fallback", "false");

        return Session.getInstance(properties, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(environment.getRequiredProperty("mail.username"), environment.getRequiredProperty("mail.password"));
            }
        });
    }

    @Bean
    public SpringResourceTemplateResolver templateResolver(){
        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
        templateResolver.setPrefix("classpath:mail-templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode(TemplateMode.HTML);
        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine(){
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());
        return templateEngine;
    }

    @Bean
    public MessageSource messageSource() {
        final ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:i18n/messages");
        messageSource.setDefaultEncoding(StandardCharsets.UTF_8.displayName());
        messageSource.setCacheSeconds(5);
        return messageSource;
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setDefaultEncoding("utf-8");
        multipartResolver.setMaxUploadSize(1024*1024*100);
        return multipartResolver;
    }

    @Bean
    public PlatformTransactionManager transactionManager(final EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        final LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setPackagesToScan("ar.edu.itba.paw.model");
        factoryBean.setDataSource(dataSource());
        final JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        factoryBean.setJpaVendorAdapter(vendorAdapter);
        final Properties properties = new Properties();
        properties.setProperty("hibernate.hbm2ddl.auto", "update");
        properties.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQL92Dialect");
        if(!isDeploying()) {
            properties.setProperty("hibernate.show_sql", "true");
            properties.setProperty("format_sql", "true");
        }
        factoryBean.setJpaProperties(properties);
        return factoryBean;
    }

    @Bean
    public ValidatorFactory validatorFactory() {
        return new LocalValidatorFactoryBean();
    }

    @Bean(name = "appUrl")
    public URL getAppBaseUrl() throws MalformedURLException {
        return new URL(environment.getRequiredProperty("app.protocol"),
                environment.getRequiredProperty("app.base.url"),
                Integer.parseInt(environment.getRequiredProperty("app.port")),
                environment.getRequiredProperty("app.group.directory"));
    }

    @Bean(name = "secretJWT")
    public String getAppJWTSecret() {
        return environment.getRequiredProperty("app.JWT.secret");
    }
}