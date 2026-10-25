const cart = [];
const money = n => "Rs. " + n.toLocaleString("en-PK");
const products = {
  "iPhone 16 Pro Max":449999,
  "Samsung Galaxy S24 Ultra":329999,
  "Xiaomi 14 Ultra":279999,
  "Oppo Reno11 F":169999,
  "Wireless Earbuds":9999,
  "Phone Cases":2499,
  "Fast Charger":4999,
  "Smart Watch":19999,
  "Power Bank":6999,
  "Screen Protector":1499
};
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartDrawer = document.getElementById("cartDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const cartItems = document.getElementById("cartItems");
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message){
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300);
}
function renderCart(){
  const count=cart.reduce((n,item)=>n+item.qty,0);
  cartCount.textContent=count;drawerCount.textContent=`(${count})`;
  if(!cart.length){cartItems.innerHTML='<p class="empty-cart">Your cart is waiting for something brilliant.</p>';}
  else{
    cartItems.innerHTML=cart.map((item,i)=>`<div class="cart-line"><div><strong>${item.name}</strong><small>${money(item.price)} × ${item.qty}</small></div><button data-remove="${i}" aria-label="Remove ${item.name}">−</button></div>`).join("");
  }
  document.getElementById("cartTotal").textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
}
function addProduct(name){
  const found=cart.find(item=>item.name===name);
  if(found)found.qty++;else cart.push({name,price:products[name]||0,qty:1});
  renderCart();showToast(`${name} added to your cart`);
}
document.querySelectorAll(".add-cart").forEach(button=>{
  button.addEventListener("click",()=>{
    const card=button.closest("[data-name]");
    if(card)addProduct(card.dataset.name);
  });
});
cartItems.addEventListener("click",event=>{
  const button=event.target.closest("[data-remove]");
  if(!button)return;
  const index=Number(button.dataset.remove);
  if(cart[index].qty>1)cart[index].qty--;else cart.splice(index,1);
  renderCart();
});
function openCart(){cartDrawer.classList.add("open");drawerOverlay.classList.add("open");cartDrawer.setAttribute("aria-hidden","false");document.body.classList.add("no-scroll");}
function closeCart(){cartDrawer.classList.remove("open");drawerOverlay.classList.remove("open");cartDrawer.setAttribute("aria-hidden","true");document.body.classList.remove("no-scroll");}
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
drawerOverlay.addEventListener("click",closeCart);
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeCart();});
document.getElementById("checkoutBtn").addEventListener("click",()=>showToast(cart.length?"Demo checkout: connect a payment gateway to accept orders.":"Your cart is empty."));
const searchInput=document.getElementById("searchInput");
searchInput.addEventListener("input",()=>{
  const query=searchInput.value.trim().toLowerCase();
  let visible=0;
  document.querySelectorAll(".product-card,.accessory-card").forEach(card=>{
    const match=card.dataset.name.toLowerCase().includes(query);
    card.style.display=match?"":"none";
    if(match)visible++;
  });
  document.getElementById("noResults").hidden=visible!==0||query==="";
});
document.getElementById("newsletterForm").addEventListener("submit",event=>{
  event.preventDefault();
  document.getElementById("newsletterMessage").textContent="Thanks! This demo form isn't connected to an email service yet.";
  event.target.reset();
});
const menuToggle=document.querySelector(".menu-toggle");
const navLinks=document.querySelector(".nav-links");
menuToggle.addEventListener("click",()=>{
  const open=navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(open));
});
navLinks.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  navLinks.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");
}));
renderCart();
