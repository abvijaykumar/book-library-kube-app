package org.abvijay.bozobooklibrary.bookinfoservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.redis.client.RedisClient;
import io.vertx.redis.client.Response;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.inject.Inject;
import javax.ws.rs.Path;
import org.abvijay.bozobooklibrary.bookinfoservice.objects.BookInfoSearchResponse;
import org.abvijay.bozobooklibrary.bookinfoservice.objects.BookItem;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.opentracing.Traced;
import org.jboss.logging.Logger;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tags;

@Traced
@Path("/bookinfo")
public class BookInfoService {

	private static final Logger LOG = Logger.getLogger(BookInfoService.class);

	@Inject
    RedisClient redisClient;

	@Inject
    MeterRegistry registry;

	@ConfigProperty(name = "book.info.service.google.book.api.url")
	String GOOGLE_API_URL;

	@ConfigProperty(name = "googleapikey")
	String GOOGLE_API_KEY;

	@ConfigProperty(name = "book.info.service.max.results.per.page")
	String MAX_RESULTS_PER_PAGE;

	public BookInfoSearchResponse searchByKeyword(String query, int page) {
		BookInfoSearchResponse resp = new BookInfoSearchResponse();
		String responseJson = "";

		registry.counter("searchByKeyword() Counter", Tags.of("keyword", query)).increment();

		try {
			String url = GOOGLE_API_URL+"?q=" + query
					+ "&key=" + GOOGLE_API_KEY
					+ "&maxResults="+MAX_RESULTS_PER_PAGE
					+ "&startIndex="+ page*10;

			LOG.info("Calling Google API with Query Key "+ query);
			
			HttpClient client = HttpClient.newHttpClient();
			HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();

			HttpResponse<String> response;
			response = client.send(request, BodyHandlers.ofString());
			responseJson = response.body();

			ObjectMapper objMapper = new ObjectMapper();
			resp = objMapper.readValue(responseJson, BookInfoSearchResponse.class);
			LOG.info("Got the response with " + resp.getTotalItems()+ " records");

			for(int i=0; i< resp.getTotalItems(); i++) {
				BookItem item = resp.getItems().get(i);
				String itemJson = objMapper.writeValueAsString(item);
				redisClient.set(Arrays.asList(item.getId(), itemJson));
			}
		} catch (Exception e) {
			responseJson = "{'error', '" + e.getMessage() + "'}";
			
			LOG.error("Error: " + responseJson);
			e.printStackTrace();
		}
		return  resp;    
	}


	public BookInfoSearchResponse getBooks(List<String> bookids) {
		BookInfoSearchResponse resp = new BookInfoSearchResponse();

		List<BookItem> items = new ArrayList<BookItem>();
		String responseJson = "";
		try {
			ObjectMapper objMapper = new ObjectMapper();
			for (int i=0; i<bookids.size(); i++) {

				Response cachedItem  = redisClient.get(bookids.get(i));
				if(cachedItem != null ) {
					LOG.info("Found the record in Cache " + cachedItem.toString());
					BookItem item = objMapper.readValue(cachedItem.toString(), BookItem.class);
					items.add(item);
				} else {
					LOG.info("Could not find in the Cache");
					
					String url = GOOGLE_API_URL + "/"+ bookids.get(i)
						+ "?key="+GOOGLE_API_KEY;
					
					LOG.info("Calling Google API with Query Key: "+ bookids.get(i));

					HttpClient client = HttpClient.newHttpClient();
					HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
					HttpResponse<String> response;
					
					response = client.send(request, BodyHandlers.ofString());
					responseJson = response.body();

					LOG.info("Got the Response JSON : " + responseJson);
					BookItem item = objMapper.readValue(responseJson, BookItem.class);
					items.add(item);

					String itemJson = objMapper.writeValueAsString(item);
					redisClient.set(Arrays.asList(item.getId(), itemJson));
				}

			}

		} catch (Exception e) {
			responseJson = "{'error', '" + e.getMessage() + "'}";
			LOG.error("Error: " + responseJson);
			e.printStackTrace();
		}
		resp.setTotalItems(items.size());
		resp.setItems(items);
		return  resp;    
	}
}