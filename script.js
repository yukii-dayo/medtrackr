// ==================== STATE ====================
let userData = {
    name: '',
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
    activity: 'sedentary',
    bmi: 0,
    bmiCategory: '',
    tdee: 0,
    bmr: 0
};

let dietData = {
    goal: '',
    duration: 3,
    targetWeight: 0,
    dailyCalories: 0,
    caloriesToBurn: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0
};

// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeTransition = document.getElementById('themeTransition');

function toggleTheme(e) {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Get click position for clip-path origin
    const rect = themeToggle.getBoundingClientRect();
    const tx = ((rect.left + rect.width / 2) / window.innerWidth * 100).toFixed(1) + '%';
    const ty = ((rect.top + rect.height / 2) / window.innerHeight * 100).toFixed(1) + '%';

    // Setup transition element
    themeTransition.className = 'theme-transition';
    themeTransition.classList.add(newTheme === 'dark' ? 'to-dark' : 'to-light');
    themeTransition.style.setProperty('--tx', tx);
    themeTransition.style.setProperty('--ty', ty);
    themeTransition.style.clipPath = 'circle(0% at ' + tx + ' ' + ty + ')';
    void themeTransition.offsetWidth; // Force reflow

    // Expand clip-path
    themeTransition.classList.add('active');

    // Change theme midway through animation
    setTimeout(() => {
        html.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('medtrackr-theme', newTheme);
    }, 300);

    // Fade out and reset
    setTimeout(() => {
        themeTransition.style.transition = 'opacity 0.3s ease';
        themeTransition.style.opacity = '0';
        setTimeout(() => {
            themeTransition.className = 'theme-transition';
            themeTransition.style.transition = '';
            themeTransition.style.opacity = '';
            themeTransition.style.clipPath = '';
        }, 300);
    }, 600);
}

themeToggle.addEventListener('click', toggleTheme);

// Load saved theme
(function() {
    const saved = localStorage.getItem('medtrackr-theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        themeIcon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
})();

// ==================== NAVIGATION ====================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== PAGE NAVIGATION ====================
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger animations on the new page
    setTimeout(() => triggerScrollAnimations(), 100);

    // Update dashboard/diet if needed
    if (pageName === 'dashboard') {
        updateDashboard();
    }
    if (pageName === 'diet') {
        updateDietPage();
    }

    closeMobileMenu();
}

// ==================== HERO PARTICLES ====================
(function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.setProperty('--duration', (4 + Math.random() * 8) + 's');
        particle.style.setProperty('--delay', (Math.random() * 5) + 's');
        particle.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
        particle.style.setProperty('--ty', (Math.random() * 100 - 50) + 'px');
        particle.style.width = (3 + Math.random() * 6) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
})();

// ==================== PARALLAX SCROLL EFFECT ====================
(function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    const geoShapes = document.querySelector('.geo-shapes');
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const scrollY = window.scrollY;
                if (heroVisual && scrollY < window.innerHeight) {
                    heroVisual.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
                }
                if (geoShapes) {
                    geoShapes.style.transform = 'translateY(' + (scrollY * 0.05) + 'px)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// ==================== TILT EFFECT ON FLOATING CARDS ====================
(function initTiltEffect() {
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            card.style.transform = 'perspective(500px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px) scale(1.05)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
})();

// ==================== MAGNETIC NAVBAR LINKS ====================
(function initMagneticLinks() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(function(link) {
        link.addEventListener('mousemove', function(e) {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            link.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
        });
        link.addEventListener('mouseleave', function() {
            link.style.transform = '';
        });
    });
})();

// ==================== SCROLL ANIMATIONS ====================
function triggerScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        if (counter.classList.contains('counted')) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current).toLocaleString();
                        if (counter.closest('.stat-item') &&
                            counter.closest('.stat-item').querySelector('.stat-label').textContent.includes('%')) {
                            counter.textContent = Math.floor(current) + '%';
                        }
                    }, 16);

                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// ==================== BMI CALCULATOR ====================
function selectGender(gender) {
    userData.gender = gender;
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-gender') === gender);
    });
}

function selectActivity(activity) {
    userData.activity = activity;
    document.querySelectorAll('.activity-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-activity') === activity);
    });
}

function syncSlider(field, value) {
    document.getElementById(field).value = value;
}

// Sync input to slider
document.getElementById('height')?.addEventListener('input', function() {
    document.getElementById('heightSlider').value = this.value;
});

document.getElementById('weight')?.addEventListener('input', function() {
    document.getElementById('weightSlider').value = this.value;
});

function calculateBMI() {
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    // Validation
    if (!name) {
        showToast('Please enter your name');
        return;
    }
    if (!age || age < 10 || age > 120) {
        showToast('Please enter a valid age (10-120)');
        return;
    }
    if (!height || height < 50 || height > 300) {
        showToast('Please enter a valid height (50-300 cm)');
        return;
    }
    if (!weight || weight < 20 || weight > 500) {
        showToast('Please enter a valid weight (20-500 kg)');
        return;
    }

    // Calculate BMI
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    // Calculate BMR (Mifflin-St Jeor Equation)
    let bmr;
    if (userData.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extreme: 1.9
    };

    const tdee = bmr * activityMultipliers[userData.activity];

    // Determine BMI category
    let category;
    if (bmi < 18.5) category = 'underweight';
    else if (bmi < 25) category = 'normal';
    else if (bmi < 30) category = 'overweight';
    else category = 'obese';

    // Store data
    userData.name = name;
    userData.age = age;
    userData.height = height;
    userData.weight = weight;
    userData.bmi = bmi;
    userData.bmiCategory = category;
    userData.bmr = bmr;
    userData.tdee = tdee;

    // Save to localStorage
    localStorage.setItem('medtrackr-userData', JSON.stringify(userData));

    showToast('BMI calculated successfully!');

    // Navigate to dashboard
    setTimeout(() => showPage('dashboard'), 500);
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    // Try loading from localStorage
    const saved = localStorage.getItem('medtrackr-userData');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(userData, parsed);
    }

    const noData = document.getElementById('noDataState');
    const content = document.getElementById('dashboardContent');

    if (!userData.bmi || userData.bmi === 0) {
        noData.style.display = 'block';
        content.style.display = 'none';
        return;
    }

    noData.style.display = 'none';
    content.style.display = 'block';

    // BMI Value
    document.getElementById('bmiValue').textContent = userData.bmi.toFixed(1);

    // BMI Category Badge
    const badge = document.getElementById('bmiCategoryBadge');
    badge.textContent = userData.bmiCategory.charAt(0).toUpperCase() + userData.bmiCategory.slice(1);
    badge.className = 'dash-card-badge ' + userData.bmiCategory;

    // BMI Gauge Pointer
    const minBmi = 14;
    const maxBmi = 40;
    const percentage = Math.min(Math.max((userData.bmi - minBmi) / (maxBmi - minBmi) * 100, 0), 100);
    setTimeout(() => {
        document.getElementById('bmiGaugePointer').style.left = percentage + '%';
    }, 300);

    // Daily Calories
    document.getElementById('dailyCalories').textContent = Math.round(userData.tdee).toLocaleString();
    document.getElementById('calorieRingText').textContent = Math.round(userData.tdee);

    // Animate calorie ring
    setTimeout(() => {
        const ring = document.getElementById('calorieRing');
        if (ring) {
            const maxCal = 4000;
            const pct = Math.min(userData.tdee / maxCal, 1);
            ring.style.strokeDashoffset = 314 - (314 * pct);
            ring.style.stroke = 'var(--accent-primary)';
        }
    }, 500);

    // Weight Status
    document.getElementById('currentWeight').textContent = userData.weight.toFixed(1);
    const heightM = userData.height / 100;
    const idealMin = (18.5 * heightM * heightM).toFixed(1);
    const idealMax = (24.9 * heightM * heightM).toFixed(1);
    document.getElementById('idealWeight').textContent = `${idealMin} - ${idealMax} kg`;

    const idealMid = (18.5 + 24.9) / 2 * heightM * heightM;
    const diff = userData.weight - idealMid;
    const diffEl = document.getElementById('weightDiff');
    if (Math.abs(diff) < 2) {
        diffEl.textContent = 'Within ideal range';
        diffEl.style.color = 'var(--success)';
    } else if (diff > 0) {
        diffEl.textContent = `+${diff.toFixed(1)} kg above ideal`;
        diffEl.style.color = 'var(--warning)';
    } else {
        diffEl.textContent = `${diff.toFixed(1)} kg below ideal`;
        diffEl.style.color = 'var(--info)';
    }

    // User Info Bar
    document.getElementById('dashName').textContent = userData.name;
    document.getElementById('dashAge').textContent = userData.age + ' years';
    document.getElementById('dashHeight').textContent = userData.height + ' cm';

    const activityLabels = {
        sedentary: 'Sedentary',
        light: 'Lightly Active',
        moderate: 'Moderately Active',
        active: 'Very Active',
        extreme: 'Extra Active'
    };
    document.getElementById('dashActivity').textContent = activityLabels[userData.activity] || '--';

    // Calculate macros for maintenance
    const calories = userData.tdee;
    const proteinG = Math.round((calories * 0.30) / 4);
    const carbsG = Math.round((calories * 0.45) / 4);
    const fatsG = Math.round((calories * 0.25) / 9);
    const fiberG = userData.gender === 'male' ? 38 : 25;

    document.getElementById('dashProtein').textContent = proteinG + ' g';
    document.getElementById('dashCarbs').textContent = carbsG + ' g';
    document.getElementById('dashFats').textContent = fatsG + ' g';
    document.getElementById('dashFiber').textContent = fiberG + ' g';

    // Animate macro bars
    setTimeout(() => {
        document.getElementById('proteinBar').style.width = '75%';
        document.getElementById('carbsBar').style.width = '85%';
        document.getElementById('fatsBar').style.width = '60%';
        document.getElementById('fiberBar').style.width = '50%';
    }, 600);
}

// ==================== DIET PROGRAM ====================
function updateDietPage() {
    const saved = localStorage.getItem('medtrackr-userData');
    if (saved) {
        Object.assign(userData, JSON.parse(saved));
    }

    const noBmi = document.getElementById('noBmiForDiet');
    const setup = document.getElementById('dietSetup');
    const results = document.getElementById('dietResults');

    if (!userData.bmi || userData.bmi === 0) {
        noBmi.style.display = 'block';
        setup.style.display = 'none';
        results.style.display = 'none';
        return;
    }

    noBmi.style.display = 'none';

    // Check if we already have a diet plan
    const savedDiet = localStorage.getItem('medtrackr-dietData');
    if (savedDiet) {
        Object.assign(dietData, JSON.parse(savedDiet));
        if (dietData.dailyCalories > 0) {
            setup.style.display = 'none';
            results.style.display = 'block';
            renderDietResults();
            return;
        }
    }

    setup.style.display = 'block';
    results.style.display = 'none';
}

function selectGoal(goal) {
    dietData.goal = goal;
    document.querySelectorAll('.goal-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-goal') === goal);
    });

    // Show duration section with animation
    const durationSection = document.getElementById('durationSection');
    durationSection.style.display = 'block';
    durationSection.classList.add('animate-in');

    // Set default target weight based on goal
    const targetInput = document.getElementById('targetWeight');
    if (goal === 'loss') {
        targetInput.value = Math.round(userData.weight * 0.9);
    } else if (goal === 'gain') {
        targetInput.value = Math.round(userData.weight * 1.1);
    } else {
        targetInput.value = Math.round(userData.weight);
    }

    // Scroll to duration section
    setTimeout(() => {
        durationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
}

function selectDuration(months) {
    dietData.duration = months;
    document.querySelectorAll('.duration-option').forEach(opt => {
        opt.classList.toggle('active', parseInt(opt.getAttribute('data-months')) === months);
    });
}

function generateDietPlan() {
    const targetWeight = parseFloat(document.getElementById('targetWeight').value);

    if (!dietData.goal) {
        showToast('Please select a goal first');
        return;
    }

    if (!targetWeight || targetWeight < 30 || targetWeight > 300) {
        showToast('Please enter a valid target weight');
        return;
    }

    // Validate target against goal
    if (dietData.goal === 'loss' && targetWeight >= userData.weight) {
        showToast('Target weight should be less than current weight for weight loss');
        return;
    }
    if (dietData.goal === 'gain' && targetWeight <= userData.weight) {
        showToast('Target weight should be more than current weight for weight gain');
        return;
    }

    dietData.targetWeight = targetWeight;

    // Calculate weight change needed
    const weightChange = Math.abs(targetWeight - userData.weight);
    const totalDays = dietData.duration * 30;
    const dailyWeightChange = weightChange / totalDays; // kg per day
    const weeklyWeightChange = dailyWeightChange * 7;

    // 1 kg of body weight ~ 7700 calories
    const dailyCalorieAdjustment = Math.round((dailyWeightChange * 7700));

    let dailyCalories, caloriesToBurn;

    if (dietData.goal === 'loss') {
        dailyCalories = Math.round(userData.tdee - dailyCalorieAdjustment * 0.6);
        caloriesToBurn = Math.round(dailyCalorieAdjustment * 0.4);
        // Ensure minimum safe intake
        dailyCalories = Math.max(dailyCalories, userData.gender === 'male' ? 1500 : 1200);
    } else if (dietData.goal === 'gain') {
        dailyCalories = Math.round(userData.tdee + dailyCalorieAdjustment);
        caloriesToBurn = Math.round(200); // Light exercise to stay healthy
    } else {
        dailyCalories = Math.round(userData.tdee);
        caloriesToBurn = Math.round(300);
    }

    // Calculate macros based on goal
    let proteinPct, carbsPct, fatsPct;

    if (dietData.goal === 'loss') {
        proteinPct = 0.35; // Higher protein for muscle preservation
        carbsPct = 0.40;
        fatsPct = 0.25;
    } else if (dietData.goal === 'gain') {
        proteinPct = 0.30;
        carbsPct = 0.45;
        fatsPct = 0.25;
    } else {
        proteinPct = 0.30;
        carbsPct = 0.45;
        fatsPct = 0.25;
    }

    dietData.dailyCalories = dailyCalories;
    dietData.caloriesToBurn = caloriesToBurn;
    dietData.protein = Math.round((dailyCalories * proteinPct) / 4);
    dietData.carbs = Math.round((dailyCalories * carbsPct) / 4);
    dietData.fats = Math.round((dailyCalories * fatsPct) / 9);
    dietData.fiber = userData.gender === 'male' ? 38 : 25;

    if (dietData.goal === 'loss') {
        dietData.fiber = Math.round(dietData.fiber * 1.2); // More fiber for satiety
    }

    // Save
    localStorage.setItem('medtrackr-dietData', JSON.stringify(dietData));

    // Show results
    document.getElementById('dietSetup').style.display = 'none';
    document.getElementById('dietResults').style.display = 'block';

    renderDietResults();
    showToast('Diet plan generated successfully!');
}

function renderDietResults() {
    // Summary
    const goalLabels = { loss: 'Weight Loss', gain: 'Weight Gain', maintain: 'Weight Maintenance' };
    document.getElementById('dietGoalText').textContent = goalLabels[dietData.goal] || '--';
    document.getElementById('dietDurationText').textContent = dietData.duration + ' Months';
    document.getElementById('dietCurrentWeight').textContent = userData.weight + ' kg';
    document.getElementById('dietTargetWeight').textContent = dietData.targetWeight + ' kg';

    // Daily Plan
    document.getElementById('planCalorieIntake').textContent = dietData.dailyCalories.toLocaleString();
    document.getElementById('planCalorieBurn').textContent = dietData.caloriesToBurn.toLocaleString();
    document.getElementById('planMaintenance').textContent = Math.round(userData.tdee).toLocaleString();

    // Update calorie note
    const diff = Math.abs(Math.round(userData.tdee) - dietData.dailyCalories);
    if (dietData.goal === 'loss') {
        document.getElementById('calorieNote').textContent = `Maintenance - ${diff} kcal deficit`;
    } else if (dietData.goal === 'gain') {
        document.getElementById('calorieNote').textContent = `Maintenance + ${diff} kcal surplus`;
    } else {
        document.getElementById('calorieNote').textContent = 'Balanced maintenance intake';
    }

    // Macros
    document.getElementById('planProtein').textContent = dietData.protein + ' g';
    document.getElementById('planCarbs').textContent = dietData.carbs + ' g';
    document.getElementById('planFats').textContent = dietData.fats + ' g';
    document.getElementById('planFiber').textContent = dietData.fiber + ' g';

    // Calculate percentages
    const totalMacroCals = (dietData.protein * 4) + (dietData.carbs * 4) + (dietData.fats * 9);
    const proteinPct = Math.round((dietData.protein * 4 / totalMacroCals) * 100);
    const carbsPct = Math.round((dietData.carbs * 4 / totalMacroCals) * 100);
    const fatsPct = Math.round((dietData.fats * 9 / totalMacroCals) * 100);

    document.getElementById('planProteinPercent').textContent = proteinPct + '%';
    document.getElementById('planCarbsPercent').textContent = carbsPct + '%';
    document.getElementById('planFatsPercent').textContent = fatsPct + '%';
    document.getElementById('planFiberGrams').textContent = dietData.fiber + 'g';

    // Animate macro rings
    setTimeout(() => {
        const circumference = 2 * Math.PI * 42; // ~264
        animateRing('planProteinRing', proteinPct / 100);
        animateRing('planCarbsRing', carbsPct / 100);
        animateRing('planFatsRing', fatsPct / 100);
        animateRing('planFiberRing', Math.min(dietData.fiber / 50, 1));
    }, 500);

    // Render projection chart
    renderProjectionChart();

    // Update tip
    if (dietData.goal === 'loss') {
        document.getElementById('weeklyTip').textContent = 'Aim for 0.5-1 kg weight loss per week for sustainable results. Include strength training to preserve muscle mass during your calorie deficit.';
    } else if (dietData.goal === 'gain') {
        document.getElementById('weeklyTip').textContent = 'Focus on progressive overload in strength training while maintaining your calorie surplus. Prioritize protein intake around workouts for optimal muscle growth.';
    } else {
        document.getElementById('weeklyTip').textContent = 'Consistency is key! Monitor your weight weekly and adjust intake if you notice unexpected changes. Stay active and focus on whole foods.';
    }
}

function animateRing(id, percentage) {
    const ring = document.getElementById(id);
    if (!ring) return;
    const circumference = 2 * Math.PI * 42;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference - (circumference * percentage);
}

function renderProjectionChart() {
    const chart = document.getElementById('projectionChart');
    chart.innerHTML = '';

    const totalMonths = dietData.duration;
    const weightDiff = dietData.targetWeight - userData.weight;
    const monthlyChange = weightDiff / totalMonths;

    const weights = [];
    for (let i = 0; i <= totalMonths; i++) {
        weights.push(userData.weight + monthlyChange * i);
    }

    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const range = maxW - minW;

    weights.forEach((w, i) => {
        const container = document.createElement('div');
        container.className = 'chart-bar-container';

        const value = document.createElement('div');
        value.className = 'chart-bar-value';
        value.textContent = w.toFixed(1);

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const heightPct = ((w - minW) / range) * 80 + 10;
        bar.style.height = '0%';

        const label = document.createElement('div');
        label.className = 'chart-bar-label';
        label.textContent = i === 0 ? 'Start' : `M${i}`;

        container.appendChild(value);
        container.appendChild(bar);
        container.appendChild(label);
        chart.appendChild(container);

        // Animate bars
        setTimeout(() => {
            bar.style.height = heightPct + '%';
        }, 300 + i * 100);
    });
}

function resetDietPlan() {
    dietData = {
        goal: '',
        duration: 3,
        targetWeight: 0,
        dailyCalories: 0,
        caloriesToBurn: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0
    };
    localStorage.removeItem('medtrackr-dietData');

    document.getElementById('dietResults').style.display = 'none';
    document.getElementById('dietSetup').style.display = 'block';

    // Reset selections
    document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.duration-option').forEach(o => o.classList.remove('active'));
    document.querySelector('[data-months="3"]').classList.add('active');
    document.getElementById('durationSection').style.display = 'none';
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==================== BUTTON RIPPLE EFFECT ====================
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// ==================== SMOOTH SCROLL REVEAL ====================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.feature-card, .stat-item, .dash-card, .macro-card, .goal-card, .daily-card, .macro-plan-card');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        observer.observe(el);
    });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    triggerScrollAnimations();
    animateCounters();
    initScrollReveal();

    // Load saved data
    const saved = localStorage.getItem('medtrackr-userData');
    if (saved) {
        Object.assign(userData, JSON.parse(saved));
    }
});

// Re-trigger on scroll
window.addEventListener('scroll', () => {
    triggerScrollAnimations();
    animateCounters();
});
