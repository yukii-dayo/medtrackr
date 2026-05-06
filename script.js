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
    if (pageName === 'workout') {
        updateWorkoutPage();
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

// ==================== WORKOUT PLAN ====================
let workoutData = {
    currentWeek: 1,
    currentDay: 0, // 0=Mon, 1=Tue, ... 6=Sun
    totalWeeks: 0,
    completedDays: {} // key: "week-day", value: true
};

// Exercise image base URL from musclewiki/exercise illustration CDNs
const EXERCISE_IMAGES = {
    // Back exercises
    'Barbell Bent-Over Row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif',
    'Lat Pulldown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
    'Seated Cable Row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif',
    'T-Bar Row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/T-Bar-Row.gif',
    'Single-Arm Dumbbell Row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif',
    'Deadlift': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif',
    // Bicep exercises
    'Barbell Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
    'Dumbbell Hammer Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
    'Incline Dumbbell Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Curl.gif',
    'Preacher Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Preacher-Curl.gif',
    'Concentration Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
    'Cable Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Curl.gif',
    // Chest exercises
    'Barbell Bench Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif',
    'Incline Dumbbell Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
    'Cable Fly': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif',
    'Dumbbell Fly': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif',
    'Push-Up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',
    'Decline Bench Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Barbell-Bench-Press.gif',
    'Chest Dip': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif',
    // Tricep exercises
    'Tricep Pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
    'Overhead Tricep Extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Triceps-Extension.gif',
    'Close-Grip Bench Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Barbell-Bench-Press.gif',
    'Skull Crushers': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif',
    'Tricep Kickback': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Kickback.gif',
    'Diamond Push-Up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-up.gif',
    // Leg exercises
    'Barbell Squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif',
    'Leg Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif',
    'Romanian Deadlift': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif',
    'Leg Extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif',
    'Leg Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Curl.gif',
    'Calf Raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif',
    'Walking Lunge': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunges.gif',
    'Bulgarian Split Squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bulgarian-Split-Squat.gif',
    'Hack Squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hack-Squat.gif',
    // Abs exercises
    'Crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
    'Hanging Leg Raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-Raise.gif',
    'Russian Twist': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
    'Plank': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Plank.gif',
    'Cable Woodchop': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Wood-Chop.gif',
    'Ab Wheel Rollout': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Ab-Wheel-Rollout.gif',
    // Shoulder exercises
    'Overhead Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Overhead-Press.gif',
    'Lateral Raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif',
    'Face Pull': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
    'Arnold Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arnold-Press.gif',
    'Front Raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif',
    'Reverse Fly': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Rear-Delt-Fly.gif',
    'Upright Row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Upright-Row.gif',
    // Cardio exercises
    'Treadmill Running': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Run.gif',
    'Stationary Bike': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Stationary-Bike.gif',
    'Rowing Machine': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Rowing-Machine.gif',
    'Jump Rope': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Rope.gif',
    'Elliptical Trainer': 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Elliptical-Machine.gif',
    'Stair Climber': 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Stair-Climber.gif',
    'Battle Ropes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Battle-Rope.gif',
    'Burpees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif'
};

// Weekly workout split definition
const WEEKLY_SPLIT = [
    { // Monday - Back/Bicep
        day: 'Monday',
        type: 'Back / Bicep',
        isRest: false,
        exercises: [
            {
                name: 'Barbell Bent-Over Row',
                muscle: 'Back',
                equipment: 'Barbell',
                sets: 4, reps: '8-10', rest: '90s',
                instructions: [
                    'Stand with feet shoulder-width apart, bend at the hips keeping your back straight.',
                    'Grip the barbell with an overhand grip slightly wider than shoulder-width.',
                    'Pull the bar towards your lower chest, squeezing your shoulder blades together.',
                    'Slowly lower the bar back to the starting position with control.'
                ]
            },
            {
                name: 'Lat Pulldown',
                muscle: 'Back',
                equipment: 'Cable',
                sets: 4, reps: '10-12', rest: '60s',
                instructions: [
                    'Sit at the lat pulldown machine with thighs secured under the pads.',
                    'Grip the bar wider than shoulder-width with palms facing away.',
                    'Pull the bar down to your upper chest while leaning slightly back.',
                    'Slowly return the bar to the starting position, fully extending your arms.'
                ]
            },
            {
                name: 'Seated Cable Row',
                muscle: 'Back',
                equipment: 'Cable',
                sets: 3, reps: '10-12', rest: '60s',
                instructions: [
                    'Sit at the cable row station with feet on the platform, knees slightly bent.',
                    'Grab the handle and sit upright with arms extended.',
                    'Pull the handle towards your midsection, squeezing your back muscles.',
                    'Slowly extend your arms back to the starting position.'
                ]
            },
            {
                name: 'Single-Arm Dumbbell Row',
                muscle: 'Back',
                equipment: 'Dumbbell',
                sets: 3, reps: '10-12 each', rest: '60s',
                instructions: [
                    'Place one knee and hand on a bench, keeping your back flat.',
                    'Hold a dumbbell in the other hand with arm fully extended.',
                    'Pull the dumbbell up to your hip, keeping elbow close to your body.',
                    'Lower the weight with control and repeat on each side.'
                ]
            },
            {
                name: 'Barbell Curl',
                muscle: 'Biceps',
                equipment: 'Barbell',
                sets: 3, reps: '10-12', rest: '60s',
                instructions: [
                    'Stand with feet shoulder-width apart, holding a barbell with an underhand grip.',
                    'Keep your elbows pinned to your sides throughout the movement.',
                    'Curl the barbell up towards your shoulders, squeezing at the top.',
                    'Slowly lower the bar back down with control.'
                ]
            },
            {
                name: 'Dumbbell Hammer Curl',
                muscle: 'Biceps',
                equipment: 'Dumbbell',
                sets: 3, reps: '12-15', rest: '45s',
                instructions: [
                    'Stand holding dumbbells at your sides with palms facing each other.',
                    'Curl both dumbbells up simultaneously, keeping the neutral grip.',
                    'Squeeze at the top of the movement.',
                    'Lower slowly back to the starting position.'
                ]
            },
            {
                name: 'Incline Dumbbell Curl',
                muscle: 'Biceps',
                equipment: 'Dumbbell',
                sets: 3, reps: '10-12', rest: '45s',
                instructions: [
                    'Sit on an incline bench set to about 45 degrees, arms hanging down.',
                    'Hold dumbbells with palms facing forward.',
                    'Curl the weights up, keeping upper arms stationary against the bench.',
                    'Lower with control for a full stretch at the bottom.'
                ]
            }
        ]
    },
    { // Tuesday - Chest/Tricep
        day: 'Tuesday',
        type: 'Chest / Tricep',
        isRest: false,
        exercises: [
            {
                name: 'Barbell Bench Press',
                muscle: 'Chest',
                equipment: 'Barbell',
                sets: 4, reps: '8-10', rest: '90s',
                instructions: [
                    'Lie flat on the bench with feet firmly on the floor.',
                    'Grip the barbell slightly wider than shoulder-width.',
                    'Lower the bar to your mid-chest with control.',
                    'Press the bar back up to the starting position, locking out your arms.'
                ]
            },
            {
                name: 'Incline Dumbbell Press',
                muscle: 'Chest',
                equipment: 'Dumbbell',
                sets: 4, reps: '10-12', rest: '60s',
                instructions: [
                    'Set the bench to a 30-45 degree incline.',
                    'Hold dumbbells at shoulder level with palms facing forward.',
                    'Press the dumbbells up and slightly inward.',
                    'Lower the weights slowly to shoulder level.'
                ]
            },
            {
                name: 'Cable Fly',
                muscle: 'Chest',
                equipment: 'Cable',
                sets: 3, reps: '12-15', rest: '45s',
                instructions: [
                    'Stand between cable machines with handles set at shoulder height.',
                    'Step forward slightly and keep a slight bend in your elbows.',
                    'Bring both handles together in front of your chest in an arc motion.',
                    'Slowly return to the starting position, feeling the stretch in your chest.'
                ]
            },
            {
                name: 'Chest Dip',
                muscle: 'Chest',
                equipment: 'Body Weight',
                sets: 3, reps: '8-12', rest: '60s',
                instructions: [
                    'Grip the dip bars and lift yourself up with arms extended.',
                    'Lean forward slightly to target the chest.',
                    'Lower your body by bending your elbows until you feel a stretch in your chest.',
                    'Push yourself back up to the starting position.'
                ]
            },
            {
                name: 'Tricep Pushdown',
                muscle: 'Triceps',
                equipment: 'Cable',
                sets: 3, reps: '12-15', rest: '45s',
                instructions: [
                    'Stand at a cable machine with a straight or V-bar attachment.',
                    'Grip the bar with palms facing down, elbows at your sides.',
                    'Push the bar down until your arms are fully extended.',
                    'Slowly return to the starting position without moving your elbows.'
                ]
            },
            {
                name: 'Overhead Tricep Extension',
                muscle: 'Triceps',
                equipment: 'Dumbbell',
                sets: 3, reps: '10-12', rest: '45s',
                instructions: [
                    'Hold a dumbbell with both hands behind your head.',
                    'Keep your upper arms close to your ears.',
                    'Extend your arms upward until the dumbbell is overhead.',
                    'Lower the weight back behind your head with control.'
                ]
            },
            {
                name: 'Skull Crushers',
                muscle: 'Triceps',
                equipment: 'EZ Bar',
                sets: 3, reps: '10-12', rest: '60s',
                instructions: [
                    'Lie on a flat bench holding an EZ bar with arms extended above your chest.',
                    'Bend your elbows to lower the bar towards your forehead.',
                    'Keep your upper arms stationary throughout the movement.',
                    'Extend your arms back to the starting position.'
                ]
            }
        ]
    },
    { // Wednesday - Rest
        day: 'Wednesday',
        type: 'Rest Day',
        isRest: true,
        exercises: []
    },
    { // Thursday - Legs
        day: 'Thursday',
        type: 'Legs',
        isRest: false,
        exercises: [
            {
                name: 'Barbell Squat',
                muscle: 'Quadriceps',
                equipment: 'Barbell',
                sets: 4, reps: '8-10', rest: '120s',
                instructions: [
                    'Position the barbell on your upper back, standing with feet shoulder-width apart.',
                    'Brace your core and begin lowering by bending knees and hips.',
                    'Descend until thighs are parallel to the floor or slightly below.',
                    'Drive through your heels to stand back up to the starting position.'
                ]
            },
            {
                name: 'Leg Press',
                muscle: 'Quadriceps',
                equipment: 'Machine',
                sets: 4, reps: '10-12', rest: '90s',
                instructions: [
                    'Sit in the leg press machine with feet shoulder-width apart on the platform.',
                    'Release the safety handles and lower the platform by bending your knees.',
                    'Lower until knees are at 90 degrees.',
                    'Press the platform back up without locking your knees.'
                ]
            },
            {
                name: 'Romanian Deadlift',
                muscle: 'Hamstrings',
                equipment: 'Barbell',
                sets: 3, reps: '10-12', rest: '90s',
                instructions: [
                    'Stand holding a barbell in front of your thighs with a shoulder-width grip.',
                    'Hinge at the hips, pushing them back while keeping legs nearly straight.',
                    'Lower the bar along your legs until you feel a stretch in your hamstrings.',
                    'Squeeze your glutes and hamstrings to return to standing.'
                ]
            },
            {
                name: 'Leg Extension',
                muscle: 'Quadriceps',
                equipment: 'Machine',
                sets: 3, reps: '12-15', rest: '45s',
                instructions: [
                    'Sit on the leg extension machine with your back against the pad.',
                    'Hook your feet under the roller pad at ankle level.',
                    'Extend your legs out in front of you, squeezing your quads at the top.',
                    'Slowly lower the weight back to the starting position.'
                ]
            },
            {
                name: 'Leg Curl',
                muscle: 'Hamstrings',
                equipment: 'Machine',
                sets: 3, reps: '12-15', rest: '45s',
                instructions: [
                    'Lie face down on the leg curl machine.',
                    'Position the pad just above your heels.',
                    'Curl your legs up towards your glutes, squeezing at the top.',
                    'Lower the weight slowly back to the starting position.'
                ]
            },
            {
                name: 'Walking Lunge',
                muscle: 'Glutes',
                equipment: 'Dumbbell',
                sets: 3, reps: '12 each leg', rest: '60s',
                instructions: [
                    'Hold dumbbells at your sides, standing tall.',
                    'Step forward with one leg and lower your back knee towards the floor.',
                    'Push off your front foot to bring your back leg forward into the next lunge.',
                    'Continue alternating legs as you walk forward.'
                ]
            },
            {
                name: 'Calf Raise',
                muscle: 'Calves',
                equipment: 'Machine',
                sets: 4, reps: '15-20', rest: '45s',
                instructions: [
                    'Stand on the calf raise machine with the balls of your feet on the edge.',
                    'Lower your heels below the platform for a full stretch.',
                    'Push up onto your toes as high as possible, squeezing your calves.',
                    'Lower slowly back to the starting position.'
                ]
            }
        ]
    },
    { // Friday - Abs/Shoulder
        day: 'Friday',
        type: 'Abs / Shoulder',
        isRest: false,
        exercises: [
            {
                name: 'Overhead Press',
                muscle: 'Shoulders',
                equipment: 'Barbell',
                sets: 4, reps: '8-10', rest: '90s',
                instructions: [
                    'Stand with feet shoulder-width apart, holding a barbell at shoulder level.',
                    'Brace your core and press the bar directly overhead.',
                    'Lock out your arms at the top.',
                    'Lower the bar slowly back to shoulder level.'
                ]
            },
            {
                name: 'Lateral Raise',
                muscle: 'Shoulders',
                equipment: 'Dumbbell',
                sets: 4, reps: '12-15', rest: '45s',
                instructions: [
                    'Stand holding dumbbells at your sides with a slight bend in your elbows.',
                    'Raise both arms out to the sides until they reach shoulder height.',
                    'Keep a slight bend in elbows and avoid swinging.',
                    'Lower the weights slowly back to your sides.'
                ]
            },
            {
                name: 'Face Pull',
                muscle: 'Rear Delts',
                equipment: 'Cable',
                sets: 3, reps: '15-20', rest: '45s',
                instructions: [
                    'Set a cable pulley to upper chest height with a rope attachment.',
                    'Grab the rope with both hands, palms facing each other.',
                    'Pull the rope towards your face, separating your hands at the end.',
                    'Squeeze your rear delts and slowly return to the starting position.'
                ]
            },
            {
                name: 'Front Raise',
                muscle: 'Shoulders',
                equipment: 'Dumbbell',
                sets: 3, reps: '12-15', rest: '45s',
                instructions: [
                    'Stand holding dumbbells in front of your thighs with palms facing your body.',
                    'Raise one or both arms straight in front of you to shoulder height.',
                    'Keep a slight bend in the elbows throughout.',
                    'Lower slowly back to the starting position.'
                ]
            },
            {
                name: 'Hanging Leg Raise',
                muscle: 'Abs',
                equipment: 'Body Weight',
                sets: 3, reps: '12-15', rest: '45s',
                instructions: [
                    'Hang from a pull-up bar with arms fully extended.',
                    'Keep your legs straight and raise them up in front of you.',
                    'Lift until your legs are parallel to the floor or higher.',
                    'Lower your legs slowly with control, avoiding swinging.'
                ]
            },
            {
                name: 'Russian Twist',
                muscle: 'Obliques',
                equipment: 'Body Weight',
                sets: 3, reps: '20 total', rest: '45s',
                instructions: [
                    'Sit on the floor with knees bent, leaning back slightly.',
                    'Hold a weight plate or medicine ball at your chest.',
                    'Rotate your torso to one side, then the other, touching the weight to the floor.',
                    'Keep your core engaged and feet slightly off the ground for added difficulty.'
                ]
            },
            {
                name: 'Plank',
                muscle: 'Core',
                equipment: 'Body Weight',
                sets: 3, reps: '45-60s hold', rest: '30s',
                instructions: [
                    'Get into a forearm plank position with elbows under shoulders.',
                    'Keep your body in a straight line from head to heels.',
                    'Engage your core, glutes, and quads.',
                    'Hold the position for the prescribed time without letting your hips sag.'
                ]
            }
        ]
    },
    { // Saturday - Cardio
        day: 'Saturday',
        type: 'Cardio',
        isRest: false,
        exercises: [
            {
                name: 'Treadmill Running',
                muscle: 'Cardio',
                equipment: 'Treadmill',
                sets: 1, reps: '20-30 min', rest: 'N/A',
                instructions: [
                    'Start with a 5-minute warm-up walk at a moderate pace.',
                    'Increase to your target running speed.',
                    'Maintain a steady pace or alternate with intervals of higher intensity.',
                    'Cool down with a 5-minute walk at the end.'
                ]
            },
            {
                name: 'Rowing Machine',
                muscle: 'Full Body',
                equipment: 'Rowing Machine',
                sets: 1, reps: '15-20 min', rest: 'N/A',
                instructions: [
                    'Sit on the rowing machine with feet strapped in securely.',
                    'Grab the handle with both hands, arms extended.',
                    'Drive with your legs first, then lean back and pull the handle to your chest.',
                    'Return by extending arms, leaning forward, then bending knees.'
                ]
            },
            {
                name: 'Jump Rope',
                muscle: 'Cardio',
                equipment: 'Jump Rope',
                sets: 3, reps: '3-5 min', rest: '60s',
                instructions: [
                    'Hold the rope handles at hip height with elbows close to your body.',
                    'Swing the rope overhead and jump with both feet together.',
                    'Stay on the balls of your feet and keep jumps small.',
                    'Maintain a steady rhythm and breathing pattern.'
                ]
            },
            {
                name: 'Stationary Bike',
                muscle: 'Cardio',
                equipment: 'Stationary Bike',
                sets: 1, reps: '20-30 min', rest: 'N/A',
                instructions: [
                    'Adjust the seat height so your leg is slightly bent at the bottom of the pedal stroke.',
                    'Start with a light resistance warm-up for 5 minutes.',
                    'Increase resistance and maintain a cadence of 70-90 RPM.',
                    'Cool down with low resistance for the last 5 minutes.'
                ]
            },
            {
                name: 'Burpees',
                muscle: 'Full Body',
                equipment: 'Body Weight',
                sets: 3, reps: '10-15', rest: '60s',
                instructions: [
                    'Start standing, then drop into a squat position with hands on the floor.',
                    'Kick your feet back into a push-up position.',
                    'Perform a push-up, then jump your feet back to your hands.',
                    'Explosively jump up with arms overhead.'
                ]
            },
            {
                name: 'Battle Ropes',
                muscle: 'Full Body',
                equipment: 'Battle Ropes',
                sets: 3, reps: '30-45s', rest: '45s',
                instructions: [
                    'Stand with feet shoulder-width apart, holding one end of the rope in each hand.',
                    'Bend slightly at the knees and hinge at the hips.',
                    'Alternate raising and lowering each arm rapidly to create waves in the rope.',
                    'Keep your core engaged and maintain intensity throughout the interval.'
                ]
            }
        ]
    },
    { // Sunday - Rest
        day: 'Sunday',
        type: 'Rest Day',
        isRest: true,
        exercises: []
    }
];

function updateWorkoutPage() {
    const savedDiet = localStorage.getItem('medtrackr-dietData');
    const savedUser = localStorage.getItem('medtrackr-userData');

    if (savedDiet) Object.assign(dietData, JSON.parse(savedDiet));
    if (savedUser) Object.assign(userData, JSON.parse(savedUser));

    const noData = document.getElementById('noWorkoutData');
    const content = document.getElementById('workoutContent');

    if (!dietData.dailyCalories || dietData.dailyCalories === 0) {
        noData.style.display = 'block';
        content.style.display = 'none';
        return;
    }

    noData.style.display = 'none';
    content.style.display = 'block';

    // Load saved workout data
    const savedWorkout = localStorage.getItem('medtrackr-workoutData');
    if (savedWorkout) {
        Object.assign(workoutData, JSON.parse(savedWorkout));
    }

    // Calculate total weeks from diet duration
    workoutData.totalWeeks = Math.ceil((dietData.duration * 30) / 7);

    renderWorkoutProgress();
    renderWorkoutDayTabs();
    renderWorkoutDayContent();
}

function renderWorkoutProgress() {
    const totalDays = workoutData.totalWeeks * 7;
    const completedCount = Object.keys(workoutData.completedDays).length;
    const percent = Math.round((completedCount / totalDays) * 100);

    // Calculate current day number
    const currentDayNumber = (workoutData.currentWeek - 1) * 7 + workoutData.currentDay + 1;

    document.getElementById('workoutCurrentDay').textContent = Math.min(currentDayNumber, totalDays);
    document.getElementById('workoutTotalDays').textContent = totalDays;
    document.getElementById('workoutCompletedDays').textContent = completedCount;
    document.getElementById('workoutWeekTitle').textContent = 'Week ' + workoutData.currentWeek;

    setTimeout(() => {
        document.getElementById('workoutProgressFill').style.width = percent + '%';
        document.getElementById('workoutProgressPercent').textContent = percent + '%';
    }, 300);

    // Update week nav buttons
    document.getElementById('prevWeekBtn').disabled = workoutData.currentWeek <= 1;
    document.getElementById('nextWeekBtn').disabled = workoutData.currentWeek >= workoutData.totalWeeks;
}

function changeWorkoutWeek(delta) {
    const newWeek = workoutData.currentWeek + delta;
    if (newWeek < 1 || newWeek > workoutData.totalWeeks) return;
    workoutData.currentWeek = newWeek;
    workoutData.currentDay = 0;
    saveWorkoutData();
    renderWorkoutProgress();
    renderWorkoutDayTabs();
    renderWorkoutDayContent();
}

function renderWorkoutDayTabs() {
    const container = document.getElementById('workoutDayTabs');
    container.innerHTML = '';

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
        const split = WEEKLY_SPLIT[i];
        const key = workoutData.currentWeek + '-' + i;
        const isCompleted = workoutData.completedDays[key];

        const tab = document.createElement('div');
        tab.className = 'workout-day-tab';
        if (i === workoutData.currentDay) tab.classList.add('active');
        if (split.isRest) tab.classList.add('rest-day');
        if (isCompleted) tab.classList.add('completed');

        tab.innerHTML = '<span class="workout-day-tab-name">' + dayNames[i] + '</span>' +
            '<span class="workout-day-tab-type">' + split.type + '</span>';

        tab.addEventListener('click', function() {
            workoutData.currentDay = i;
            saveWorkoutData();
            renderWorkoutDayTabs();
            renderWorkoutDayContent();
        });

        container.appendChild(tab);
    }
}

function renderWorkoutDayContent() {
    const container = document.getElementById('workoutDayContent');
    const split = WEEKLY_SPLIT[workoutData.currentDay];
    const dayKey = workoutData.currentWeek + '-' + workoutData.currentDay;
    const isCompleted = workoutData.completedDays[dayKey];

    if (split.isRest) {
        container.innerHTML =
            '<div class="workout-rest-day">' +
                '<div class="rest-icon"><i class="fas fa-bed"></i></div>' +
                '<h3>' + split.day + ' — Rest Day</h3>' +
                '<p>Recovery is essential for muscle growth. Stay hydrated, stretch, and get plenty of sleep. Light walking or yoga is encouraged.</p>' +
                (isCompleted ? '' :
                    '<button class="btn btn-primary btn-sm" style="margin-top:1.5rem;" onclick="markDayComplete()">' +
                        '<i class="fas fa-check"></i> Mark as Complete' +
                    '</button>') +
                (isCompleted ?
                    '<div style="margin-top:1.5rem;color:var(--success);font-weight:700;"><i class="fas fa-check-circle"></i> Completed</div>' : '') +
            '</div>';
        return;
    }

    let html =
        '<div class="workout-day-header">' +
            '<div class="workout-day-header-info">' +
                '<h3>' + split.day + ' — ' + split.type + '</h3>' +
                '<p>' + split.exercises.length + ' exercises</p>' +
            '</div>' +
            '<button class="workout-day-complete-btn ' + (isCompleted ? 'completed' : '') + '" onclick="markDayComplete()">' +
                '<i class="fas fa-' + (isCompleted ? 'check-circle' : 'check') + '"></i> ' +
                (isCompleted ? 'Completed' : 'Mark Complete') +
            '</button>' +
        '</div>';

    html += '<div class="workout-exercises-list">';

    split.exercises.forEach(function(exercise, idx) {
        const imgUrl = EXERCISE_IMAGES[exercise.name] || '';
        const thumbUrl = imgUrl;

        html +=
            '<div class="workout-exercise-card" id="exercise-' + workoutData.currentDay + '-' + idx + '">' +
                '<div class="workout-exercise-header" onclick="toggleExercise(' + workoutData.currentDay + ',' + idx + ')">' +
                    '<div class="workout-exercise-thumb">' +
                        (thumbUrl ? '<img src="' + thumbUrl + '" alt="' + exercise.name + '" loading="lazy">' :
                            '<i class="fas fa-dumbbell" style="font-size:1.3rem;color:var(--primary);"></i>') +
                    '</div>' +
                    '<div class="workout-exercise-info">' +
                        '<div class="workout-exercise-name">' + exercise.name + '</div>' +
                        '<div class="workout-exercise-tags">' +
                            '<span class="workout-exercise-tag muscle">' + exercise.muscle + '</span>' +
                            '<span class="workout-exercise-tag equipment">' + exercise.equipment + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<button class="workout-exercise-toggle"><i class="fas fa-plus"></i></button>' +
                '</div>' +
                '<div class="workout-exercise-details">' +
                    '<div class="workout-exercise-details-inner">' +
                        '<div class="workout-exercise-image">' +
                            (imgUrl ? '<img src="' + imgUrl + '" alt="' + exercise.name + '" loading="lazy">' :
                                '<i class="fas fa-image" style="font-size:3rem;color:var(--text-muted);"></i>') +
                        '</div>' +
                        '<div class="workout-exercise-desc">' +
                            '<h4>' + exercise.name + '</h4>' +
                            '<div class="workout-exercise-sets">' +
                                '<div class="workout-set-info"><span>Sets</span><span>' + exercise.sets + '</span></div>' +
                                '<div class="workout-set-info"><span>Reps</span><span>' + exercise.reps + '</span></div>' +
                                '<div class="workout-set-info"><span>Rest</span><span>' + exercise.rest + '</span></div>' +
                            '</div>' +
                            '<div class="workout-exercise-instructions">' +
                                '<h5>How to Perform</h5>' +
                                '<ol>' + exercise.instructions.map(function(step) { return '<li>' + step + '</li>'; }).join('') + '</ol>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

function toggleExercise(day, idx) {
    const card = document.getElementById('exercise-' + day + '-' + idx);
    if (card) {
        card.classList.toggle('expanded');
    }
}

function markDayComplete() {
    const dayKey = workoutData.currentWeek + '-' + workoutData.currentDay;
    if (workoutData.completedDays[dayKey]) {
        delete workoutData.completedDays[dayKey];
    } else {
        workoutData.completedDays[dayKey] = true;
    }
    saveWorkoutData();
    renderWorkoutProgress();
    renderWorkoutDayTabs();
    renderWorkoutDayContent();
    showToast(workoutData.completedDays[dayKey] ? 'Day marked as complete!' : 'Day marked as incomplete');
}

function saveWorkoutData() {
    localStorage.setItem('medtrackr-workoutData', JSON.stringify(workoutData));
}

function resetWorkoutPlan() {
    workoutData = {
        currentWeek: 1,
        currentDay: 0,
        totalWeeks: 0,
        completedDays: {}
    };
    localStorage.removeItem('medtrackr-workoutData');
    updateWorkoutPage();
    showToast('Workout plan has been reset');
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
    const revealElements = document.querySelectorAll('.feature-card, .stat-item, .dash-card, .macro-card, .goal-card, .daily-card, .macro-plan-card, .workout-exercise-card');
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
