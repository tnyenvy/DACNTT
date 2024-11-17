let user = {}
const name = document.getElementById("form-name");
const email = document.getElementById("form-email");
const address = document.getElementById("form-address");
const phone = document.getElementById("form-sdt");
async function GetUserDetail()
{
	if (Object.keys(user).length === 0)
	{
		await fetch(`/ConvenienceStore/Login?action=${encodeURIComponent('{"get"}')}`, {
			method: "GET",
			headers: {
				   "Content-Type": "application/x-www-form-urlencoded"
			},
			})
			.then(response => response.json())
			.then(data => {
			   if (data.success) 
				{
					user=data.message;
				}
			})
			.catch(error => {
				console.error("Error:", error);
		});
	}
	if (Object.keys(user).length === 0)
	{
		window.location.href = "./signin.html";
	}
	else
	{
		showinhtml();
	}
}
function showinhtml()
{
	name.value = user.name;
	email.value = user.email;
	address.value = user.address;
	phone.value = user.phoneNumber;
}
async function disableAccount()
{
	GetUserDetail();
	fetch(`/ConvenienceStore/Login?action=${encodeURIComponent('{"delete"}')}&email=${encodeURIComponent(user.email)}&id=${encodeURIComponent(user.id)}`, {
		    method: "GET",
		    headers: {
		        "Content-Type": "application/x-www-form-urlencoded"
		    },
		})
		.then(response => response.json())
		.then(data => {
		    if (data.success) {
				user={};
				alert("Xóa thành công.");
				window.location.href = "./index.html";
		    } else {
		        alert("Xóa thất bại");	
		    }
		})
		.catch(error => {
		    console.error("Error:", error);
		});
}
async function changeDetail()
{
	if (!name.value)
	{
		alert("Thất bại: vui lòng nhập tên");	
		return;
	}
	else if (!email.value)
	{
		alert("Thất bại: vui lòng nhập email");	
		return;
	}
	else if (phone.value.length < 10 || phone.value.length > 11)
	{
		alert("Thất bại: vui lòng nhập đúng số điện thoại");	
		return;
	}
	fetch(`/ConvenienceStore/Login?action=change`, {
			    method: "POST",
			    headers: {
			        "Content-Type": "application/x-www-form-urlencoded"
			    },
				body: `email=${email.value}&phone=${phone.value}&name=${name.value}&address=${address.value}`
			})
			.then(response => response.json())
			.then(data => {
			    if (data.success) {
					alert("Cập nhật thành công");
			    } else {
			        alert("Thất bại: " + data.message);	
			    }
			})
			.catch(error => {
			    console.error("Error:", error);
			});
}
async function changePassword()
{
	const newPassword = document.getElementById("new-password").value;
	const curPassword = document.getElementById("cur-password").value;
	if (newPassword.length < 5 || newPassword.length > 15)
	{
		alert("Thất bại: nhập mật khẩu mới có độ dài từ 5 đến 15 kí tự");
		return;
	}
	fetch(`/ConvenienceStore/Login?action=changePassword`, {
			    method: "POST",
			    headers: {
			        "Content-Type": "application/x-www-form-urlencoded"
			    },
				body: `new=${newPassword}&cur=${curPassword}`
			})
			.then(response => response.json())
			.then(data => {
			    if (data.success) {
					alert("Cập nhật thành công");
			    } else {
			        alert("Thất bại: " + data.message);	
			    }
			})
			.catch(error => {
			    console.error("Error:", error);
			});
}
function Gettinglogout() {
    fetch(`/ConvenienceStore/Login?action=logout`, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reset thông tin người dùng
            user = {}; 
            // Điều hướng về trang chính
            window.location.href = "./index.html";
        } else {
            alert("Đăng xuất thất bại, vui lòng thử lại!");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau!");
    });
}
