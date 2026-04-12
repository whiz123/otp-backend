<script>
async function loadData() {
  try {
    const countrySelect = document.getElementById("country");
    const serviceSelect = document.getElementById("service");

    async function fetchData(url) {
      const res = await fetch(url);
      return await res.json();
    }

    // 🔥 POPULAR SERVICES (LIKE 5SIM DASHBOARD)
    const popularServices = [
      "whatsapp",
      "telegram",
      "facebook",
      "instagram",
      "google",
      "twitter",
      "tiktok",
      "amazon",
      "discord",
      "linkedin"
    ];

    // 🎯 FORMAT NAME (CLEAN UI)
    function formatName(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // 📱 LOAD SERVICES
    serviceSelect.innerHTML = "";

    popularServices.forEach(s => {
      const option = document.createElement("option");
      option.value = s;
      option.text = formatName(s);
      serviceSelect.appendChild(option);
    });

    // 🌍 LOAD COUNTRIES BASED ON SERVICE
    async function loadCountries() {
      const selectedService = serviceSelect.value;

      countrySelect.innerHTML = "<option>Loading countries...</option>";

      const countries = await fetchData(
        "https://otp-backend-srw4.onrender.com/countries"
      );

      let validCountries = [];

      // 🔍 CHECK EACH COUNTRY
      for (let c of countries) {
        try {
          const services = await fetchData(
            `https://otp-backend-srw4.onrender.com/services?country=${c}`
          );

          if (services.includes(selectedService)) {
            validCountries.push(c);
          }
        } catch (err) {
          continue;
        }
      }

      countrySelect.innerHTML = "";

      // ✅ SHOW ONLY VALID COUNTRIES
      validCountries.forEach(c => {
        const option = document.createElement("option");
        option.value = c;
        option.text = c.toUpperCase();
        countrySelect.appendChild(option);
      });

      // ❌ IF NONE FOUND
      if (validCountries.length === 0) {
        countrySelect.innerHTML = "<option>No countries available</option>";
      }
    }

    // 🚀 INITIAL LOAD
    await loadCountries();

    // 🔁 CHANGE SERVICE → UPDATE COUNTRIES
    serviceSelect.addEventListener("change", loadCountries);

  } catch (err) {
    alert("Error loading data. Please refresh.");
    console.log(err);
  }
}

// 🟢 BUY BUTTON
document.getElementById("buyBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter your email");
    return;
  }

  alert("Next: payment integration 💰");
});

// 🚀 START
loadData();
</script>
