let data = []; //JSON danh sách sản phẩm
async function getData()
{	
	if (data.length === 0)
	{
		try 
		{
			let response = await fetch('/ConvenienceStore/StoreLocationServlet?action=stores');
			if (!response.ok) 
			{
				alert("Phản hồi thất bại: " + response.statusText);
			}
			response = await fetch('/ConvenienceStore/StoreLocationServlet?action=list');
			if (!response.ok) 
			{
			     alert("Phản hồi thất bại: " + response.statusText);
			}
			else
			{
				data = await response.json();
				if (!Array.isArray(data) || data.length === 0)
				{
					alert('Đã xảy ra lỗi không nhận được dữ liệu, vui lòng làm mới trang');
				}
			}
		}
		catch (error) 
		{
		     alert('Đã xảy ra lỗi: ' + error);
		}
	}	
}
async function loadAllStore() //Hiển thị danh sách cửa hàng
{
	await getData();
	if (!Array.isArray(data) || data.length === 0)
		return;
	for (var i = 0; i < data.length; i++)
	{
		if (data[i].close === 1)
		{
			document.getElementById("storeContainer").innerHTML 
			+= createDivStoreForHome(data[i].id,data[i].name,data[i].address,'disabled');
		}
		else
		{
			document.getElementById("storeContainer").innerHTML 
			+= createDivStoreForHome(data[i].id,data[i].name,data[i].address,'');
		}			
	}	
}
function createDivStoreForHome(id,name,address,disabled)
{
	return `
	<div class="list-group-item d-flex flex-column align-items-start px-2 list-group-item-action" onclick="changeStore(${id},'${name}')" ${disabled}>
		<span>${name}</span><small>Địa chỉ: ${address}</small>
	</div>
	`
}

function changeStore(id, name) //Xử lí khi thay đổi cửa hàng
{
	const date = new Date();
	date.setTime(date.getTime() + (1*24*60*60*1000)); // Tính ngày hết hạn
	const expires = "expires=" + date.toUTCString(); // Chuyển đổi thành định dạng UTC
	document.cookie = "StoreID=" + id + ";" + expires + "; path=/"; // Tạo cookie
	document.cookie = "StoreName=" + name + ";" + expires + "; path=/"; // Tạo cookie
	location.reload();	
}

function checkStoreSelected() //Lấy thông tin cửa hàng đã chọn trong cookie
{
    let name = "StoreName=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) 
	{
    	let c = ca[i];
    	while (c.charAt(0) == ' ') 
		{
    	    c = c.substring(1);
    	}
    	if (c.indexOf(name) == 0) 
		{
    	    document.getElementById('btnStore').innerHTML = c.substring(name.length, c.length);
    	}
    }
}