var Cart = JSON.parse(localStorage.getItem("Cart")) || [];
async function getCartbefore() 
{
	Cart.forEach(product => {
	        addCart(product.id,product.quantity,0);
	});
}
function addToCartSession(product) {
    const existingProduct = Cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        Cart.push(product);
    }
    
    // Lưu giỏ hàng cập nhật vào localStorage
    localStorage.setItem("Cart", JSON.stringify(Cart));
}
async function addCart(id,quantity=1,update=1)
{
	if (!document.getElementById("item-cart-"+id))
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
				if (data[i].id === id)
				{
					document.getElementById("cart-list").innerHTML 
					+= createCartDetail(data[i].id,data[i].name,data[i].image,data[i].price,quantity);
					if (update === 1)
					{
						product = {
						    id: id,
						    quantity: quantity
						};
						addToCartSession(product);
					}
					break;
				}
			}	
			}			
		    } catch (error) {
		        alert('Đã xảy ra lỗi hiển thị: ' + error);
		    }
		}
		else
		{
			const product = Cart.find(item => item.id === id);
			product.quantity += quantity;
			document.getElementById("cart-quantity-"+id).value = product.quantity;
			localStorage.setItem("Cart", JSON.stringify(Cart));
		}	
}
async function addCart2()
{
	if (!document.getElementById("item-cart-"+parseInt(document.getElementById("item-id").innerHTML)))
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
				if (data[i].id === parseInt(document.getElementById("item-id").innerHTML))
				{
					document.getElementById("cart-list").innerHTML 
					+= createCartDetail(data[i].id,data[i].name,data[i].image,data[i].price,parseInt(document.getElementById("modal-quantity").value));
					product = {
						id: parseInt(document.getElementById("item-id").innerHTML),
						quantity: parseInt(document.getElementById("modal-quantity").value)
					};
					addToCartSession(product);
					break;
				}
			}	
			}			
		    } catch (error) {
		        alert('Đã xảy ra lỗi hiển thị: ' + error);
		    }	 
		}
		else
		{
			const product = Cart.find(item => item.id === parseInt(document.getElementById("item-id").innerHTML));
			product.quantity += parseInt(document.getElementById("modal-quantity").value);
			document.getElementById("cart-quantity-"+parseInt(document.getElementById("item-id").innerHTML)).value = product.quantity;
			localStorage.setItem("Cart", JSON.stringify(Cart));
		}
}
function createCartDetail(id,name,img,price,quantity)
{
	return `
	<li class="list-group-item py-3 ps-0 border-top border-bottom" id="item-cart-${id}">
	                     <!-- row -->
	                     <div class="row align-items-center">
	                        <div class="col-6 col-md-6 col-lg-7">
	                           <div class="d-flex">
	                              <img src="${img}" alt="Ecommerce" class="icon-shape icon-xxl" />
	                              <div class="ms-3">
	                                 <!-- title -->
	                                 <div class="text-inherit" onclick="loadProductDetail(${id})">
	                                    <h6 class="mb-0">${name}</h6>
	                                 </div>
	                                
	                                 <!-- text -->
	                                 <div class="mt-2 small lh-1">
	                                    <div class="text-decoration-none text-inherit" onclick="deleteCart(${id})">
	                                       <span class="me-1 align-text-bottom">
	                                          <svg
	                                             xmlns="http://www.w3.org/2000/svg"
	                                             width="14"
	                                             height="14"
	                                             viewBox="0 0 24 24"
	                                             fill="none"
	                                             stroke="currentColor"
	                                             stroke-width="2"
	                                             stroke-linecap="round"
	                                             stroke-linejoin="round"
	                                             class="feather feather-trash-2 text-success">
	                                             <polyline points="3 6 5 6 21 6"></polyline>
	                                             <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
	                                             <line x1="10" y1="11" x2="10" y2="17"></line>
	                                             <line x1="14" y1="11" x2="14" y2="17"></line>
	                                          </svg>
	                                       </span>
	                                       <span class="text-muted">Xóa</span>
	                                    </div>
	                                 </div>
	                              </div>
	                           </div>
	                        </div>
	                        <!-- input group -->
	                        <div class="col-4 col-md-3 col-lg-3">
	                           <!-- input -->
	                           <!-- input -->
	                           <div class="input-group input-spinner">
	                              <input type="button" value="-" class="button-minus btn btn-sm" data-field="quantity" onclick="minusQuantity(${id})">
	                              <input type="number" step="1" max="10" value="${quantity}" id="cart-quantity-${id}" name="quantity" class="quantity-field form-control-sm form-input" />
	                              <input type="button" value="+" class="button-plus btn btn-sm" data-field="quantity" onclick="addQuantity(${id})">
	                           </div>
	                        </div>
	                        <!-- price -->
	                        <div class="col-2 text-lg-end text-start text-md-end col-md-2">
	                           <span class="fw-bold">${price} VNĐ</span>
	                        </div>
	                     </div>
	                  </li>`;
}
function deleteCart(id)
{
	document.getElementById("item-cart-" + id).remove();
	Cart = Cart.filter(item => item.id !== id);
	localStorage.setItem("Cart", JSON.stringify(Cart));
}
function addQuantity(id)
{
	let existingProduct = Cart.find(item => item.id === id);  
	    if (existingProduct)
		{
	        existingProduct.quantity++;
			document.getElementById("cart-quantity-" + id).value = existingProduct.quantity;
			localStorage.setItem("Cart", JSON.stringify(Cart));
		}
}
function minusQuantity(id)
{
	let existingProduct = Cart.find(item => item.id === id);  
		    if (existingProduct)
			{
		        existingProduct.quantity--;
				document.getElementById("cart-quantity-" + id).value = existingProduct.quantity;
				localStorage.setItem("Cart", JSON.stringify(Cart));
			}
}
function deleteAllCart()
{
	localStorage.removeItem("Cart");
	document.getElementById("cart-list").innerHTML = "";
}