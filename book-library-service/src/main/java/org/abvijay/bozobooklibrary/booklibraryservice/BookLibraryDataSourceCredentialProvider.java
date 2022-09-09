package org.abvijay.bozobooklibrary.booklibraryservice;

import io.quarkus.arc.Unremovable;
import io.quarkus.credentials.CredentialsProvider;
import java.util.HashMap;
import java.util.Map;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Named;

@ApplicationScoped
@Unremovable
@Named("booklibrary-db-credentials-provider")
public class BookLibraryDataSourceCredentialProvider  implements CredentialsProvider {
    
	@Override
	public Map<String, String> getCredentials(String credentialsProviderName) {

		Map<String, String> properties = new HashMap<>();

        String dbUser = System.getenv("dbUser");
        String dbPasswrod = System.getenv("dbPassword");


		properties.put(USER_PROPERTY_NAME, dbUser);
		properties.put(PASSWORD_PROPERTY_NAME, dbPassword);
		return properties;
	}

}