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
@WebServlet("/Login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = DBConnection.getConnection();	
	public JSONObject user = new JSONObject();
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
		JSONObject responseJson = new JSONObject();
		responseJson.put("success", false);
        responseJson.put("message", "error");	
        PrintWriter out = response.getWriter();
        String action = request.getParameter("action");
        if (action.equals("{\"get\"}"))
        {
		if (user.length() == 0)
		{
			HttpSession session = request.getSession(false); // Không tạo session mới nếu chưa tồn tại
		    if (session != null) 
		    {
		    	String sql = "SELECT id, name, address, phoneNumber, disable FROM customer WHERE id = ? and email = ? and disable=0";
			    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
			        stmt.setInt(1, (int) session.getAttribute("id"));
			        stmt.setString(2, (String) session.getAttribute("email"));
			        ResultSet rs = stmt.executeQuery();

			        if (rs.next()) {
	                    user.put("id", rs.getInt("id"));
	                    user.put("name", rs.getString("name"));
	                    user.put("address", rs.getString("address"));
	                    user.put("email", (String) session.getAttribute("email"));
	                    user.put("phoneNumber", rs.getString("phoneNumber"));
	                    user.put("disable", rs.getInt("disable"));
	                }			        
			        responseJson.put("success", true);
			        responseJson.put("message", user);		
			        out.write(responseJson.toString());
			        rs.close();
			    } catch (Exception e) {
			        e.printStackTrace();
			    }
		    } 
		    else
		    {
		    	responseJson.put("success", false);
		        responseJson.put("message", "Session không tồn tại");
		        out.write(responseJson.toString());
		    }
		}
		else
		{
			responseJson.put("success", true);
	        responseJson.put("message", user);
	        out.write(responseJson.toString());
		}
        }
        else if (action.equals("{\"delete\"}"))
        {
        	response.setContentType("application/json");
    	    response.setCharacterEncoding("UTF-8");
    	    String email = request.getParameter("email");
    	    String id = request.getParameter("id");    
    	    String sql = "Update customer set disable=1 where id=? and email=?;";
    	    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
    	    	stmt.setString(1, id);
    	    	stmt.setString(2, email);
    	        int check = stmt.executeUpdate();

    	        if (check > 0) 
    	        {
    	        	user=new JSONObject();
    	        	responseJson.put("success", true);
    		        responseJson.put("message", "Xóa thành công");
    	        }
    	        else
    	        {
    	        	responseJson.put("success", false);
    		        responseJson.put("message", "Xóa thất bại");	
    	        }
    	    } catch (Exception e) {
    	    	responseJson.put("success", false);
    	        responseJson.put("message", e.getMessage());	        
    	    }
    	    out.write(responseJson.toString());
        }
        else if (action.equals("logout"))
        {
        	HttpSession session = request.getSession(false);
        	if (session != null) {
        	    session.invalidate();
        	}
        	user=new JSONObject();
        	responseJson.put("success", true);
	        responseJson.put("message", "Đăng xuất thành công");
	        out.write(responseJson.toString());
        }
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    request.setCharacterEncoding("UTF-8");
	    String action = request.getParameter("action");
	    PrintWriter out = response.getWriter();
	    
	    JSONObject responseJson = new JSONObject();
	    if (action.equals("login"))
	    {
	    String email = request.getParameter("email");
	    String password = request.getParameter("password");
	    String remember = request.getParameter("remember");
	    

	    if (validateUser(email, password)) {
	        responseJson.put("success", true);
	        responseJson.put("message", user); // Trả về dữ liệu người dùng đã lưu
	        if (remember == "true")
            {
	        	HttpSession session = request.getSession();
	            session.setAttribute("email", email);
	            session.setAttribute("id", user.getInt("id"));
            }
	    } else {
	        responseJson.put("success", false);
	        responseJson.put("message", "Invalid credentials!");
	    }
	    out.write(responseJson.toString());
	    }
	    else if (action.equals("change"))
	    {
	    	String email = request.getParameter("email");
		    String phone = request.getParameter("phone");
		    String name = request.getParameter("name");
		    String address = request.getParameter("address");
		    String sql = "Update customer set ";
		    if (!email.equals(user.getString("email")))
		    	sql += "email=? ";
		    if (!phone.equals(user.getString("phoneNumber")))
		    	sql += "phoneNumber=? ";
		    if (!name.equals(user.getString("name")))
		    	sql += "name=? ";
		    if (!address.equals(user.getString("address")))
		    	sql += "address=? ";
		    sql += "where id=?";
		    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
		    	int count = 1;
		    	if (!email.equals(user.getString("email")))
		    	{
		    		stmt.setString(count, email);
		    		count++;
		    	}
			    if (!phone.equals(user.getString("phoneNumber")))
			    {
		    		stmt.setString(count, phone);
		    		count++;
		    	}
			    if (!name.equals(user.getString("name")))
			    {
		    		stmt.setString(count, name);
		    		count++;
		    	}
			    if (!address.equals(user.getString("address")))
			    {
		    		stmt.setString(count, phone);
		    		count++;
		    	}
		        stmt.setInt(count, user.getInt("id"));
		        int check = stmt.executeUpdate();

		        if (check>0) {
		        	if (!email.equals(user.getString("email")))
				    	user.put("email", email);
				    if (!phone.equals(user.getString("phoneNumber")))
				    	user.put("phoneNumber", phone);
				    if (!name.equals(user.getString("name")))
				    	user.put("name", name);
				    if (!address.equals(user.getString("address")))
				    	user.put("address", address);
		        	responseJson.put("success", true);
			        responseJson.put("message", "Cập nhật thành công");	
                }			        
		        else
		        {
		        	responseJson.put("success", false);
			        responseJson.put("message", "Lỗi không thể cập nhật");	
		        }
		        out.write(responseJson.toString());
		        stmt.close();
		    } catch (Exception e) {
		    	responseJson.put("success", false);
		        responseJson.put("message", e.getMessage());	
		        out.write(responseJson.toString());
		    }
	    }
	    else if (action.equals("changePassword"))
	    {
	    	String newPassword = request.getParameter("new");
	    	String curPassword = request.getParameter("cur");

	    	String sql = "SELECT password FROM customer WHERE id=?";
	    	try (PreparedStatement stmt = connection.prepareStatement(sql)) {
	    	    stmt.setInt(1, user.getInt("id"));
	    	    ResultSet rs = stmt.executeQuery();

	    	    if (rs.next()) {
	    	        String storedPassword = rs.getString("password");
	    	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	    	        
	    	        if (passwordEncoder.matches(curPassword, storedPassword)) {
	    	            // Nếu mật khẩu hiện tại đúng
	    	            sql = "UPDATE customer SET password=? WHERE id=?";
	    	            try (PreparedStatement stmt2 = connection.prepareStatement(sql)) {
	    	                stmt2.setString(1, passwordEncoder.encode(newPassword));
	    	                stmt2.setInt(2, user.getInt("id"));

	    	                int check = stmt2.executeUpdate();
	    	                if (check > 0) {
	    	                    responseJson.put("success", true);
	    	                    responseJson.put("message", "Cập nhật thành công");
	    	                } else {
	    	                    responseJson.put("success", false);
	    	                    responseJson.put("message", "Cập nhật thất bại");
	    	                }
	    	            }
	    	        } else {
	    	            // Nếu mật khẩu hiện tại không đúng
	    	            responseJson.put("success", false);
	    	            responseJson.put("message", "Mật khẩu hiện tại không đúng");
	    	        }
	    	    } else {
	    	        responseJson.put("success", false);
	    	        responseJson.put("message", "Không tìm thấy người dùng");
	    	    }
	    	    rs.close();
	    	} catch (Exception e) {
	    	    responseJson.put("success", false);
	    	    responseJson.put("message", e.getMessage());
	    	}
	    	out.write(responseJson.toString());
	    }
	}

	private boolean validateUser(String email, String password) {
	    boolean isValid = false;
	    
	    String sql = "SELECT id, password FROM customer WHERE email = ? and disable=0";
	    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
	        stmt.setString(1, email);
	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	        ResultSet rs = stmt.executeQuery();

	        if (rs.next() && passwordEncoder.matches(password, rs.getString("password"))) {
	            isValid = true;
	            
	             // Tạo JSONObject chứa thông tin người dùng
	            
	            sql = "SELECT id, name, address, phoneNumber, disable FROM customer WHERE id = ?";
	            try (PreparedStatement stmt2 = connection.prepareStatement(sql)) {
	                stmt2.setInt(1, rs.getInt("id"));
	                ResultSet rs2 = stmt2.executeQuery();
	                
	                if (rs2.next()) {
	                    user.put("id", rs2.getInt("id"));
	                    user.put("name", rs2.getString("name"));
	                    user.put("address", rs2.getString("address"));
	                    user.put("email", email);
	                    user.put("phoneNumber", rs2.getString("phoneNumber"));
	                    user.put("disable", rs2.getInt("disable"));
	                }
	                rs2.close();
	            }
	        }
	        rs.close();
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    
	    return isValid;
	}

}