document.addEventListener("DOMContentLoaded", function () {
  var readAllBtn = document.getElementById("readAll");
  var notifications = document.querySelectorAll(".noti-fication");
  var counterBox = document.getElementById("counterBox");

  // Function to update visual state based on isread
  function updateNotifications() {
    var unreadCount = 0;

    notifications.forEach(function (noti) {
      var isRead = noti.getAttribute("isread") === "true";
      var redDot = noti.querySelector(".red-dot");

      // Apply background
      noti.classList.remove("bg-blue-50", "bg-white");
      if (isRead) {
        noti.classList.add("bg-white");
        noti.classList.remove("shadow-sm");
      } else {
        noti.classList.add("bg-blue-50");
      }

      // Toggle red dot
      if (redDot) {
        redDot.classList.toggle("hidden", isRead);
        redDot.classList.toggle("inline-block", !isRead);
      }

      // Count unread
      if (!isRead) {
        unreadCount++;
      }
    });

    // Update counter
    counterBox.textContent = unreadCount.toString();
  }

  // Initial render
  updateNotifications();

  // Handle "Mark all as read" click
  readAllBtn.addEventListener("click", function () {
    notifications.forEach(function (noti) {
      noti.setAttribute("isread", "true");
    });
    updateNotifications();
  });

  // Handle individual notification click
  notifications.forEach(function (item) {
    item.addEventListener("click", function () {
      if (this.getAttribute("isread") !== "true") {
        this.setAttribute("isread", "true");
        updateNotifications();
      }
    });
  });
});
