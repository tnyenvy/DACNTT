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
import javax.servlet.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@WebServlet("/Signup")
public class Signup extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = DBConnection.getConnection();	
	public JSONObject user = new JSONObject();
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    String email = request.getParameter("email");
	    String password = request.getParameter("password");
	    String name = request.getParameter("name");	    
	    PrintWriter out = response.getWriter();
	    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	    JSONObject responseJson = new JSONObject();
	    String sql = "SELECT 1 FROM customer WHERE email = ? LIMIT 1";
	    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
	    	stmt.setString(1, email);
	        ResultSet rs = stmt.executeQuery();

	        if (rs.next()) 
	        {
	        	responseJson.put("success", false);
		        responseJson.put("message", "0");
	        }
	        else
	        {
	            sql = "INSERT INTO customer (name, email, address, phoneNumber, password) VALUES (?, ?, '', '', ?);";
	            try (PreparedStatement stmt2 = connection.prepareStatement(sql)) {
	            	stmt2.setString(1, name);
	    	    	stmt2.setString(2, email);
	    	    	stmt2.setString(3, passwordEncoder.encode(password));
	                stmt2.executeUpdate();
	                stmt2.close();
	            }	            
	            responseJson.put("success", true);
		        responseJson.put("message", "Đã tạo thành công");
	        }
	        rs.close();
	    } catch (Exception e) {
	    	responseJson.put("success", false);
	        responseJson.put("message", e.getMessage());	        
	    }
	    out.write(responseJson.toString());
	}
}