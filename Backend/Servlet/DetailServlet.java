package controller;
import model.StoreLocation;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import util.DBConnection;
import java.util.Base64;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
@WebServlet("/DetailServlet")
public class DetailServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = DBConnection.getConnection();	
	public JSONArray products = new JSONArray();
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    String action = request.getParameter("action");
	    // Kiểm tra action không bị null
	    if ("detail".equals(action)) 
	    {
	        PrintWriter out = response.getWriter();
	        out.print(products.getJSONObject(Integer.parseInt(request.getParameter("id"))).toString());
	    } 
	    else if ("product".equals(action)) 
	    {
	    	int storeID = 1;
			 Cookie[] cookies = request.getCookies();
		    if (cookies != null) {
		        for (Cookie cookie : cookies) {
		            if ("StoreID".equals(cookie.getName())) {
		                String username = cookie.getValue(); // Lấy giá trị của cookie
		                // Xử lý với giá trị cookie
		                storeID = Integer.parseInt(username);
		            }
		        }
		    }
	    	PrintWriter out = response.getWriter();
	    	try {
	            String query = "SELECT * FROM products where sid=?";
	            PreparedStatement ps = connection.prepareStatement(query);
	            ps.setInt(1, storeID);
	            ResultSet rs = ps.executeQuery();
	            products.clear();
	            while (rs.next()) {
	                JSONObject jsonObject = new JSONObject();
	                jsonObject.put("id", rs.getInt("id"));
	                jsonObject.put("name", rs.getString("name"));
	                jsonObject.put("quantity", rs.getInt("quantity"));
	                jsonObject.put("type", rs.getInt("type"));
	                jsonObject.put("tag", rs.getInt("tag"));
	                jsonObject.put("price", rs.getInt("price"));
	                Blob blob = rs.getBlob("image");
	                byte[] imageBytes = blob.getBytes(1, (int) blob.length());
	                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
	                jsonObject.put("image", "data:image/jpeg;base64," + base64Image);
	                products.put(jsonObject);
	            }
	            // Đóng ResultSet và PreparedStatement
	            rs.close();
	            ps.close();

	        } catch (NumberFormatException e) {
	            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	            out.print("{\"error\":\"Invalid 'id' format\"}");
	        } catch (Exception e) {
	            e.printStackTrace();
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            out.print("{\"error\":\"An error occurred on the server\"}");
	        } finally {
	            out.close();
	        }
	    }
	    else if ("list".equals(action)) 
	    {
	    	PrintWriter out = response.getWriter();
	        out.print(products.toString());
	    }
}

 
 protected void doPost(HttpServletRequest request, HttpServletResponse response) throws
 ServletException, IOException 
 {	 
	 
}
}