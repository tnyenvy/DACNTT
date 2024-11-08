function scrollCategory(name) 
{
	const element = document.getElementById(name);
	  if (element) {
	    element.scrollIntoView({ behavior: 'smooth' });
	  } else {
	    console.warn(`Không tìm thấy phần tử với ID: ${name}`);
	  }
}

async function loadProductDetail(id) {
    try {
        const response = await fetch('/ConvenienceStore/DetailServlet?action=list');
        
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
		if (Array.isArray(data) && data.length > 0) 
		{
			for (var i = 0; i < data.length; i++)
			{
				if (data[i].id === id)
					{
        	document.getElementById('item-name').innerHTML = data[i].name;
			document.getElementById('item-tag').innerHTML = Tag(data[i].tag);
			document.getElementById('item-price').innerHTML = data[i].price + " VNĐ";
			document.getElementById('item-id').innerHTML = data[i].id;
			document.getElementById('item-quantity').innerHTML = data[i].quantity;
			document.getElementById('item-type').innerHTML = Type(data[i].type);
			document.getElementById('modal-quantity').value = "1";
			document.querySelector('#img-zoom').src = data[i].image;
			document.querySelector('.zoom').style.backgroundImage = "url("+data[i].image+")";
			if (data[i].price === 0)
			{
					document.querySelector('#is-free').hidden = false;
			}
			else
			{
					document.querySelector('#is-free').hidden = true;
			}
			if (data[i].quantity === 0)
			{
					document.querySelector('#is-sold-out').hidden = false;
					document.querySelector('#is-free').hidden = true;
					document.getElementById('item-btn').disabled = true;
					document.getElementById('item-btn').classList.remove('btn-primary');
					document.getElementById('item-btn').classList.add('btn-secondary');					
			}
			else
			{
					document.querySelector('#is-sold-out').hidden = true;	
					document.getElementById('item-btn').disabled = false;				
					document.getElementById('item-btn').classList.remove('btn-secondary');
					document.getElementById('item-btn').classList.add('btn-primary');					
			}
			const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
			quickViewModal.show();
			break;
			}
			}
		}
		else
		{
			alert('Đã xảy ra lỗi hiển thị modal');
		}
		
    } catch (error) {
        alert('Đã xảy ra lỗi hiển thị: ' + error);
    }
}

function Tag(i)
{
	switch(i) 
	{
	     case 0:
	    	 return "Thực phẩm tươi sống";
	     case 1:
	    	 return "Thực phẩm chế biến sẵn";
	     case 2:
	    	 return "Đồ uống";
	     case 3:
	    	 return "Đồ uống có cồn";
	     case 4:
	    	 return "Đồ ăn nhẹ và đồ ngọt";
	     case 5:
	    	 return "Hóa mỹ phẩm";
	     case 6:
	    	 return "Đồ dùng gia đình";
	     case 7:
	    	 return "Văn phòng phẩm";
	     default:
	    	 return "Khác";
	  }
}

function Type(i)
{
	switch(i) 
	{
	     case 0:
	    	 return "Chai";
	     case 1:
	    	 return "Gói";
	     case 2:
	    	 return "Thùng";
	     case 3:
	    	 return "Lon";
	     case 4:
	    	 return "Hộp";
	     default:
	    	 return "Khác";
	     }
}
function zooming(event) {
    const zoomDiv = document.querySelector('.zoom');
    const x = event.clientX - zoomDiv.getBoundingClientRect().left; // Tọa độ x chuột trong div
    const y = event.clientY - zoomDiv.getBoundingClientRect().top; // Tọa độ y chuột trong div
    const width = zoomDiv.offsetWidth; // Chiều rộng của div
    const height = zoomDiv.offsetHeight; // Chiều cao của div

    // Tính toán tỷ lệ phóng to (có thể điều chỉnh tỷ lệ theo ý muốn)
    const scale = 2; // Tỷ lệ phóng to

    // Cập nhật thuộc tính background-size và background-position
    zoomDiv.style.backgroundSize = `${width * scale}px ${height * scale}px`;
    zoomDiv.style.backgroundPosition = `${-x * scale + width / 2}px ${-y * scale + height / 2}px`;
}

function resetZoom() {
    const zoomDiv = document.querySelector('.zoom');
    zoomDiv.style.backgroundSize = 'cover'; // Đặt lại kích thước về cover
    zoomDiv.style.backgroundPosition = 'center'; // Đặt lại vị trí về center
}
async function loadAllProduct() 
{		
	  const response = await fetch('/ConvenienceStore/DetailServlet?action=product');      
      if (!response.ok) {
      	   throw new Error("Network response was not ok " + response.statusText);
      }
      loadProductForeachContainer();
}
let productCount = new Array(0,0,0,0,0,0,0,0);
let productShowMax = new Array(10,10,10,10,10,10,10,10);
async function loadProductForeachContainer() 
{
	try {
	        const response = await fetch('/ConvenienceStore/DetailServlet?action=list');
	        
	        if (!response.ok) {
	            throw new Error("Network response was not ok " + response.statusText);
	        }
	        const data = await response.json();
			
			if (Array.isArray(data) && data.length > 0) 
			{
				for (var i = 0; i < data.length; i++)
				{
					productCount[data[i].tag]++;
					if (document.getElementById("productContainer" + data[i].tag).querySelectorAll(":scope > div").length < productShowMax[data[i].tag])
					{
					if (data[i].quantity === 0)
					{
						document.getElementById("productContainer" + data[i].tag).innerHTML 
						+= createProductCardHTML(data[i].id,data[i].name,data[i].price,data[i].image,'','Hết hàng','danger','disabled','secondary');
					}
					else if (data[i].price === 0)
					{
						document.getElementById("productContainer" + data[i].tag).innerHTML 
						+= createProductCardHTML(data[i].id,data[i].name,data[i].price,data[i].image,'','Miễn phí','success','','primary');
					}
					else
					{
						document.getElementById("productContainer" + data[i].tag).innerHTML 
						+= createProductCardHTML(data[i].id,data[i].name,data[i].price,data[i].image,'hidden','','primary','','primary');
					}
					}				
				}
				for (var i = 0; i <= 7; i++)
				{
					if (productCount[i] > productShowMax[i])
						document.getElementById("Container" + i).innerHTML +=createExpandDiv(productCount[i]-productShowMax[i],i);
					else
						productShowMax[i] = productCount[i];
				}
			}
			else
			{
				alert('Đã xảy ra lỗi hiển thị từng sản phẩm');
			}
			
	    } catch (error) {
	        alert('Đã xảy ra lỗi hiển thị: ' + error);
	    }	
}
function createProductCardHTML(id,name,price,img,hidden,badge,danger,disabled,primary) 
{
        return `
		<div class="col" id="item-id-${id}">
			<div class="card card-product">
				<div class="card-body">
				     <div class="text-center position-relative">
				          <div class="position-absolute top-0 start-0" ${hidden}>
				           		<span class="badge bg-${danger}">${badge}</span>
				          </div>
				         <div onclick="loadProductDetail(${id})"><img src="${img}" alt="Grocery Ecommerce Template" class="mb-3 img-fluid" /></div>
				                   </div>
								   <div onclick="loadProductDetail(${id})">
				             <h2 class="fs-6"><span class="text-inherit text-decoration-none">${name}</span></h2>
							 </div>
				                   <div class="d-flex justify-content-between align-items-center mt-3">
				                     <div>
				                       <span class="text-dark">${price} VND</span>
				                     </div>
									<div>
				                       <div class="btn btn-${primary} btn-sm ${disabled}" onclick="addCart(${id})">
				                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus">
				                           <line x1="12" y1="5" x2="12" y2="19"></line>
				                           <line x1="5" y1="12" x2="19" y2="12"></line>
				                         </svg>
				                         Thêm
				                       </div>
				                     </div>
				              		</div>
				                 </div>
				               </div>
				             </div>`;
}
function createExpandDiv(left, id)
{
	return `
	<div class="d-flex justify-content-center align-items-center mt-3" id="expand-${id}">
	               		<div class="btn btn-outline-primary btn-lg" id="expand-text-${id}" onclick="loadProductContainer(${id})">
	               			<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
	    						<polygon points="12,18 6,6 18,6" fill="green" />
							</svg>
	               		Hiển thị thêm ${left} sản phẩm
	               		</div>
	               </div>`;
}
async function loadProductContainer(id) 
{
	productShowMax[id]+=10;
	try {
	        const response = await fetch('/ConvenienceStore/DetailServlet?action=list');
	        
	        if (!response.ok) {
	            throw new Error("Network response was not ok " + response.statusText);
	        }
	        const data = await response.json();
			
			if (Array.isArray(data) && data.length > 0) 
			{
				for (var i = 0; i < data.length; i++)
				{
					if (document.getElementById("productContainer" + id).querySelectorAll(":scope > div").length < productShowMax[id])
					{
					if (data[i].tag === id && !document.getElementById("item-id-" + data[i].id))
					{
					if (data[i].quantity === 0)
					{
						document.getElementById("productContainer" + data[i].tag).innerHTML 
						+= createProductCardHTML(data[i].id,data[i].name,data[i].price,data[i].image,'','Hết hàng','danger','disabled','secondary');
					}
					else if (data[i].quantity === 0)
					{
						document.getElementById("productContainer" + data[i].tag).innerHTML 
						+= createProductCardHTML(data[i].id,data[i].name,data[i].price,data[i].image,'','Miễn phí','success','','primary');
					}
					else
					{
						document.getElementById("productContainer" + data[i].tag).innerHTML 
						+= createProductCardHTML(data[i].id,data[i].name,data[i].price,data[i].image,'hidden','','primary','','primary');
					}
					}
					}
					else
					{
						break;
					}					
				}
				if (document.getElementById("productContainer" + id).querySelectorAll(":scope > div").length >= productCount[id])
						document.getElementById("expand-" + id).remove();
				else if (productCount[id] > productShowMax[id])
					{
						var left = productCount[id] - productShowMax[id];
						document.getElementById("expand-text-" + id).innerHTML = "Hiển thị thêm " + left + " sản phẩm";
					}
				if (productCount[id] < productShowMax[id])
						productShowMax[id] = productCount[id];
			}
			else
			{
				alert('Đã xảy ra lỗi hiển thị thêm');
			}
			
	    } catch (error) {
	        alert('Đã xảy ra lỗi hiển thị: ' + error);
	    }	
}


