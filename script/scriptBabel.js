"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
  var search = document.querySelector('.search'),
      cartBtn = document.getElementById('cart');
  wishlistBtn = document.getElementById('wishlist');
  goodsWrapper = document.querySelector('.goods-wrapper'), cart = document.querySelector('.cart'), category = document.querySelector('.category'), cardCounter = cartBtn.querySelector('.counter'), wishlistCounter = wishlistBtn.querySelector('.counter'), cartWrapper = document.querySelector('.cart-wrapper'), goodsPriceSum = document.querySelector('.cart-total span');
  var wishlist = [];
  var goodsBasket = {}; //goodsWrapper.innerHTML

  var loading = function loading(nameFunction) {
    var spiner = " \n    <div id=\"spinner\">\n      <div class=\"spinner-loading\">\n        <div>\n          <div>\n            <div></div>\n          </div>\n          <div>\n            <div></div>\n          </div>\n          <div>\n            <div></div>\n          </div>\n          <div><div>\n        </div>\n      </div>\n    </div>";

    if (nameFunction === 'renderCard') {
      goodsWrapper.innerHTML = spiner;
    }

    if (nameFunction === 'renderBasket') {
      cartWrapper.innerHTML = spiner;
    }
  }; //запрос на сервер


  var getGoods = function getGoods(hendler, filter) {
    loading(hendler.name);
    fetch('db/db.json').then(function (response) {
      return response.json();
    }).then(filter).then(hendler);
  }; //Генерация карточек


  var createCardGoods = function createCardGoods(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = "<div class=\"card\">\n          <div class=\"card-img-wrapper\">\n            <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"\">\n            <button class=\"card-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\"\n              data-goods-id=\"").concat(id, "\"></button>\n          </div>\n          <div class=\"card-body justify-content-between\">\n            <a href=\"#\" class=\"card-title\">\"").concat(title, "\"</a>\n            <div class=\"card-price\">\"").concat(price, "\" \u20BD</div>\n            <div>\n              <button class=\"card-add-cart\"\n                data-goods-id=\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n            </div>\n          </div>\n        </div>");
    return card;
  }; //рендер товаров в корзине


  var createCardBasket = function createCardBasket(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = "\n      <div class=\"goods-img-wrapper\">\n        <img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n      </div>\n      <div class=\"goods-description\">\n        <h2 class=\"goods-title\">").concat(title, "</h2>\n        <p class=\"goods-price\">").concat(price, "</p>\n      </div>\n      <div class=\"goods-price-count\">\n        <div class=\"goods-trigger\">\n          <button class=\"goods-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\" data-goods-id=\"").concat(id, "\"></button>\n          <button class=\"goods-delete\" data-goods-id=\"").concat(id, "\"></button>\n        </div>\n        <div class=\"goods-count\">").concat(goodsBasket[id], "</div>\n      </div>\n    ");
    return card;
  }; //рендеры


  var renderCard = function renderCard(goods) {
    goodsWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref) {
        var id = _ref.id,
            title = _ref.title,
            price = _ref.price,
            imgMin = _ref.imgMin;
        goodsWrapper.append(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = '❌ ' + 'Извините, мы не нашли товаров по вашему запросу';
    }
  };

  var renderBasket = function renderBasket(goods) {
    cartWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref2) {
        var id = _ref2.id,
            title = _ref2.title,
            price = _ref2.price,
            imgMin = _ref2.imgMin;
        cartWrapper.append(createCardBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty"> Ваша корзина пока пуста</div>';
    }
  };

  var wishlistRender = function wishlistRender() {
    getGoods(renderCard, function (goods) {
      return goods.filter(function (item) {
        return wishlist.includes(item.id);
      });
    });
  }; //калькуляция  


  var calcTotalPrice = function calcTotalPrice(goods) {
    //let sum = 0;
    var sum = goods.reduce(function (accum, item) {
      return accum + item.price * goodsBasket[item.id];
    }, 0); // for (const item of goods) {
    //   sum += item.price * goodsBasket[item.id];
    // }

    goodsPriceSum.textContent = sum.toFixed(2);
  };

  var checkCount = function checkCount() {
    wishlistCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
  }; //фльтры


  var showCardBasket = function showCardBasket(goods) {
    var basketGoods = goods.filter(function (item) {
      return goodsBasket.hasOwnProperty(item.id);
    });
    calcTotalPrice(basketGoods);
    return basketGoods;
  };

  var rendomSort = function rendomSort(item) {
    return item.sort(function () {
      return Math.random() - 0.5;
    });
  }; //работа с хранилещами


  var getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  var cookieQuery = function cookieQuery(get) {
    if (get) {
      if (getCookie('goodsBasket')) {
        //document.cookie != ""
        Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket'))); //goodsBasket = JSON.parse(getCookie('goodsBasket'));
      }

      checkCount();
    } else {
      document.cookie = "goodsBasket=".concat(JSON.stringify(goodsBasket), "; max-age=86400e");
    } // console.log('goodsBasket: ', goodsBasket);
    // console.log('cookie: ', document.cookie);

  };

  var storageQuery = function storageQuery(get) {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        wishlist.push.apply(wishlist, _toConsumableArray(JSON.parse(localStorage.getItem('wishlist')))); // wishlist.splice(Infinity, 0, ...JSON.parse
        //   (localStorage.getItem('wishlist')));
        // JSON.parse(localStorage.getItem('wishlist')).
        //   forEach(id => wishlist.push(id));
      }

      checkCount();
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }; //события


  var closeCart = function closeCart(event) {
    if (event.target === cart || event.target.classList.contains('cart-close') || event.keyCode === 27) {
      cart.style.display = ''; //делегирование
    }

    ;
    document.removeEventListener('keydown', closeCart);
  };

  var openCart = function openCart(event) {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keydown', closeCart);
    getGoods(renderBasket, showCardBasket);
  };

  var choiceCategory = function choiceCategory(event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('category-item')) {
      var _category = target.dataset.category;
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return item.category.includes(_category);
        });
      });
    }

    ;
  };

  var searchGoods = function searchGoods(event) {
    event.preventDefault();
    var input = event.target.elements.searchGoods;
    var inputValue = input.value.trim();

    if (inputValue !== '') {
      var searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return searchString.test(item.title);
        });
      });
    } else {
      search.classList.add('error');
      setTimeout(function () {
        search.classList.remove('error');
      }, 2000);
    }

    ;
    input.value = '';
  };

  var toggleWishlist = function toggleWishlist(id, elem) {
    if (wishlist.includes(id)) {
      wishlist.splice(wishlist.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishlist.push(id);
      elem.classList.add('active');
    }

    ;
    checkCount();
    storageQuery();
  };

  var performBasket = function performBasket(target, procedure) {
    id = target.dataset.goodsId;

    if (procedure === 'add') {
      if (goodsBasket[id]) {
        goodsBasket[id] += 1;
      } else {
        goodsBasket[id] = 1;
      }
    } else {
      if (goodsBasket[id]) {
        goodsBasket[id]--;

        if (goodsBasket[id] === 0) {
          delete goodsBasket[id]; //getGoods(renderBasket, showCardBasket);
        } //----------
        // const parent = target.closest('.goods-price-count').childNodes[3];
        // parent.textContent = goodsBasket[id];


        getGoods(renderBasket, showCardBasket); //или рендерить корзину 
        //----------
      }
    }

    checkCount();
    cookieQuery();
  }; //хендлеры


  var handlerGoods = function handlerGoods(event) {
    var target = event.target;

    if (target.classList.contains('card-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    }

    ;

    if (target.classList.contains('card-add-cart')) {
      performBasket(target, 'add'); // let intGoodsPriceSum = parseInt(goodsPriceSum.textContent) + parseInt(target.closest('.card-body').childNodes[3].textContent);
      // console.log('goodsPriceSum.textContent: ', goodsPriceSum.textContent);
      // //intGoodsPriceSum += parseInt(target.closest('.card-body').childNodes[3].textContent);
      // goodsPriceSum.textContent = intGoodsPriceSum;
      // console.log('target: ', target.closest('.card-body').childNodes[3].textContent);// ('.card-price'));
    }
  };

  var handlerBasket = function handlerBasket() {
    var target = event.target; // console.log('target: ', target);

    if (target.classList.contains('goods-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    }

    ;

    if (target.classList.contains('goods-delete')) {
      performBasket(target, 'del');
    }

    ;
  }; //инициализация


  var init = function init() {
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
  };

  init();
});