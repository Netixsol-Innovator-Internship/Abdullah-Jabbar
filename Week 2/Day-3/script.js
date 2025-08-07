document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("menu-toggle");
  const navPanel = document.getElementById("mobile-nav-panel");

  // ✅ Toggle nav panel
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from bubbling to document
    navPanel.classList.toggle("-translate-x-full");
    navPanel.classList.toggle("translate-x-0");
  });

  // ✅ Close nav panel on outside click
  document.addEventListener("click", (e) => {
    const isClickInsidePanel = navPanel.contains(e.target);
    const isClickOnToggle = toggleBtn.contains(e.target);
    const isPanelOpen = !navPanel.classList.contains("-translate-x-full");

    if (!isClickInsidePanel && !isClickOnToggle && isPanelOpen) {
      navPanel.classList.add("-translate-x-full");
      navPanel.classList.remove("translate-x-0");
    }
  });

  // ✅ Optional: Close on focus-out (keyboard navigation)
  document.addEventListener("focusin", (e) => {
    const isFocusInside =
      navPanel.contains(e.target) || toggleBtn.contains(e.target);
    const isPanelOpen = !navPanel.classList.contains("-translate-x-full");

    if (!isFocusInside && isPanelOpen) {
      navPanel.classList.add("-translate-x-full");
      navPanel.classList.remove("translate-x-0");
    }
  });

  //  Highlight current nav link (works for both desktop + mobile if .nav-link used)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      document
        .querySelectorAll(".nav-link")
        .forEach((l) =>
          l.classList.remove("bg-[#FC8A06]", "dark:bg-blue-900", "text-white")
        );
      this.classList.add("bg-[#FC8A06]", "dark:bg-blue-900", "text-white");
    });
  });

document.querySelectorAll(".category-link").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Remove selected styles from all buttons
    document.querySelectorAll(".category-link").forEach((el) => {
      el.classList.remove("bg-[#000000]", "text-white", "px-8", "py-2");
    });

    // Add selected styles to the clicked button
    this.classList.add("bg-[#000000]", "text-white", "px-8", "py-2");
  });
});




  const productCardsData = [
    // Burgers
    {
      type: "burger",
      title: "Royal Cheese Burger<br />with extra Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: "GBP 23.10",
      image: "assets/images/burgers/burger1.png",
    },
    {
      type: "burger",
      title: "The classics for 3",
      description:
        "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks",
      price: "GBP 23.10",
      image: "assets/images/burgers/burger2.png",
    },
    {
      type: "burger",
      title: "The classics for 3",
      description:
        "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks",
      price: "GBP 23.10",
      image: "assets/images/burgers/burger3.png",
    },
    {
      type: "burger",
      title: "The classics for 3",
      description:
        "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks",
      price: "GBP 23.10",
      image: "assets/images/burgers/burger4.png",
    },
    {
      type: "burger",
      title: "The classics for 3",
      description:
        "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks",
      price: "GBP 23.10",
      image: "assets/images/burgers/burger5.png",
    },
    {
      type: "burger",
      title: "Royal Cheese Burger<br />with extra Fries",
      description: "1 McChicken™, 1 Big Mac™, 1 Royal Cheeseburger, 3 medium",
      price: "GBP 23.10",
      image: "assets/images/burgers/burger6.png",
    },

    // Fries
    {
      type: "fries",
      title: "Crispy French Fries",
      description: "Golden crispy fries served with ketchup and mayo dips",
      price: "GBP 5.99",
      image: "assets/images/fries/fries1.png",
    },
    {
      type: "fries",
      title: "Spicy Curly Fries",
      description: "Curly fries seasoned with spicy herbs and served hot",
      price: "GBP 6.49",
      image: "assets/images/fries/fries2.png",
    },
    {
      type: "fries",
      title: "Loaded Cheese Fries",
      description:
        "Fries loaded with cheddar, jalapenos, and creamy cheese sauce",
      price: "GBP 7.20",
      image: "assets/images/fries/fries3.png",
    },
    {
      type: "fries",
      title: "Classic French Fries",
      description: "Traditional fries, crispy and lightly salted",
      price: "GBP 4.99",
      image: "assets/images/fries/fries4.png",
    },
    {
      type: "fries",
      title: "Sweet Potato Fries",
      description: "Crispy sweet potato fries with a touch of sea salt",
      price: "GBP 6.20",
      image: "assets/images/fries/fries5.png",
    },
    {
      type: "fries",
      title: "Garlic Parmesan Fries",
      description: "Fries tossed in garlic butter and topped with parmesan",
      price: "GBP 6.99",
      image: "assets/images/fries/fries6.png",
    },

    // Drinks
    {
      type: "drink",
      title: "Chilled Cola",
      description: "Classic cola served chilled with ice",
      price: "GBP 2.50",
      image: "assets/images/drinks/drink1.png",
    },
    {
      type: "drink",
      title: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice with no added sugar",
      price: "GBP 3.25",
      image: "assets/images/drinks/drink2.png",
    },
    {
      type: "drink",
      title: "Mango Smoothie",
      description: "Rich mango smoothie made with real fruit and yogurt",
      price: "GBP 3.95",
      image: "assets/images/drinks/drink3.png",
    },
    {
      type: "drink",
      title: "Iced Latte",
      description: "Cold espresso with milk over ice",
      price: "GBP 3.50",
      image: "assets/images/drinks/drink4.png",
    },
    {
      type: "drink",
      title: "Mint Lemonade",
      description: "Zesty lemonade blended with mint leaves",
      price: "GBP 2.99",
      image: "assets/images/drinks/drink5.png",
    },
    {
      type: "drink",
      title: "Chocolate Shake",
      description: "Thick chocolate shake topped with whipped cream",
      price: "GBP 4.20",
      image: "assets/images/drinks/drink6.png",
    },
  ];

  const reviews = [
    {
      name: "St Glx",
      location: "South London",
      rating: "★★★★★",
      date: "24th September, 2023",
      image: "assets/images/reviews/Reviewer.png",
      timeIcon: "assets/images/reviews/Time Span.svg",
      verticalLine: "assets/images/reviews/vertical-line.svg",
      review:
        "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald’s standard – hot and satisfying.",
    },
    {
      name: "Lara M.",
      location: "Birmingham",
      rating: "★★★★☆",
      date: "12th August, 2023",
      image: "assets/images/reviews/Reviewer.png",
      timeIcon: "assets/images/reviews/Time Span.svg",
      verticalLine: "assets/images/reviews/vertical-line.svg",
      review:
        "Great customer service and fresh food. The waiting time was a bit long, but overall it was a pleasant experience. The staff handled the rush hour well, and even offered suggestions for kids' meals. Clean environment and efficient ordering system. Would definitely visit again.",
    },
    {
      name: "James R.",
      location: "Manchester",
      rating: "★★★☆☆",
      date: "5th July, 2023",
      image: "assets/images/reviews/Reviewer.png",
      timeIcon: "assets/images/reviews/Time Span.svg",
      verticalLine: "assets/images/reviews/vertical-line.svg",
      review:
        "The service was okay. Staff were polite, but the food wasn’t as hot as expected. Could improve consistency. It exceeded expectations. Definitely coming back.",
    },
    {
      name: "Priya K.",
      location: "Leeds",
      rating: "★★★★★",
      date: "29th June, 2023",
      image: "assets/images/reviews/Reviewer.png",
      timeIcon: "assets/images/reviews/Time Span.svg",
      verticalLine: "assets/images/reviews/vertical-line.svg",
      review:
        "Loved everything! The staff went above and beyond, and the food quality was excellent. I especially appreciated how the staff handled my dietary preferences without any hesitation. The ambiance was clean and calm, perfect for a quick lunch or casual meetup. ",
    },
    {
      name: "Tom B.",
      location: "Liverpool",
      rating: "★★★★☆",
      date: "18th May, 2023",
      image: "assets/images/reviews/Reviewer.png",
      timeIcon: "assets/images/reviews/Time Span.svg",
      verticalLine: "assets/images/reviews/vertical-line.svg",
      review:
        "Food was good and service was quick. The self-order kiosks helped speed things up and the staff was attentive. We had a minor issue with an order, but it was fixed quickly and politely. Overall, a positive experience with room for improvement.",
    },
    {
      name: "Ayesha Z.",
      location: "Glasgow",
      rating: "★★☆☆☆",
      date: "10th April, 2023",
      image: "assets/images/reviews/Reviewer.png",
      timeIcon: "assets/images/reviews/Time Span.svg",
      verticalLine: "assets/images/reviews/vertical-line.svg",
      review:
        "Unfortunately, my experience wasn’t the best. The service was slow and my order was incorrect. While the manager was kind enough to fix it, the delay made it difficult to enjoy the rest of the visit.",
    },
    {
      name: "Haroon T.",
      location: "Nottingham",
      rating: "★★★★★",
      date: "2nd March, 2023",
      image: "assets/images/reviews/Reviewer.png",
      timeIcon: "assets/images/reviews/Time Span.svg",
      verticalLine: "assets/images/reviews/vertical-line.svg",
      review:
        "One of the best visits I’ve had in a long time. Everything from the entrance to the checkout was seamless. The fries were perfectly salted and the burger freshly prepared. Even the staff looked genuinely happy to help. Highly recommended!",
    },
  ];



  const renderCards = (type, containerId) => {
  const container = document.getElementById(containerId);
  const filteredCards = productCardsData.filter(card => card.type === type);

  filteredCards.forEach((card) => {
    const cardHTML = `
      <div class="max-w-md max-h-60 2xl:min-w-md 2xl:min-h-60 flex justify-between items-start p-6 rounded-xl border-2 border-white shadow-xl bg-white">
        <!-- left text -->
        <div class="w-full sm:w-1/2 flex flex-col justify-between gap-y-1 sm:gap-y-2 md:gap-y-3 font-poppins">
          <h3 class="font-bold text-base sm:text-lg leading-tight">
            ${card.title}
          </h3>
          <p class="text-xs sm:text-sm text-gray-600">${card.description}</p>
          <p class="font-bold text-sm sm:text-base mt-0 sm:mt-1 md:mt-2">${card.price}</p>
        </div>

        <!-- right image -->
        <div class="w-1/2 relative ml-4">
          <img src="${card.image}" alt="Item Image" class="w-full h-full object-cover rounded-lg" />
          <div class="absolute bottom-0 right-0 w-14 h-14 sm:w-20 sm:h-20 bg-white opacity-85 rounded-tl-[45px] rounded-br-[12px] p-2 shadow-md flex items-center justify-center">
            <button class="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-transparent border-none focus:outline-none hover:opacity-90 transition">
              <img src="assets/images/burgers/Plus.png" alt="Plus Icon" class="cursor-pointer w-full h-full object-contain" />
            </button>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
};



  let startIndex = 0;
  const visibleCount = 3;
  const container = document.getElementById("reviews-grid");

  function renderReviews() {
    container.innerHTML = ""; // Clear previous cards

    const visibleReviews = reviews.slice(startIndex, startIndex + visibleCount);

    visibleReviews.forEach((review) => {
      const card = document.createElement("div");
      card.className =
        "bg-white xl:min-w-125 xl:min-h-60 p-6 rounded-md shadow-md";
      card.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <img src="${review.image}" alt="Avatar" class="w-13.5 h-13.5 rounded-full">
            <img src="${review.verticalLine}" alt="" class="2xl:h-12.5">
            <div>
              <p class="font-bold">${review.name}</p>
              <p class="text-sm text-[#FC8A06]">${review.location}</p>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <p class="text-[#FC8A06] text-2xl">${review.rating}</p>
            <p class="text-black text-md flex items-center gap-2">
              <img src="${review.timeIcon}" alt="">
              ${review.date}
            </p>
          </div>
        </div>
        <p class="text-lg">${review.review}</p>
      `;
      container.appendChild(card);
    });
  }

  // Navigation
  const leftBtn = document.querySelector("button svg path[d*='M15']");
  const rightBtn = document.querySelector("button svg path[d*='M9']");

  leftBtn.parentElement.addEventListener("click", () => {
    if (startIndex > 0) {
      startIndex--;
      renderReviews();
    }
  });

  rightBtn.parentElement.addEventListener("click", () => {
    if (startIndex + visibleCount < reviews.length) {
      startIndex++;
      renderReviews();
    }
  });

  // Initial render
renderReviews();




// Render all categories
renderCards("burger", "burger-cards-container");
renderCards("fries", "fries-cards-container");
renderCards("drink", "drinks-cards-container");

});
