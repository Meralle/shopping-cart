class shoppingCart {
  constructor () {
    this.db = JSON.parse( localStorage.getItem('cart') ) || [];
    this.db.total = this.db.total || 0;
    this.db.shipping = this.db.shipping || 0;
    this.db.time = this.db.time || 0;
    this.elements = {
      //TODO provide selectors for:
      //- product list
      list:document.getElementById("products"),
      // items:document.getElementByIdAll("#products li")
      //- selector where the contents of the cart should be displayed
      result:document.querySelectorAll(".cartresult"),
      //- the reset button
      reset:document.getElementById("reset"),
      cart: document.getElementById("cart"),
      totaltarget: document.querySelectorAll(".total-target"),
       //- total amount
      total_template:document.getElementById("total-template"),
      //- total template
      template: document.getElementById("template")
      
    }
    this.init()
  }
  init(){
    //here you take your cart item template and clone this piece of html to a virtual copy
    var card = this.elements.template
    for (var i in database ) {
      var element = card.cloneNode(true);
      //TODO here we have clone our template lets remove the id first and rmove display none class
      element.removeAttribute("id"),
      element.classList.remove("d-none"),
      // bug hereis something went wrong
      //TODO fill the element with the image from the database and add the name of the product to the title
      element.querySelector(".card-img-top").src = database[i].image,
      element.querySelector(".card-title").prepend(i);

      // price part
      var price = document.createElement("span");
      price.innerHTML = `price:${database[i].price}€ <br>`
      element.querySelector(".card-body").appendChild(price);
      // console.log(database[i].discount)
      if (database[i].discount){
        price.style.textDecoration="line-through";
        price.classList.add("text-danger");
      // discount part
      var discount = document.createElement("span");
      discount.innerHTML = `discount:${database[i].discount}%`
      element.querySelector(".card-body").appendChild(discount);
      // new preice part
      var showNewPrice = document.createElement('p');
      var newPrice = database[i].price - (database[i].price / 100 * database[i].discount);
      showNewPrice.innerHTML = newPrice + "€";
      showNewPrice.classList.add("text-danger");
      element.querySelector(".card-body").appendChild(showNewPrice);

     } 
      //TODO lets put in the footer the shipping costs and delivery time
      var info = document.createElement("small");
      //TODO now we take the  button and fill it with all our data to use this for the remove action
      info.classList.add("text-muted");

      // the currency part
      let currencySymbol ="$";
      if(window.location.search.substring(1) ==="lang=de"){
        currencySymbol = "€";
      }
      info.innerHTML = `shipping: ${database[i].shipping + currencySymbol}; <br> delivery: ${database[i].delivery}d`,
      
      element.querySelector(".card-footer").appendChild(info);
      var button = element.querySelector(".btn-primary");
      button.dataset.name = i,
      button.dataset.delivery = database[i].delivery,
      button.dataset.shipping = database[i].shipping,
      button.dataset.price = database[i].price,
      this.elements.list.appendChild(element);
      // this removes the faded class with a timeout from all divs - wooosh!
      var divs = document.querySelectorAll('#products > div');
      // Fade-in effect
      var time = 0;
      // here is the code to oneby one opened in the maipage
      for (let card of divs) {
        setTimeout(function(){
          card.classList.remove('faded');
        }, time);
        time+=100
      }
    }
    document.addEventListener('click', (e)=>{
      console.log(e)
      // these are the event listeners for dynamically created elements. Eg: A element is not present and will be generated and rendered with js, its hart to define the event listeners on document load. They will not hook up, so we listen to the document
      if(e.target && e.target.classList.contains( 'btn-danger' )){
        let itemKey = this.findItemKey(e.target.dataset.name);
        this.updateCart(e.target.dataset.name, true);
      } else if (e.target && e.target.classList.contains( 'cart-button' )){
        this.updateCart(e.target.dataset.name);
        this.render();
      }
    })
    this.render();
    this.resetEventListener()
  }
  resetEventListener() {
    this.elements.reset.addEventListener('click', (e)=>{
      this.db.items = []
      this.db.total = 0,
      this.db.shipping = 0,
      this.db.delivery = 0,
      localStorage.setItem("cart", JSON.stringify( {shipping: 0, total: 0, items: [], delivery: 0 } ))
      this.render()
    });
  }
  findItemKey(itemName){
    //TODO this is the "find a item" in the database function, refactor it to array.filter
    for (let i = 0; i < this.db.items.length; i++){
      if (this.db.items[i].name == itemName){
        return i
      }
      // removeFromCart(itemName) 
      // this.findItemKey(item); 
     }
  }
  updateCart(item, remove = false){
    //here the magic happens
    //try to understand what happens here
    let itemKey = this.findItemKey(item)
    if(remove){
      if(this.db.items[itemKey].count > 1){
        this.db.items[itemKey].count--
      }else{
        this.db.items.shift(itemKey)
      }
    } else {
      if(itemKey !== undefined){
        this.db.items[itemKey].count++
      } else {
        this.db.items.push({shipping: event.target.dataset.shipping, name: event.target.dataset.name, price: event.target.dataset.price, delivery: event.target.dataset.delivery, count: 1})
      }
    }
    if(this.db.items.length > 0) {
      this.db.total = this.db.items.map((i) => {
        return i.price * i.count
      }).reduce((e, i) => Number(e) + Number(i))

      this.db.shipping = this.db.items.map((i) => {
        return i.shipping
      })
      this.db.shipping = Math.max(...this.db.shipping)

      this.db.delivery = this.db.items.map((i) => {
        return i.delivery
      })
      this.db.delivery = Math.max(...this.db.delivery)
    } else {
      this.db.shipping = 0;
      this.db.total = 0;
      this.db.delivery = 0;
    }

    localStorage.setItem("cart", JSON.stringify( {shipping: this.db.shipping, total: this.db.total, items: this.db.items, delivery: this.db.delivery } ))
    this.render()
  }
  render(){
    this.db.items = this.db.items || []
    // the function checks if items are in the cart and hides the cart if it is empty
    if( this.db.items.length > 0 ){
      this.elements.cart.classList.remove('faded')
      for (let i = 0; i < this.elements.totaltarget.length; i++){
        this.elements.totaltarget[i].classList.remove('faded')
      }
    } else {
      this.elements.cart.classList.add('faded')
      for (let i = 0; i < this.elements.totaltarget.length; i++){
        this.elements.totaltarget[i].classList.add('faded')
      }
    }

    var cart = document.createElement('div')
    this.db.items.forEach( item => {
    var i = document.createElement("li");
  
    // the curreny part
    let currencySymbol = "$";
      if(window.location.search.substring(1) ==="lang=de"){
        currencySymbol = "€";
      }

    i.classList += "list-group-item d-flex justify-content-between align-items-center ";
    i.innerHTML = `<span class="badge badge-info badge-pill mr-2">${item.count} </span> ${item.name} -${item.price + currencySymbol}; 
    <span class="ml-auto mr-3 font-weight-bold">${(item.price * item.count).toFixed(2) + currencySymbol};</span>`;

   
    var btnn = document.createElement("button");
    btnn.classList.add("btn-sm", "btn-danger");
    btnn.dataset.name = item.name;
    btnn.innerHTML = "<i class='fa fa-close pointer-evebts-none'></i>",
    i.appendChild(btnn);
    cart.appendChild(i);
  }
  );
      //TODO create a list item, add bootstrap classes
      //fill it with a bootstrap badge span which shows the count, the name, the price, the total and the remove button
      // here yo go
  
    for (let i = 0; i < this.elements.result.length; i++){
      this.elements.result[i].innerHTML = cart.innerHTML
    }
    //TODO we want to show the list of totals several times on the page
    //we loop over the target elements, take each time a new template, fill it with data and display it on the page
    
    var ttemplate = this.elements.total_template
    for (let i = 0; i < this.elements.totaltarget.length; i++){
      ttemplate = ttemplate.cloneNode(true);
      ttemplate.removeAttribute("id");
      ttemplate.classList.remove("d-none")
      ttemplate.querySelector(".total").innerHTML = this.db.total ? this.db.total.toFixed(2) : 0
      ttemplate.querySelector(".delivery").innerHTML = this.db.delivery ? this.db.delivery.toFixed(0) : 0
      ttemplate.querySelector(".shipping").innerHTML = this.db.shipping ? this.db.shipping.toFixed(0) : 0
      this.elements.totaltarget[i].innerHTML = ttemplate.innerHTML
    }
    for (let i = 0; i < this.elements.result.length; i++){
    
      this.elements.totaltarget[i].innerHTML = ttemplate.innerHTML
    }
  }
}
var instaceOfCart = new shoppingCart();
