document.addEventListener('DOMContentLoaded', () => {
    const startChatBtn = document.getElementById('startChatBtn');
    const chatInterface = document.getElementById('chatInterface');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const sidebarChatBtn = document.getElementById('sidebarChatBtn');
    const homeBtn = document.getElementById('homeBtn');
    const qaAskAssistant = document.getElementById('qaAskAssistant');
    const toolsBtn = document.getElementById('toolsBtn');
    const qaScheduleWatering = document.getElementById('qaScheduleWatering');
    const tipsBtn = document.getElementById('tipsBtn');
    // Weather UI elements
    const weatherCityLabel = document.getElementById('weatherCityLabel');
    const weatherCityInput = document.getElementById('weatherCityInput');
    const weatherSetCityBtn = document.getElementById('weatherSetCityBtn');
    // Todo UI elements
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    // Check if all required elements exist (startChatBtn is optional)
    if (!chatInterface || !sendBtn || !userInput || !chatBox || !closeChat) {
        console.error('Chatbot elements not found in DOM');
        return;
    }

    // ===== Tips logic =====
    const DAILY_TIPS = [
        'Water early morning to reduce evaporation.',
        'Mulch 5–7 cm to retain moisture and suppress weeds.',
        'Check soil moisture 5 cm deep before watering.',
        'Rotate crops to reduce disease and pest buildup.',
        'Sterilize pruning tools to prevent disease spread.'
    ];
    const dailyTipText = document.getElementById('dailyTipText');
    const nextTipBtn = document.getElementById('nextTipBtn');
    let tipIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % DAILY_TIPS.length; // rotate by day
    function renderDailyTip() {
        if (dailyTipText) dailyTipText.textContent = DAILY_TIPS[tipIndex];
    }
    if (nextTipBtn) {
        nextTipBtn.addEventListener('click', () => {
            tipIndex = (tipIndex + 1) % DAILY_TIPS.length;
            renderDailyTip();
        });
    }
    renderDailyTip();

    const tipsRegion = document.getElementById('tipsRegion');
    const seasonalAdviceText = document.getElementById('seasonalAdviceText');
    function updateSeasonalAdvice() {
        if (!seasonalAdviceText || !tipsRegion) return;
        const month = new Date().getMonth(); // 0-11
        const region = tipsRegion.value;
        let advice = 'Most months are suitable in the tropics.';
        if (region === 'north') {
            if (month <= 1) advice = 'Prepare beds; start seeds indoors. Watch for frost.';
            else if (month <= 4) advice = 'Plant after last frost; protect from late cold snaps.';
            else if (month <= 7) advice = 'Mulch and water consistently through heat.';
            else advice = 'Plan autumn crops; protect from early frost.';
        } else if (region === 'south') {
            if (month >= 6 && month <= 9) advice = 'Plant after last frost; protect young plants.';
            else if (month <= 1) advice = 'Mulch and irrigate in heat; shade cloth if needed.';
            else advice = 'Plan spring crops; start seeds indoors.';
        }
        seasonalAdviceText.textContent = advice;
    }
    if (tipsRegion) {
        tipsRegion.addEventListener('change', updateSeasonalAdvice);
        updateSeasonalAdvice();
    }

    // Pest of the Week (static sample)
    const pestName = document.getElementById('pestName');
    const pestTipText = document.getElementById('pestTipText');
    if (pestName && pestTipText) {
        // Could rotate weekly; keep static for now
        pestName.textContent = 'Aphids';
        pestTipText.textContent = 'Check leaf undersides; spray mild soapy water and encourage ladybugs.';
    }

    // Profile functionality
    const profileForm = document.getElementById('profileForm');
    const notifForm = document.getElementById('notifForm');
    const farmNameInput = document.getElementById('farmName');
    const farmTypeSelect = document.getElementById('farmType');
    const notifWeather = document.getElementById('notifWeather');
    const notifWatering = document.getElementById('notifWatering');
    const notifPests = document.getElementById('notifPests');

    // Load saved profile data
    function loadProfile() {
        const profile = JSON.parse(localStorage.getItem('farmProfile')) || {};
        if (profile.farmName) farmNameInput.value = profile.farmName;
        if (profile.farmType) farmTypeSelect.value = profile.farmType;
        if (profile.notifications) {
            const notifs = profile.notifications;
            if (notifs.weather !== undefined) notifWeather.checked = notifs.weather;
            if (notifs.watering !== undefined) notifWatering.checked = notifs.watering;
            if (notifs.pests !== undefined) notifPests.checked = notifs.pests;
        }
    }

    // Save profile data
    function saveProfile() {
        const profile = {
            farmName: farmNameInput.value,
            farmType: farmTypeSelect.value,
            notifications: {
                weather: notifWeather.checked,
                watering: notifWatering.checked,
                pests: notifPests.checked
            },
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('farmProfile', JSON.stringify(profile));
        
        // Show save confirmation
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saved!';
        setTimeout(() => {
            submitBtn.textContent = originalText;
        }, 2000);
    }

    // Event listeners
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfile();
        });
    }

    // Save notification changes immediately
    if (notifForm) {
        notifForm.addEventListener('change', saveProfile);
    }

    // Load profile when page loads
    document.addEventListener('DOMContentLoaded', loadProfile);

    // Quick Action: Schedule Watering jumps to Tools section and focuses Watering form
    if (qaScheduleWatering) {
        qaScheduleWatering.addEventListener('click', () => {
            const toolsSection = document.getElementById('toolsSection');
            if (toolsSection) {
                toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // After scrolling, try to focus a field in the watering form
                setTimeout(() => {
                    const bedArea = document.getElementById('bedArea');
                    if (bedArea && bedArea.focus) bedArea.focus();
                }, 400);
            }
        });
    }

    // Planting Calendar
    const plantForm = document.getElementById('plantForm');
    const plantResult = document.getElementById('plantResult');
    if (plantForm && plantResult) {
        plantForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const crop = /** @type {HTMLSelectElement} */(document.getElementById('plantCrop')).value;
            const region = /** @type {HTMLSelectElement} */(document.getElementById('region')).value;
            const dateStr = /** @type {HTMLInputElement} */(document.getElementById('plantDate')).value;
            const baseDays = { 'Tomato': 75, 'Cucumber': 55, 'Leafy Greens': 35, 'Chili': 90 };
            const adjustByRegion = { tropics: 0, north: 10, south: 10 };

            const daysToHarvest = (baseDays[crop] ?? 60) + (adjustByRegion[region] ?? 0);

            // Planting window heuristic
            const now = new Date();
            let windowText = 'Most months are suitable in the tropics';
            if (region === 'north') windowText = 'Plant after last frost (Mar–Jun)';
            if (region === 'south') windowText = 'Plant after last frost (Sep–Dec)';

            let harvestDateText = '—';
            if (dateStr) {
                const start = new Date(dateStr);
                const harvest = new Date(start);
                harvest.setDate(harvest.getDate() + daysToHarvest);
                harvestDateText = harvest.toLocaleDateString();
            } else {
                const harvest = new Date(now);
                harvest.setDate(harvest.getDate() + daysToHarvest);
                harvestDateText = harvest.toLocaleDateString();
            }

            plantResult.innerHTML = `
                <p><strong>Recommended window:</strong> ${windowText}</p>
                <p><strong>Estimated harvest:</strong> ${harvestDateText} (${daysToHarvest} days)</p>
                <p class="hint">Use your local frost dates and weather to fine-tune.</p>
            `;
        });
    }

    // Unit Converter
    const convertForm = document.getElementById('convertForm');
    const convType = document.getElementById('convType');
    const convValue = document.getElementById('convValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertResult = document.getElementById('convertResult');

    const UNIT_SETS = {
        area: [
            { key: 'm2', label: 'm²', toBase: (v) => v, fromBase: (v) => v },
            { key: 'ft2', label: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
            { key: 'acre', label: 'acre', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 }
        ],
        volume: [
            { key: 'L', label: 'Liter (L)', toBase: (v) => v, fromBase: (v) => v },
            { key: 'gal', label: 'Gallon (US)', toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 }
        ],
        rate: [
            // base: g/m²
            { key: 'g_m2', label: 'g/m²', toBase: (v) => v, fromBase: (v) => v },
            { key: 'kg_ha', label: 'kg/ha', toBase: (v) => v / 10, fromBase: (v) => v * 10 }, // 1 kg/ha = 0.1 g/m²
            { key: 'lb_acre', label: 'lb/acre', toBase: (v) => v * 1.12085, fromBase: (v) => v / 1.12085 }
        ]
    };

    function populateUnits(type) {
        const set = UNIT_SETS[type] || UNIT_SETS.area;
        if (!fromUnit || !toUnit) return;
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        set.forEach(u => {
            const o1 = document.createElement('option'); o1.value = u.key; o1.textContent = u.label;
            const o2 = document.createElement('option'); o2.value = u.key; o2.textContent = u.label;
            fromUnit.appendChild(o1); toUnit.appendChild(o2);
        });
        if (type === 'area') { fromUnit.value = 'm2'; toUnit.value = 'ft2'; }
        if (type === 'volume') { fromUnit.value = 'L'; toUnit.value = 'gal'; }
        if (type === 'rate') { fromUnit.value = 'g_m2'; toUnit.value = 'kg_ha'; }
    }

    function getUnitObj(type, key) {
        const set = UNIT_SETS[type] || [];
        return set.find(u => u.key === key);
    }

    if (convertForm && convType && convValue && fromUnit && toUnit && convertResult) {
        // initialize unit lists
        populateUnits(convType.value);
        convType.addEventListener('change', () => populateUnits(convType.value));

        convertForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = convType.value;
            const val = parseFloat(convValue.value || '0');
            const from = getUnitObj(type, fromUnit.value);
            const to = getUnitObj(type, toUnit.value);
            if (!from || !to) return;
            const base = from.toBase(val);
            const out = to.fromBase(base);
            convertResult.textContent = `${val} ${from.label} = ${out.toFixed(4)} ${to.label}`;
        });
    }

    function openChat() {
        chatInterface.style.display = 'block';
        if (startChatBtn) startChatBtn.style.display = 'none';
        // Focus input when chat opens
        setTimeout(() => userInput && userInput.focus(), 0);
    }

    // Show the chat interface when the user clicks the "Start Chat" button
    if (startChatBtn) {
        startChatBtn.addEventListener('click', openChat);
    }
    if (sidebarChatBtn) {
        sidebarChatBtn.addEventListener('click', openChat);
    }

    // Home button scroll to dashboard
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            const homeSection = document.getElementById('homeDashboard');
            if (homeSection) {
                homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Quick Action: Ask the Assistant opens chat
    if (qaAskAssistant) {
        qaAskAssistant.addEventListener('click', openChat);
    }

    // Tools button scroll to Tools section
    if (toolsBtn) {
        toolsBtn.addEventListener('click', () => {
            const toolsSection = document.getElementById('toolsSection');
            if (toolsSection) {
                toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Tips button scroll to Tips section
    if (tipsBtn) {
        tipsBtn.addEventListener('click', () => {
            const tipsSection = document.getElementById('tipsSection');
            if (tipsSection) tipsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Profile button scroll to Profile section
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            const profileSection = document.getElementById('profileSection');
            if (profileSection) profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Close chat
    closeChat.addEventListener('click', () => {
        chatInterface.style.display = 'none';
        if (startChatBtn) startChatBtn.style.display = 'inline-block';
    });

    // If chat is visible on load, focus the input
    if (chatInterface && chatInterface.style.display !== 'none') {
        setTimeout(() => userInput && userInput.focus(), 0);
    }

    // ===== Weather (Open-Meteo) =====
    const DEFAULT_CITY = 'Kuala Lumpur';
    const WMO_TEXT = {
        0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Freezing Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Dense Drizzle',
        61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
        80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Showers', 95: 'Thunderstorm'
    };

    async function geocodeCity(name) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Geocoding failed');
        const data = await res.json();
        if (!data.results || !data.results.length) throw new Error('City not found');
        const { latitude, longitude, name: cname } = data.results[0];
        return { latitude, longitude, name: cname };
    }

    async function getForecast(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,weather_code` +
            `&daily=temperature_2m_max,weather_code&forecast_days=3&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Forecast failed');
        return res.json();
    }

    function formatDayLabel(isoDate) {
        const d = new Date(isoDate);
        return d.toLocaleDateString(undefined, { weekday: 'short' });
    }

    function updateWeatherUI(current, daily, cityName) {
        const tempEl = document.querySelector('.weather .temp');
        const condEl = document.querySelector('.weather .cond');
        const dayEls = document.querySelectorAll('.forecast .day');
        if (weatherCityLabel && cityName) weatherCityLabel.textContent = cityName;
        if (tempEl && current && typeof current.temperature_2m === 'number') {
            tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
        }
        if (condEl && current) {
            condEl.textContent = WMO_TEXT[current.weather_code] || '—';
        }
        if (dayEls && daily && daily.time && daily.temperature_2m_max) {
            dayEls.forEach((dayEl, i) => {
                const label = dayEl.querySelector('span:nth-child(1)');
                const val = dayEl.querySelector('span:nth-child(2)');
                if (label && daily.time[i]) label.textContent = formatDayLabel(daily.time[i]);
                if (val && typeof daily.temperature_2m_max[i] === 'number') {
                    val.textContent = `${Math.round(daily.temperature_2m_max[i])}°C`;
                }
            });
        }
    }

    async function loadWeatherWithCityName(cityName) {
        try {
            const geo = await geocodeCity(cityName);
            const data = await getForecast(geo.latitude, geo.longitude);
            updateWeatherUI(data.current, data.daily, geo.name || cityName);
            localStorage.setItem('weather_city', geo.name || cityName);
        } catch (e) {
            if (weatherCityLabel) weatherCityLabel.textContent = 'Unavailable';
            const condEl = document.querySelector('.weather .cond');
            if (condEl) condEl.textContent = 'Weather unavailable';
            console.error('Weather error:', e);
        }
    }

    async function loadWeatherAuto() {
        // Try stored city first
        const storedCity = localStorage.getItem('weather_city');
        if (storedCity) {
            await loadWeatherWithCityName(storedCity);
            return;
        }
        // Try geolocation, fallback to default city
        let coords = null;
        try {
            coords = await new Promise((resolve, reject) => {
                if (!navigator.geolocation) return reject(new Error('No geolocation'));
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                    () => reject(new Error('Geolocation denied')),
                    { timeout: 5000 }
                );
            });
        } catch {}
        try {
            if (coords) {
                const data = await getForecast(coords.latitude, coords.longitude);
                updateWeatherUI(data.current, data.daily, 'Your location');
            } else {
                await loadWeatherWithCityName(DEFAULT_CITY);
            }
        } catch (e) {
            if (weatherCityLabel) weatherCityLabel.textContent = 'Unavailable';
            const condEl = document.querySelector('.weather .cond');
            if (condEl) condEl.textContent = 'Weather unavailable';
        }
    }

    if (weatherSetCityBtn && weatherCityInput) {
        weatherSetCityBtn.addEventListener('click', async () => {
            const city = weatherCityInput.value.trim();
            if (city) {
                await loadWeatherWithCityName(city);
            }
        });
        weatherCityInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const city = weatherCityInput.value.trim();
                if (city) {
                    await loadWeatherWithCityName(city);
                }
            }
        });
    }

    // Kick off weather load
    if (document.querySelector('.card.weather')) {
        loadWeatherAuto();
    }

    // ===== Todo List =====
    const TODO_KEY = 'sf_todos';
    let todos = [];

    function loadTodos() {
        try {
            const raw = localStorage.getItem(TODO_KEY);
            todos = raw ? JSON.parse(raw) : [];
        } catch {
            todos = [];
        }
    }

    function saveTodos() {
        localStorage.setItem(TODO_KEY, JSON.stringify(todos));
    }

    function renderTodos() {
        if (!todoList) return;
        todoList.innerHTML = '';
        todos.forEach(t => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.id = String(t.id);
            li.innerHTML = `
                <div class="todo-left">
                  <input type="checkbox" class="todo-toggle" ${t.completed ? 'checked' : ''} />
                  <span class="todo-title ${t.completed ? 'completed' : ''}">${t.title}</span>
                </div>
                <div class="todo-actions">
                  <button class="btn-delete" aria-label="Delete">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    function addTodo(title) {
        const trimmed = title.trim();
        if (!trimmed) return;
        todos.push({ id: Date.now(), title: trimmed, completed: false });
        saveTodos();
        renderTodos();
        if (todoInput) todoInput.value = '';
    }

    function toggleTodo(id) {
        const idx = todos.findIndex(t => String(t.id) === String(id));
        if (idx !== -1) {
            todos[idx].completed = !todos[idx].completed;
            saveTodos();
            renderTodos();
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(t => String(t.id) !== String(id));
        saveTodos();
        renderTodos();
    }

    if (todoList) {
        loadTodos();
        renderTodos();
        todoList.addEventListener('click', (e) => {
            const target = e.target;
            const li = target && target.closest && target.closest('.todo-item');
            if (!li) return;
            const id = li.dataset.id;
            if (target.classList && target.classList.contains('btn-delete')) {
                deleteTodo(id);
                return;
            }
            if (target.classList && target.classList.contains('todo-toggle')) {
                toggleTodo(id);
            }
        });
    }

    if (addTodoBtn && todoInput) {
        addTodoBtn.addEventListener('click', () => addTodo(todoInput.value));
        todoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTodo(todoInput.value);
            }
        });
    }

    // ===== Tools Logic =====
    // Watering Schedule Calculator
    const wateringForm = document.getElementById('wateringForm');
    const wateringResult = document.getElementById('wateringResult');
    if (wateringForm && wateringResult) {
        wateringForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const crop = /** @type {HTMLSelectElement} */(document.getElementById('waterCrop')).value;
            const soil = /** @type {HTMLSelectElement} */(document.getElementById('soilType')).value;
            const area = parseFloat(/** @type {HTMLInputElement} */(document.getElementById('bedArea')).value) || 0;
            const weather = /** @type {HTMLSelectElement} */(document.getElementById('weatherCond')).value;

            const baseByWeather = { cool: 3, normal: 5, hot: 7, rainy: 1 }; // L/m²/day
            const soilFactor = { sandy: 1.2, loam: 1.0, clay: 0.8 };
            const cropFactor = { 'Tomato': 1.0, 'Cucumber': 1.1, 'Leafy Greens': 0.8, 'Chili': 0.9 };

            const base = baseByWeather[weather] ?? 5;
            const sF = soilFactor[soil] ?? 1.0;
            const cF = cropFactor[crop] ?? 1.0;
            const litersPerDay = Math.max(0, base * sF * cF * area);

            let frequencyText = 'every 1–2 days';
            if (weather === 'hot') frequencyText = 'daily';
            if (weather === 'cool') frequencyText = 'every 2–3 days';
            if (weather === 'rainy') frequencyText = 'skip today if soil is moist';

            wateringResult.innerHTML = `
                <p><strong>Recommended volume:</strong> ${litersPerDay.toFixed(1)} L/day</p>
                <p><strong>Suggested frequency:</strong> ${frequencyText}</p>
                <p class="hint">Adjust based on actual soil moisture and plant appearance.</p>
            `;
        });
    }

    // Fertilizer Planner
    const fertForm = document.getElementById('fertForm');
    const fertResult = document.getElementById('fertResult');
    if (fertForm && fertResult) {
        fertForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const crop = /** @type {HTMLSelectElement} */(document.getElementById('fertCrop')).value;
            const stage = /** @type {HTMLSelectElement} */(document.getElementById('growthStage')).value;
            const area = parseFloat(/** @type {HTMLInputElement} */(document.getElementById('areaFert')).value) || 0;

            // Base stage recommendations
            const stagePlan = {
                seedling: { npk: '2-1-2', rate: 5, note: 'Use mild fertilizer. Avoid burning roots.' },
                vegetative: { npk: '10-5-5', rate: 15, note: 'Focus on nitrogen for leafy growth.' },
                flowering: { npk: '5-10-10', rate: 12, note: 'Increase P & K to support blooms.' },
                fruiting: { npk: '5-10-15', rate: 15, note: 'More K for fruit quality.' }
            };

            // Crop-specific adjustment (slight tilt)
            const cropTilt = {
                'Leafy Greens': { npk: '12-4-6' },
                'Tomato': { npk: stage === 'fruiting' ? '4-8-16' : undefined },
                'Cucumber': { npk: stage === 'vegetative' ? '9-5-6' : undefined },
                'Chili': { npk: stage === 'flowering' ? '4-10-12' : undefined }
            };

            const base = stagePlan[stage] || stagePlan.vegetative;
            const tilt = (cropTilt[crop] && cropTilt[crop].npk) ? cropTilt[crop].npk : base.npk;
            const grams = Math.max(0, base.rate * area); // grams per m²

            fertResult.innerHTML = `
                <p><strong>Suggested N-P-K:</strong> ${tilt}</p>
                <p><strong>Application rate:</strong> ${base.rate} g/m²</p>
                <p><strong>Total for ${area.toFixed(1)} m²:</strong> ${grams.toFixed(0)} g</p>
                <p class="hint">${base.note}</p>
            `;
        });
    }

    // Generate bot response function
    function generateBotResponse(question) {
        try {
            const lowerCaseQuestion = question.toLowerCase();

            // Check if knowledge base exists
            if (typeof farmingKnowledgeBase === 'undefined') {
                return "Sorry, I'm having trouble accessing my knowledge base. Please try refreshing the page.";
            }

            for (const topic in farmingKnowledgeBase) {
                const entry = farmingKnowledgeBase[topic];
                for (const keyword of entry.keywords) {
                    if (lowerCaseQuestion.includes(keyword)) {
                        return entry.response;
                    }
                }
            }

            // Default fallback response
            return "I'm not sure about that topic yet. Can you try asking in a different way or be more specific?";
        } catch (error) {
            console.error('Error generating bot response:', error);
            return "Sorry, I encountered an error. Please try again.";
        }
    }

    // Handle user input and bot response
    function handleSend() {
        const userQuestion = userInput.value.trim();
        if (userQuestion !== '') {
            // Display the user's message
            addMessageToChat(userQuestion, 'user');
            userInput.value = ''; // Clear the input field

            // Simulate a bot response using knowledge base
            setTimeout(() => {
                const botResponse = generateBotResponse(userQuestion);
                addMessageToChat(botResponse, 'bot');
            }, 500);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });

    // Add a message to the chat box
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
    }

    // Add initial welcome message
    setTimeout(() => {
        addMessageToChat("Hello! I'm your Smart Farm Assistant. Ask me about watering, soil, pests, planting, or specific vegetables like tomatoes and carrots!", 'bot');
    }, 1000);
});

// Navigation and Sidebar functionality
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const navButtons = document.querySelectorAll('.nav-buttons button');
  const mainContent = document.querySelector('.main-content');

  // Toggle sidebar
  function toggleSidebar(open) {
    const isOpening = open !== undefined ? open : !sidebar.classList.contains('active');
    
    if (isOpening) {
      sidebar.classList.add('active');
      document.body.classList.add('sidebar-open');
      
      // Add overlay when sidebar is open on mobile
      if (window.innerWidth < 768) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        mainContent.appendChild(overlay);
        
        overlay.addEventListener('click', function closeSidebar() {
          toggleSidebar(false);
          overlay.remove();
        });
      }
    } else {
      sidebar.classList.remove('active');
      document.body.classList.remove('sidebar-open');
      
      // Remove overlay if it exists
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.remove();
    }
  }

  // Toggle sidebar on button click
  toggleBtn.addEventListener('click', () => toggleSidebar());

  // Close sidebar and navigate when a nav button is clicked
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (window.innerWidth < 768) {
        toggleSidebar(false);
      }
      
      // Get the target section ID from the button's ID
      const targetId = this.id.replace('Btn', 'Section');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // For mobile, wait for sidebar to close before scrolling
        const delay = window.innerWidth < 768 ? 300 : 0;
        
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // If it's the chat button, open the chat
          if (this.id === 'sidebarChatBtn' && window.openChat) {
            window.openChat();
          }
        }, delay);
      }
    });
  });

  // Handle window resize
  function handleResize() {
    if (window.innerWidth >= 768) {
      // On desktop, ensure sidebar is visible and reset any mobile styles
      document.body.classList.remove('sidebar-open');
      
      // Remove overlay if it exists
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.remove();
    }
  }

  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  // Initialize based on screen size
  handleResize();
});

// In the Profile button click handler
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        console.log('Profile button clicked!'); // Add this line
        const profileSection = document.getElementById('profileSection');
        console.log('Profile section found:', !!profileSection); // And this line
        if (profileSection) {
            profileSection.style.display = 'block'; // Make sure it's visible
            profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}