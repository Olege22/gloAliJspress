document.addEventListener('DOMContentLoaded', () => {

  const search = document.querySelector('.search'),
    cartBtn = document.getElementById('cart');
    wishlistBtn = document.getElementById('wishlist');
    goodsWrapper = document.querySelector('.goods-wrapper'),
    cart = document.querySelector('.cart'),
    category = document.querySelector('.category'),
    cardCounter = cartBtn.querySelector('.counter'),
    wishlistCounter = wishlistBtn.querySelector('.counter'),
    cartWrapper = document.querySelector('.cart-wrapper'),
    goodsPriceSum = document.querySelector('.cart-total span');

  const wishlist = [];

  const goodsBasket = {};

  //goodsWrapper.innerHTML
  const loading = nameFunction => {
    const spiner = ` 
    <div id="spinner">
      <div class="spinner-loading">
        <div>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
          <div>
            <div></div>
          </div>
          <div><div>
        </div>
      </div>
    </div>`;
    if (nameFunction === 'renderCard') {
      goodsWrapper.innerHTML = spiner;
    }
    if (nameFunction === 'renderBasket') {
      cartWrapper.innerHTML = spiner;
    }
};

//запрос на сервер
const getGoods = (hendler, filter) => {
  loading(hendler.name);
  fetch('db/db.json')
    .then(response => response.json())
    .then(filter)
    .then(hendler);
};

//Генерация карточек
  const createCardGoods = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = `<div class="card">
          <div class="card-img-wrapper">
            <img class="card-img-top" src="${img}" alt="">
            <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
              data-goods-id="${id}"></button>
          </div>
          <div class="card-body justify-content-between">
            <a href="#" class="card-title">"${title}"</a>
            <div class="card-price">"${price}" ₽</div>
            <div>
              <button class="card-add-cart"
                data-goods-id="${id}">Добавить в корзину</button>
            </div>
          </div>
        </div>`;
    return card;
  };

//рендер товаров в корзине
  const createCardBasket = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = `
      <div class="goods-img-wrapper">
        <img class="goods-img" src="${img}" alt="">
      </div>
      <div class="goods-description">
        <h2 class="goods-title">${title}</h2>
        <p class="goods-price">${price}</p>
      </div>
      <div class="goods-price-count">
        <div class="goods-trigger">
          <button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" data-goods-id="${id}"></button>
          <button class="goods-delete" data-goods-id="${id}"></button>
        </div>
        <div class="goods-count">${goodsBasket[id]}</div>
      </div>
    `;
    return card;
  };

//рендеры
  const renderCard = goods => {
    goodsWrapper.textContent = '';

    if(goods.length) {
      goods.forEach(({ id, title, price, imgMin }) => {
        goodsWrapper.append(createCardGoods(
          id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = '❌ ' +
        'Извините, мы не нашли товаров по вашему запросу';
    }
  };

  const renderBasket = goods => {
    cartWrapper.textContent = '';

    if(goods.length) {
      goods.forEach(({ id, title, price, imgMin }) => {
        cartWrapper.append(createCardBasket(
          id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty"> Ваша корзина пока пуста</div>';
    }
  };

  const wishlistRender = () =>{
    getGoods(renderCard, goods => 
      goods.filter(item => 
        wishlist.includes(item.id))
    );
  };

//калькуляция  
  const calcTotalPrice = goods => {
    //let sum = 0;
    const sum = goods.reduce((accum, item) => {
      return accum + item.price * goodsBasket[item.id];
    }, 0);
    // for (const item of goods) {
    //   sum += item.price * goodsBasket[item.id];
    // }
    goodsPriceSum.textContent = sum.toFixed(2);
  };

  const checkCount = () => {
    wishlistCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
  };

//фльтры
  const showCardBasket = goods => {
    const basketGoods = goods.filter(item => 
      goodsBasket.hasOwnProperty(item.id));
    calcTotalPrice(basketGoods);
    return basketGoods;
  };

  const rendomSort = item => item.sort(() => Math.random() - 0.5);

//работа с хранилещами
  const getCookie = name => {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  const cookieQuery = get => {
    if (get) {
      if (getCookie('goodsBasket')) { //document.cookie != ""
        Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')))
        //goodsBasket = JSON.parse(getCookie('goodsBasket'));
      }
      checkCount();
    } else {
      document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e`;
    }
    // console.log('goodsBasket: ', goodsBasket);
    // console.log('cookie: ', document.cookie);
  };

  const storageQuery = get => {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        wishlist.push(...JSON.parse(localStorage.getItem('wishlist')));
        // wishlist.splice(Infinity, 0, ...JSON.parse
        //   (localStorage.getItem('wishlist')));
          // JSON.parse(localStorage.getItem('wishlist')).
        //   forEach(id => wishlist.push(id));
      }
      checkCount();
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }

//события
  const closeCart = event => {

    if (event.target === cart ||
        event.target.classList.contains('cart-close') ||
        event.keyCode === 27) {
      cart.style.display = '';
      //делегирование
    };
    document.removeEventListener('keydown', closeCart);
  };

  const openCart = event => {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keydown', closeCart);
    getGoods(renderBasket, showCardBasket);
  }

  const choiceCategory = event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, goods => 
        goods.filter(item => 
          item.category.includes(category)
        )
      );
    };
  };

  const searchGoods = event => {
    event.preventDefault();
    const input = event.target.elements.searchGoods;
    const inputValue = input.value.trim();
    if (inputValue !== '') {
      const searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, goods => 
        goods.filter(item => searchString.test(item.title)));
    } else {
      search.classList.add('error');
      setTimeout( () => {
        search.classList.remove('error');
      }, 2000)
    };
    input.value = '';
  };

  const toggleWishlist = (id, elem) => {
    if (wishlist.includes(id)) {
      wishlist.splice(wishlist.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishlist.push(id);
      elem.classList.add('active');
    };
    checkCount();
    storageQuery();
  };

  const performBasket = (target, procedure) => {
    
    id = target.dataset.goodsId;
    if (procedure === 'add') {
      if (goodsBasket[id])  {
        goodsBasket[id] += 1;
      } else {
        goodsBasket[id] = 1;
      }
    } else {
      if (goodsBasket[id])  {
        goodsBasket[id] --;
        if (goodsBasket[id] === 0) {
          delete goodsBasket[id];
          //getGoods(renderBasket, showCardBasket);
        }
        //----------
        // const parent = target.closest('.goods-price-count').childNodes[3];
        // parent.textContent = goodsBasket[id];
        getGoods(renderBasket, showCardBasket);//или рендерить корзину 
        //----------
      }
    }
    checkCount();
    cookieQuery();
  }

//хендлеры
  const handlerGoods = event => {
    const target = event.target;

    if (target.classList.contains('card-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    };
    if (target.classList.contains('card-add-cart')) {
      performBasket(target, 'add');
      // let intGoodsPriceSum = parseInt(goodsPriceSum.textContent) + parseInt(target.closest('.card-body').childNodes[3].textContent);
      // console.log('goodsPriceSum.textContent: ', goodsPriceSum.textContent);
      // //intGoodsPriceSum += parseInt(target.closest('.card-body').childNodes[3].textContent);
      // goodsPriceSum.textContent = intGoodsPriceSum;
      // console.log('target: ', target.closest('.card-body').childNodes[3].textContent);// ('.card-price'));
    }
  }

  const handlerBasket = () => {
    const target =  event.target;
    // console.log('target: ', target);
    if (target.classList.contains('goods-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    };
    if (target.classList.contains('goods-delete')) {
      performBasket(target,'del');
    };
  }

//инициализация
  const init = () => {
    getGoods(renderCard, rendomSort);
    storageQuery(true);
    cookieQuery(true);

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapper.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', wishlistRender);
  }

  init();

});