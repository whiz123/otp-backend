<script>
async function loadData() {
  try {
    const countrySelect = document.getElementById("country");
    const serviceSelect = document.getElementById("service");

    // 🌍 TOP COUNTRIES (GLOBAL DEMAND)
    const countries = [
      "usa", "england", "canada", "india", "nigeria",
      "germany", "france", "netherlands", "sweden",
      "brazil", "spain", "italy", "turkey",
      "indonesia", "philippines", "southafrica"
    ];

    countrySelect.innerHTML = "";

    countries.forEach(c => {
      const option = document.createElement("option");
      option.value = c;
      option.text = c.toUpperCase();
      countrySelect.appendChild(option);
    });

    // 🔥 POPULAR SERVICES (WHAT PEOPLE BUY)
    const popularServices = [
      "whatsapp",
      "telegram",
      "facebook",
      "instagram",
      "twitter",
      "tiktok",
      "twitch",
      "google",
      "googlevoice",
      "youtube"
    ];

    // 🎯 FORMAT NAME
    function formatName(name) {
      return name
        .replace("googlevoice", "Google Voice")
        .replace("youtube", "YouTube")
        .replace("tiktok", "TikTok")
        .replace("twitter", "Twitter")
        .replace("whatsapp", "WhatsApp")
        .replace("telegram", "Telegram")
        .replace("facebook", "Facebook")
        .replace("instagram", "Instagram")
        .replace("twitch", "Twitch")
        .replace("google", "Google");
    }

    // 📱 LOAD SERVICES FROM 5SIM
    async function loadServices() {
      const selectedCountry = countrySelect.value;

      serviceSelect.innerHTML = "<option>Loading...</option>";

      const res = await fetch(
        `https://5sim.net/v1/guest/prices?country=${selectedCountry}`
      );

      const data = await res.json();

      const services = Object.keys(data);

      serviceSelect.innerHTML = "";

      // ✅ SHOW ONLY POPULAR SERVICES AVAILABLE
      popularServices.forEach(ps => {
        const match = services.find(s => s.includes(ps));

        if (match) {
          const option = document.createElement("option");
          option.value = match;
          option.text = formatName(ps);
          serviceSelect.appendChild(option);
        }
      });

      // ❌ IF NOTHING FOUND
      if (serviceSelect.innerHTML === "") {
        serviceSelect.innerHTML = "<option>No services available</option>";
      }
    }

    // 🚀 DEFAULT LOAD
    countrySelect.value = "usa";
    await loadServices();

    // 🔁 CHANGE COUNTRY
    countrySelect.addEventListener("change", loadServices);

  } catch (err) {
    alert("Error loading data");
    console.log(err);
  }
}

loadData();
</script>
