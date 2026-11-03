        //map
        
    function setupMapAndFetchPlaces(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // 1. Create the map FIRST, so it always appears
        const map = L.map('map').setView([lat, lon], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
            .bindPopup('<b>You are here</b>').openPopup();

        // 2. NOW, try to fetch the nearby places
        // We wrap this in a try...catch so it won't crash the map if it fails
        try {
            fetchNearbyPlaces(map, lat, lon);
        } catch (error) {
            console.error("Failed to fetch nearby places:", error);
        }
    }

    // This function now ONLY fetches data
    async function fetchNearbyPlaces(map, lat, lon) {
        const response = await fetch('/api/nearby-places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon })
        });
        
        if (!response.ok) {
            console.error("Error from server fetching places:", response.statusText);
            return;
        }

        const data = await response.json();

        data.elements.forEach(element => {
            if (element.tags && element.tags.name) {
                const placeLat = element.lat || element.center.lat;
                const placeLon = element.lon || element.center.lon;
                
                L.marker([placeLat, placeLon]).addTo(map)
                    .bindPopup(`<b>${element.tags.name}</b><br>${element.tags.tourism}`);
            }
        });
    }

    // The event listener now calls the main setup function
    window.addEventListener('load', () => {
        if (sessionStorage.getItem('userBlockchainId') && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setupMapAndFetchPlaces, (err) => console.error("Could not get location for map.", err));
        }
    });

        async function submitForm(event) {
        event.preventDefault();

        const form = document.querySelector('.contact-form');
        const formData = new FormData(form);

        // Convert FormData → URL-encoded
        const data = new URLSearchParams(formData);

        const response = await fetch("/contact", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data
        });

        const result = await response.json();
        if (result.success) {
            alert(`✅ Thank you, ${result.name}! We’ll respond to ${result.email} soon.`);
            form.reset();
        }
        else{
            alert('Error while fetching server, your response could not be recorded');
        }
        }


        // FAQ toggle functionality
        function toggleFAQ(element) {
            const answer = element.nextElementSibling;
            const toggle = element.querySelector('.faq-toggle');
            
            if (answer.classList.contains('active')) {
                answer.classList.remove('active');
                toggle.textContent = '+';
                element.style.color = '#333';
            } else {
                // Close other open FAQs
                document.querySelectorAll('.faq-answer.active').forEach(openAnswer => {
                    openAnswer.classList.remove('active');
                });
                document.querySelectorAll('.faq-toggle').forEach(openToggle => {
                    openToggle.textContent = '+';
                });
                document.querySelectorAll('.faq-question').forEach(question => {
                    question.style.color = '#333';
                });
                
                // Open clicked FAQ
                answer.classList.add('active');
                toggle.textContent = '−';
                element.style.color = '#6c63ff';
            }
        }

        // Add smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Form validation styling
        document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.required && !this.value) {
                    this.style.borderColor = '#ff6b6b';
                } else if (this.value) {
                    this.style.borderColor = '#4ecdc4';
                }
            });

            input.addEventListener('focus', function() {
                this.style.borderColor = '#6c63ff';
            });
        });
        function activatePanic() {
        if (!confirm("Are you sure you want to send a panic alert? This will share your location with authorities.")) {
            return;
        }

        const blockchainId = sessionStorage.getItem('userBlockchainId');
        if (!blockchainId) {
            alert("Could not identify user. Please verify your ID again.");
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(sendPanicAlert, (error) => {
                alert("Could not get your location. Please enable GPS and try again. Error: " + error.message);
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    }

    async function sendPanicAlert(position) {
        const payload = {
            blockchain_id: sessionStorage.getItem('userBlockchainId'),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        try {
            const response = await fetch('/api/panic-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                alert("Emergency alert sent! Help is on the way.");
            } else {
                alert("Failed to send alert. Server error: " + result.message);
            }

        } catch (error) {
            alert("Failed to send alert. Network error.");
        }
    }

        // SOS Alert Function
        function activateSOS() {
            alert('🚨 SOS Alert System\n\nThis feature allows you to send customized emergency alerts with:\n• Current GPS location\n• Medical information\n• Emergency contact details\n• Incident description');
        }

        // Share Location Function
        function shareLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    alert(`📍 Location Sharing Active\n\nLatitude: ${position.coords.latitude.toFixed(6)}\nLongitude: ${position.coords.longitude.toFixed(6)}\n\nYour location is now being shared with your emergency contacts and stored securely on the blockchain.`);
                });
            } else {
                alert('📍 Location Services\n\nPlease enable location services to use this feature.\n\nThis will help emergency services locate you quickly in case of an incident.');
            }
        }

        // View Incidents Function
        function viewIncidents() {
            alert('📊 Incident Tracking Dashboard\n\nFeatures include:\n• Real-time incident monitoring\n• Historical incident data\n• Safety trend analysis\n• Blockchain-verified incident reports\n• Geographic incident mapping');
        }

        // Connect to Police Function
        function connectPolice() {
            alert('🚔 Police Integration\n\nDirect connection to:\n• Local police departments\n• Emergency response teams\n• Tourist police units\n• 24/7 emergency hotlines\n\nYour digital ID will be automatically verified for faster response.');
        }

        // Add smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active navigation link
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Add loading animation for feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', function() {
                const button = this.querySelector('.card-button');
                const originalText = button.textContent;
                button.textContent = 'Loading...';
                button.style.background = '#95a5a6';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(135deg, #6c63ff, #8b7cf8)';
                }, 1000);
            });
        });
        // Add smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Animate statistics on scroll
        const observerOptions = {
            threshold: 0.5,
            once: true
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        stat.style.animation = 'countUp 2s ease-out';
                    });
                }
            });
        }, observerOptions);

        // Observe statistics section
        const statsSection = document.querySelector('.stats-grid');
        if (statsSection) {
            observer.observe(statsSection);
        }

        // Add CSS animation for count up
        const style = document.createElement('style');
        style.textContent = `
            @keyframes countUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        // Aadhaar submission with updated IDs
const lookupForm = document.getElementById("aadhaar-lookup-form");
const verifyForm = document.getElementById("aadhaar-verify-form");
const lookupResult = document.getElementById("aadhaar-lookup-result");
const verifyResult = document.getElementById("aadhaar-verify-result");
const aadhaarHidden = document.getElementById("aadhaar-hidden-input");

lookupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const aadhaarNumber = document.getElementById("aadhaar-number-input").value;
  
  // Show loading state
  lookupResult.style.display = "block";
  lookupResult.textContent = "Looking up Aadhaar...";
  lookupResult.className = "aadhaar-lookup-result";
  
  try {
    const res = await fetch("/api/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadhaarNumber })
    });
    const data = await res.json();
    
    if (data.ok) {
      lookupResult.textContent = "Aadhaar found. Please verify your details.";
      lookupResult.className = "aadhaar-lookup-result"; // Success styling
      
      // Show verify form with animation
      verifyForm.style.display = "block";
      verifyForm.classList.remove("aadhaar-verify-form-hidden");
      verifyForm.classList.add("aadhaar-verify-form-reveal");
      
      aadhaarHidden.value = aadhaarNumber;
    } else {
      lookupResult.textContent = "Aadhaar not found.";
      lookupResult.className = "aadhaar-lookup-result error"; // Error styling
      
      // Hide verify form if it was shown
      verifyForm.style.display = "none";
      verifyForm.classList.add("aadhaar-verify-form-hidden");
    }
  } catch (error) {
    lookupResult.textContent = "Error occurred while looking up Aadhaar.";
    lookupResult.className = "aadhaar-lookup-result error";
    console.error("Lookup error:", error);
  }
});

// Aadhaar verify with updated IDs
verifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Show loading state
  verifyResult.style.display = "block";
  verifyResult.innerHTML = `
    <div style="text-align: center;">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
      <p>Verifying your details...</p>
    </div>
  `;
  
  const payload = {
    aadhaarNumber: document.getElementById("aadhaar-hidden-input").value,
    fullName: document.getElementById("aadhaar-fullname-input").value,
    dob: document.getElementById("aadhaar-dob-input").value,
    mobile: document.getElementById("aadhaar-mobile-input").value,
    currentTravel: document.getElementById("aadhaar-travel-input").value
  };
  
  try {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    
    if (data.success || data.ok) {
      document.getElementById("aadhaar-verify-result").innerHTML = `
        <div style="text-align: center;">
          <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem;"></i>
          <h4 style="color: #27ae60; margin-bottom: 1rem;">Verification Successful!</h4>
          <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
            <p style="margin: 0; font-weight: 600;"><b>Blockchain ID:</b></p>
            <p style="font-family: 'Courier New', monospace; font-weight: 600; word-break: break-all; margin: 0.5rem 0;">${data.blockchain_id}</p>
          </div>
          <div id="aadhaar-qr-container" style="margin: 1.5rem 0;"></div>
          <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; margin-top: 1.5rem;">
            <p style="margin: 0;">Redirecting to homepage in <span id="aadhaar-countdown" style="font-weight: 700; color: #ffd700;">15</span> seconds...</p>
            <button id="aadhaar-redirect-now" style="background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; margin-top: 10px; cursor: pointer; transition: all 0.3s ease;">
              <i class="fas fa-arrow-right"></i> Redirect Now
            </button>
          </div>
        </div>
      `;
      
      // Store blockchain ID in session storage
      sessionStorage.setItem('userBlockchainId', data.blockchain_id);
     
      // Set user session on backend
      fetch('/api/set-user-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blockchain_id: data.blockchain_id })
      }).catch(error => console.error("Session setup error:", error));
      
      // Generate QR code with updated canvas ID
      try {
        new QRCode(document.getElementById("aadhaar-qr-container"), {
          text: data.blockchain_id,
          width: 150,
          height: 150,
          colorDark: "#2c3e50",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (qrError) {
        console.error("QR Code generation error:", qrError);
        document.getElementById("aadhaar-qr-container").innerHTML = 
          '<p style="color: #e74c3c;">QR Code generation failed</p>';
      }
      
      // Countdown timer
      let seconds = 15;
      const countdownEl = document.getElementById("aadhaar-countdown");
      const interval = setInterval(() => {
        seconds--;
        if (countdownEl) {
          countdownEl.textContent = seconds;
        }
        if (seconds <= 0) {
          clearInterval(interval);
          window.location.href = "/homepage";
        }
      }, 1000);
      
      // Redirect now button
      const redirectBtn = document.getElementById("aadhaar-redirect-now");
      if (redirectBtn) {
        redirectBtn.addEventListener("click", () => {
          clearInterval(interval);
          window.location.href = "/homepage";
        });
        
        // Add hover effect
        redirectBtn.addEventListener("mouseenter", () => {
          redirectBtn.style.background = "#229954";
          redirectBtn.style.transform = "translateY(-2px)";
        });
        
        redirectBtn.addEventListener("mouseleave", () => {
          redirectBtn.style.background = "#27ae60";
          redirectBtn.style.transform = "translateY(0)";
        });
      }
      
    } else {
      document.getElementById("aadhaar-verify-result").innerHTML = `
        <div style="text-align: center;">
          <i class="fas fa-times-circle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
          <h4 style="color: #e74c3c; margin-bottom: 1rem;">Verification Failed</h4>
          <p style="margin: 0;">Please check your details and try again.</p>
          <button onclick="location.reload()" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; margin-top: 15px; cursor: pointer;">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
      `;
    }
  } catch (error) {
    document.getElementById("aadhaar-verify-result").innerHTML = `
      <div style="text-align: center;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 1rem;"></i>
        <h4 style="color: #f39c12; margin-bottom: 1rem;">Connection Error</h4>
        <p style="margin: 0;">Unable to connect to server. Please try again.</p>
        <button onclick="location.reload()" style="background: #f39c12; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; margin-top: 15px; cursor: pointer;">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
    console.error("Verification error:", error);
  }
});

// Additional input formatting and validation
document.addEventListener("DOMContentLoaded", function() {
  // Format Aadhaar number input (only numbers, max 12 digits)
  const aadhaarInput = document.getElementById("aadhaar-number-input");
  if (aadhaarInput) {
    aadhaarInput.addEventListener("input", function(e) {
      // Remove non-numeric characters
      this.value = this.value.replace(/[^0-9]/g, '');
      
      // Limit to 12 digits
      if (this.value.length > 14) {
        this.value = this.value.slice(0, 14);
      }
    });
    
    // Add visual formatting (spaces every 4 digits) for display
    aadhaarInput.addEventListener("blur", function(e) {
      if (this.value.length === 14) {
        // Format as XXXX XXXX XXXX for better readability
        const formatted = this.value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        this.setAttribute('data-formatted', formatted);
      }
    });
  }

  // Format mobile number input (only numbers, max 10 digits)
  const mobileInput = document.getElementById("aadhaar-mobile-input");
  if (mobileInput) {
    mobileInput.addEventListener("input", function(e) {
      // Remove non-numeric characters
      this.value = this.value.replace(/[^0-9]/g, '');
      
      // Limit to 10 digits
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }

  // Validate full name (only letters and spaces)
  const nameInput = document.getElementById("aadhaar-fullname-input");
  if (nameInput) {
    nameInput.addEventListener("input", function(e) {
      // Allow only letters, spaces, and common name characters
      this.value = this.value.replace(/[^a-zA-Z\s.'-]/g, '');
    });
  }

  // Add real-time validation feedback
  const inputs = document.querySelectorAll('.aadhaar-form-input[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim() === '') {
        this.style.borderColor = '#e74c3c';
        this.style.boxShadow = '0 0 0 0.2rem rgba(231, 76, 60, 0.25)';
      } else {
        this.style.borderColor = '#27ae60';
        this.style.boxShadow = '0 0 0 0.2rem rgba(39, 174, 96, 0.25)';
      }
    });
    
    input.addEventListener('focus', function() {
      this.style.borderColor = '#2a5298';
      this.style.boxShadow = '0 0 0 0.2rem rgba(42, 82, 152, 0.25)';
    });
  });
});
//user profile
document.getElementById('add-contact-btn').addEventListener('click', () => {
        const container = document.getElementById('contacts-container');
        const index = container.children.length;

        const newContactRow = document.createElement('div');
        newContactRow.className = 'row mb-2';
        newContactRow.innerHTML = `
            <div class="col">
                <input type="text" name="contacts[${index}][name]" class="form-control" placeholder="Contact Name" required>
            </div>
            <div class="col">
                <input type="tel" name="contacts[${index}][mobile]" class="form-control" placeholder="Mobile Number" required>
            </div>
        `;
        container.appendChild(newContactRow);
    });
//add emergency contact
document.getElementById('add-contact-btn').addEventListener('click', () => {
        const container = document.getElementById('contacts-container');
        // Correctly calculate the next index based on how many rows exist
        const index = container.querySelectorAll('.row').length;

        const newContactRow = document.createElement('div');
        newContactRow.className = 'row mb-2';
        newContactRow.innerHTML = `
            <div class="col">
                <input type="text" name="contacts[${index}][name]" class="form-control" placeholder="Contact Name" required>
            </div>
            <div class="col">
                <input type="tel" name="contacts[${index}][mobile]" class="form-control" placeholder="Mobile Number" required>
            </div>
        `;
        container.appendChild(newContactRow);
    });
    //homepage
    window.addEventListener('load', () => {
    console.log("Homepage script loaded.");

    const blockchainId = sessionStorage.getItem('userBlockchainId');
    
    if (!blockchainId) {
      console.error("ERROR: Could not find 'userBlockchainId' in Session Storage.");
      return;
    }
    
    console.log("SUCCESS: Found blockchainId:", blockchainId);

    if (navigator.geolocation) {
      console.log("Geolocation is supported. Requesting permission...");
      navigator.geolocation.getCurrentPosition(sendPositionToServer, showError);
    } else {
      console.error("ERROR: Geolocation is not supported by this browser.");
    }
  });

  async function sendPositionToServer(position) {
    console.log("SUCCESS: Geolocation permission granted.");
    const payload = {
      blockchain_id: sessionStorage.getItem('userBlockchainId'),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    console.log("Sending location payload to server:", payload);
    // ... the rest of the fetch logic ...
    try {
      const response = await fetch('/api/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('Location update result:', result);
    } catch (error) {
      console.error('Failed to send location to server:', error);
    }
  }

  function showError(error) {
    // This function runs if the user clicks "Block" or an error occurs
    console.error("Geolocation Error Code:", error.code, error.message);
  }


