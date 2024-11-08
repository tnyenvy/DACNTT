async function loadAllStore() 
{	
	  const response = await fetch('/ConvenienceStore/StoreLocationServlet?action=stores');      
      if (!response.ok) {
      	   throw new Error("Network response was not ok " + response.statusText);
      }
      loadStoreforHome();
}
async function loadStoreforHome() 
{
	try {
	        const response = await fetch('/ConvenienceStore/StoreLocationServlet?action=list');
	        
	        if (!response.ok) {
	            throw new Error("Network response was not ok " + response.statusText);
	        }
	        const data = await response.json();
			
			if (Array.isArray(data) && data.length > 0) 
			{
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
			else
			{
				alert('Đã xảy ra lỗi hiển thị');
			}
			
	    } catch (error) {
	        alert('Đã xảy ra lỗi hiển thị');
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

function changeStore(id, name) {
	const date = new Date();
	date.setTime(date.getTime() + (1*24*60*60*1000)); // Tính ngày hết hạn
	const expires = "expires=" + date.toUTCString(); // Chuyển đổi thành định dạng UTC
	document.cookie = "StoreID=" + id + ";" + expires + "; path=/"; // Tạo cookie
	document.cookie = "StoreName=" + name + ";" + expires + "; path=/"; // Tạo cookie
	location.reload();	
}

function checkStoreSelected() {
    	let name = "StoreName=";
    	  let decodedCookie = decodeURIComponent(document.cookie);
    	  let ca = decodedCookie.split(';');
    	  for(let i = 0; i <ca.length; i++) {
    	    let c = ca[i];
    	    while (c.charAt(0) == ' ') {
    	      c = c.substring(1);
    	    }
    	    if (c.indexOf(name) == 0) {
    	      document.getElementById('btnStore').innerHTML = c.substring(name.length, c.length);
    	    }
    	  }
}